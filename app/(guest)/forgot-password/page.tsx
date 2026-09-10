"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";
import Link from "next/link";

export default function ForgotPassword() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null,
  );
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form action={formAction}>
        <h2 className="text-lg font-semibold text-slate-800">Забули пароль</h2>
        <input name="email" type="email"></input>
        <button disabled={isPending}>
          {isPending ? "Завантаження..." : "Натисни мене"}
        </button>
        {state?.error && <p className="text-red-500">{state.error}</p>}
        {state?.success && <p className="text-green-500">{state.success}</p>}
        <Link href="/login">Повернутися до входу</Link>
      </form>
    </div>
  );
}
