"use server";

import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit"; 

export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    logAuditEvent({
      adminEmail: email || null,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: "Missing email or password" },
    });

    return { error: "Заповніть усі поля" };
  }

  const admin = await db.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    logAuditEvent({
      adminEmail: email,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: "User not found" },
    });

    return { error: "Невірний email або пароль" };
  }

  if (admin.status !== "ACTIVE") {
    logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: `Account status is ${admin.status}` },
    });

    return { error: "Обліковий запис не активовано або заблоковано" };
  }

  const isPasswordValid = await verifyPassword(
    password,
    admin.passwordHash || ""
  );

  if (!isPasswordValid) {
    logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: "Invalid password" },
    });

    return { error: "Невірний email або пароль" };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  logAuditEvent({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "AUTH_LOGIN_SUCCESS",
    entity: "Session",
    entityId: admin.id,
  });

  return { success: true };
}