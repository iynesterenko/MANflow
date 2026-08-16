"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setError(null);
    try {
      setIsLoading(true);
      console.log({ email, password });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-slate-800">
        Вхід у систему
      </h2>
      {error && (
        <div className="rounded-lg p-3 text-md text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-center text-md font-medium text-slate-700">
          Емейл
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@gmail.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-center text-md font-medium text-slate-700">
          Пароль
        </label>
        <Link 
          href="/forgot-password"
          className=" text-xs text-blue-600 mx-5 "
        >
          Забули пароль?
        </Link>

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="qwerty"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></input>

        <button
          className="w-1/2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}
