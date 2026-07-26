"use server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, createSession, deleteSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function login(prevState: any, formData: FormData) {
  const [email, password] = [
    formData.get("email") as string,
    formData.get("password") as string,
  ];
  if (!email || !password) {
    return { error: "Заполніть всі поля" };
  }
  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  if (!admin) {
    return "Невірний еймейл або пароль";
  }
  const isPasswordValid = await verifyPassword(password, admin.password);
  if (!isPasswordValid) {
    return "Невірний еймейл або пароль";
  }
  await createSession({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });
  redirect("/dashboard");
}
export async function logout() {
  await deleteSession();
  redirect("/dashboard");
}
