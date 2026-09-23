"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { logAuditEvent } from "@/lib/audit";

export type ResetActionState = {
  error?: string;
} | null;

export async function ResetPasswordAction(
  prevState: ResetActionState,
  formData: FormData
): Promise<ResetActionState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !password || !confirmPassword) {
    logAuditEvent({
      action: "AUTH_PASSWORD_RESET_FAILED",
      entity: "PasswordResetToken",
      details: { reason: "Missing required fields" },
    });

    return { error: "Заповніть усі поля" };
  }

  if (password !== confirmPassword) {
    logAuditEvent({
      action: "AUTH_PASSWORD_RESET_FAILED",
      entity: "PasswordResetToken",
      details: { reason: "Passwords do not match" },
    });

    return { error: "Паролі не збігаються" };
  }

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!resetToken) {
    logAuditEvent({
      action: "AUTH_PASSWORD_RESET_FAILED",
      entity: "PasswordResetToken",
      details: { reason: "Invalid token" },
    });

    return { error: "Недійсний або застарілий токен" };
  }

  if (resetToken.expiresAt < new Date()) {
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });

    logAuditEvent({
      adminId: resetToken.adminId,
      adminEmail: resetToken.admin.email,
      action: "AUTH_PASSWORD_RESET_FAILED",
      entity: "PasswordResetToken",
      entityId: resetToken.id,
      details: { reason: "Expired token" },
    });

    return { error: "Термін дії токена закінчився. Замовте новий." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.admin.update({
    where: { id: resetToken.adminId },
    data: { passwordHash: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { id: resetToken.id } });

  logAuditEvent({
    adminId: resetToken.adminId,
    adminEmail: resetToken.admin.email,
    action: "AUTH_PASSWORD_RESET_SUCCESS",
    entity: "Admin",
    entityId: resetToken.adminId,
  });

  redirect("/login");
}