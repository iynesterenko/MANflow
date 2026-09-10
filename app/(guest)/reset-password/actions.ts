"use server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {redirect} from "next/navigation";


export async function ResetPasswordAction(prevState: any, formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  if (!token || !password || !confirmPassword)
    return { error: "Заповніть усі поля" };
  if (password !== confirmPassword) return { error: "Паролі не збігаються" };
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token: token },
    include: { admin: true },
  });
  if (!resetToken) {
    return { error: "Недійсний або застарілий токен" };
  } else if (resetToken.expiresAt < new Date()) {
    await db.passwordResetToken.delete({where: {id:resetToken.id}})
    return { error: "Термін дії токена закінчився. Замовте новий." }
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  await db.admin.update({where: {id:resetToken.adminId}, data:{passwordHash:hashedPassword}})
  await db.passwordResetToken.delete({ where: { id: resetToken.id } });
    redirect("/login")

}
