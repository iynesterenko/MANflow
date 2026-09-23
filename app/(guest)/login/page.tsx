"use client";

import { useEffect, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }

    if (state?.success) {
      toast.success("Успішний вхід в систему!");
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-slate-800">
        Вхід у систему
      </h2>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Емейл
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">
              Пароль
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline"
            >
              Забули пароль?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
        >
          {isPending ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}