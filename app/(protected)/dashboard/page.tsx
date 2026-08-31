import { getSession } from "@/lib/auth"; // або "@/lib/session"

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Вітаємо в системі МАН.Кадри</h1>

      <div className="border p-4 rounded-lg bg-white shadow-sm">
        <h2 className="font-semibold mb-2">Дані поточного сеансу</h2>
        <p><strong>Email:</strong> {session?.email}</p>
        <p><strong>Роль:</strong> {session?.role}</p>
        <p><strong>ID:</strong> {session?.adminId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg">Співробітники</h3>
          <p className="text-sm text-gray-500">Управління персоналом</p>
        </div>
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg">Документи</h3>
          <p className="text-sm text-gray-500">Накази та звіти</p>
        </div>
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg">Адміністратори</h3>
          <p className="text-sm text-gray-500">Налаштування доступу</p>
        </div>
      </div>
    </div>
  );
}