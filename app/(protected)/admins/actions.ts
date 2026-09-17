"use server"
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function createAdminAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "SA") {
    return { error: "Немає прав" };
  }
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim().toLowerCase();
  const rawRole = formData.get("role") as string;
  if (!Object.values(Role).includes(rawRole as Role)) {
    return { error: "Некоректна роль користувача" };
  }
  const role = rawRole as Role;
  if (!email || !role) {
    return { error: "Заповніть усі обов'язкові поля" };
  }
  const existingAdmin = await db.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    return { error: "Адміністратор з таким Email вже існує" };
  }
  const tempPasswordHash = "PENDING_ACTIVATION";

  const newAdmin = await db.admin.create({
    data: {
      name,
      email,
      role,
      status: "PENDING",
      passwordHash: tempPasswordHash,
    },
  });
  const token = crypto.randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      adminId: newAdmin.id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  console.log(`http://localhost:3000/reset-password?token=${token}`);
  revalidatePath("/admins");
  return {
    success: true,
    message: `Адміністратора ${email} успішно створено!`,
  };
}
export async function toggleAdminStatusAction(
  adminId: number,
  currentStatus: string,
) {
  const session = await getSession();
  if (!session || session.role !== "SA") {
    return { error: "Немає прав" };
  }
  if (adminId == session.adminId) {
    return { error: "Не можна змінити статус власного акаунту" };
  }
  const newStatus = currentStatus === "DISABLED" ? "ACTIVE" : "DISABLED";
  try {
    await db.admin.update({
      where: { id: adminId },
      data: { status: newStatus },
    });

    revalidatePath("/admins");
    return { success: true };
  } catch (error) {
    return { error: "Не вдалося оновити статус" };
  }
}
export async function deleteAdminAction(
  adminId: number,
) {
  const session = await getSession();
  if (!session || session.role !== "SA") {
    return { error: "Немає прав" };
  }
  if (adminId == session.adminId) {
    return { error: "Не можна видалити власний акаунт" };
  }
  try {
    await db.passwordResetToken.deleteMany({
      where: { adminId },
    });

    await db.admin.delete({
      where: { id: adminId },
    });

    revalidatePath("/admins");
    return { success: true };
  } catch (error) {
    return { error: "Не вдалося видалити акаунт" };
  }
}
