"use client";

import { useEffect, useActionState } from "react";
import { forgotPasswordAction } from "./actions";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-slate-800">
          Забули пароль
        </h2>

        {state?.success && (
          <div className="rounded-lg p-3 text-sm text-green-700 bg-green-50 border border-green-200">
            {state.success}
          </div>
        )}

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

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          >
            {isPending ? "Надсилання..." : "Надіслати інструкції"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-xs text-blue-600 hover:underline"
          >
            Повернутися до входу
          </Link>
        </div>
      </div>
    </div>
  );
}