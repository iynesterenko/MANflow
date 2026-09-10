"use server";

import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Заповніть усі поля" };
  }

  const password = formData.get("password") as string;
  if (!password || !email) {
    return { error: "Заповніть усі поля" };
  }

  const admin = await db.admin.findUnique({
  where: { email },
})
  if (!admin) {
    return { error: "Невірний email або пароль" };
  }

  const isPasswordValid = await verifyPassword(password, admin.passwordHash || '');
  if (!isPasswordValid) {
    return { error: "Невірний email або пароль" };
  }
  await createSession({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  redirect("/dashboard");
}
