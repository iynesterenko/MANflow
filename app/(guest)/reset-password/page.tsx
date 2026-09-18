"use client";
import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordAction } from "./actions";
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, formAction, isPending] = useActionState(
    ResetPasswordAction,
    null,
  );
  return (
    <Suspense>
      <form action={formAction}>
        <input type="hidden" name="token" value={token || ""}></input>
        <input
          type="password"
          name="password"
          placeholder="Новий пароль"
          required
        />{" "}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторити пароль"
          required
        />{" "}
        <button disabled={isPending}>Змінити пароль</button>
        {state?.error && <p className="text-red-500">{state.error}</p>}
      </form>
    </Suspense>
  );
}
