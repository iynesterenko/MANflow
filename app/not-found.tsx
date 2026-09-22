import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function NotFound() {
  const session = await getSession();
  const isAuthenticated = Boolean(session?.adminId);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 font-bold text-2xl">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            404 — Сторінку не знайдено
          </h1>
          <p className="text-sm text-slate-600">
            Здається, такої сторінки не існує або вона була переміщена.
          </p>
        </div>

        <Link
          href={isAuthenticated ? "/dashboard" : "/login"}
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-md transition"
        >
          {isAuthenticated ? "Повернутися до панелі" : "Перейти до входу"}
        </Link>
      </div>
    </main>
  );
}