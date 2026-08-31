import { getSession } from "@/lib/auth"; // або звідки у тебе getSession
import { db } from "@/lib/db";
import { logoutAction } from "../actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.adminId) {
    redirect("/login");
  }
  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
  });

  if (!admin) {
    return <p className="p-6">Користувача не знайдено</p>;
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Профіль користувача</h1>

      <div className="border p-4 rounded-lg bg-white shadow-sm space-y-2">
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Роль:</strong> {admin.role}</p>
        <p><strong>Дата створення:</strong> {new Date(admin.createdAt).toLocaleDateString("uk-UA")}</p>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Вийти з акаунту
        </button>
      </form>
    </div>
  );
}