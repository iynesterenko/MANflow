"use server";

import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import crypto from "crypto";

export type ForgotPasswordState = {
  error?: string;
  success?: string;
} | null;

export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    logAuditEvent({
      adminEmail: email || null,
      action: "AUTH_PASSWORD_RESET_REQUEST_FAILED",
      entity: "PasswordResetToken",
      details: { reason: "Missing email" },
    });

    return { error: "Заповніть поле email" };
  }

  const admin = await db.admin.findUnique({
    where: { email },
  });

  if (admin && admin.status === "ACTIVE") {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await db.passwordResetToken.deleteMany({
      where: { adminId: admin.id },
    });

    const resetToken = await db.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        adminId: admin.id,
      },
    });

    logAuditEvent({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "AUTH_PASSWORD_RESET_REQUESTED",
      entity: "PasswordResetToken",
      entityId: resetToken.id,
    });

    console.log(
      `🔗 Reset link: http://localhost:3000/reset-password?token=${token}`
    );
  } else {
    logAuditEvent({
      adminEmail: email,
      action: "AUTH_PASSWORD_RESET_REQUEST_FAILED",
      entity: "PasswordResetToken",
      details: {
        reason: !admin ? "User not found" : `Account status is ${admin.status}`,
      },
    });
  }

  return {
    success: "Якщо акаунт існує та активний, інструкції надіслано на email",
  };
}