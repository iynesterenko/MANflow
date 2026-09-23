"use client";

import { useEffect, Suspense, useActionState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordAction } from "./actions";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, formAction, isPending] = useActionState(
    ResetPasswordAction,
    null,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token || ""} />

      <div>
        <input
          type="password"
          name="password"
          placeholder="Новий пароль"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторити пароль"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? "Оновлення..." : "Змінити пароль"}
      </button>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {state.error}
        </p>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Завантаження...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
