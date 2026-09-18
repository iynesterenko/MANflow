"use client";

import { useActionState } from "react";
import { createAdminAction } from "../actions";
import Link from "next/link";

export default function NewAdminPage() {
  const [state, formAction, isPending] = useActionState(createAdminAction, null);

  return (
    <div className="max-w-xl space-y-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Додати адміністратора</h1>
        <Link
          href="/admins"
          className="text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          ← Назад до списку
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ім'я
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Іван Іванов"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Роль
            </label>
            <select
              name="role"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 bg-white"
            >
              <option value="CLERK">CLERK (Клерк)</option>
              <option value="ACCOUNTANT">ACCOUNTANT (Бухгалтер)</option>
              <option value="DIRECTOR">DIRECTOR (Директор)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition text-sm disabled:opacity-50"
          >
            {isPending ? "Створення..." : "Створити та згенерувати посилання"}
          </button>

          {state?.error && (
            <p className="text-sm text-red-600 font-medium bg-red-50 p-2.5 rounded border border-red-200">
              {state.error}
            </p>
          )}

          {state?.success && (
            <p className="text-sm text-green-600 font-medium bg-green-50 p-2.5 rounded border border-green-200">
              {state.message} 
            </p>
          )}
        </form>
      </div>
    </div>
  );
}