"use server";

import { db } from "@/lib/db";
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
    return { error: "Заповніть поле email" };
  }

  const admin = await db.admin.findUnique({
    where: { email },
  });

  if (admin && admin.status === "ACTIVE") {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 година

    // Видаляємо попередні невикористані токени
    await db.passwordResetToken.deleteMany({
      where: { adminId: admin.id },
    });

    await db.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        adminId: admin.id,
      },
    });

    console.log(
      `🔗 Reset link: http://localhost:3000/reset-password?token=${token}`
    );
  }

  return {
    success: "Якщо акаунт існує та активний, інструкції надіслано на email",
  };
}