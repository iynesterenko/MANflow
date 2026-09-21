import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminsPage() {
  const session = await getSession();
  if (!session || session.role !== "SA") {
    redirect("/forbidden");
  }
  const admins = await db.admin.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Управління адміністраторами
        </h1>
        <Link
          href="/admins/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
        >
          Запросити / Додати адміна
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Ім'я</th>
              <th className="px-6 py-3">Роль</th>
              <th className="px-6 py-3">Статус</th>
              <th className="px-6 py-3">Дата створення</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {admin.email}
                </td>
                <td className="px-6 py-4">{admin.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded font-semibold border border-slate-200">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      admin.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : admin.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(admin.createdAt).toLocaleDateString("uk-UA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
