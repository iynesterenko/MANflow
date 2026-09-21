import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 font-bold text-xl">
          403
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            403 — Доступ обмежено
          </h1>
          <p className="text-sm text-slate-600">
            У вас немає достатньо прав для перегляду цього розділу.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-md transition"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}