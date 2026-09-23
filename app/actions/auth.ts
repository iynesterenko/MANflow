"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword, createSession, deleteSession, getSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function login(prevState: any, formData: FormData) {
  const [email, password] = [
    formData.get("email") as string,
    formData.get("password") as string,
  ];

  if (!email || !password) {
    logAuditEvent({
      adminEmail: email || null,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: "Missing email or password" },
    });

    return { error: "Заполніть всі поля" };
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

    return { error: "Невірний ємейл або пароль" };
  }

  // 3. Проверка пароля
  const isPasswordValid = await verifyPassword(
    password,
    admin.passwordHash || "aswd",
  );

  if (!isPasswordValid) {
    logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_LOGIN_FAILED",
      entity: "Session",
      details: { reason: "Invalid password" },
    });

    return { error: "Невірний ємейл або пароль" };
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

  redirect("/dashboard");
}

export async function logout() {
  const session = await getSession().catch(() => null);

  await deleteSession();

  logAuditEvent({
    adminId: session?.adminId || null,
    adminEmail: session?.email || null,
    action: "AUTH_LOGOUT",
    entity: "Session",
  });

  redirect("/dashboard");
}