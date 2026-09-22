"use server";

import { deleteSession, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logAuditEvent } from "@/lib/audit";

export async function logoutAction() {
  const session = await getSession().catch(() => null);

  await deleteSession();

  logAuditEvent({
    adminId: session?.adminId || null,
    adminEmail: session?.email || null,
    action: "AUTH_LOGOUT",
    entity: "Session",
  });

  redirect("/login");
}