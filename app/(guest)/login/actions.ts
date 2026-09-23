"use server";

import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

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
    return { error: "Заповніть усі поля" };
  }

  const admin = await db.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { error: "Невірний email або пароль" };
  }

  if (admin.status !== "ACTIVE") {
    return { error: "Обліковий запис не активовано або заблоковано" };
  }

  const isPasswordValid = await verifyPassword(
    password,
    admin.passwordHash || ""
  );

  if (!isPasswordValid) {
    return { error: "Невірний email або пароль" };
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  // Повертаємо success замість redirect()
  return { success: true };
}