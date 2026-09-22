"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled Server/Runtime Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 font-bold text-xl">
          ⚠️
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            Щось пішло не так
          </h1>
          <p className="text-sm text-slate-600">
            Щось пішло не так при завантаженні сторінки.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2.5 rounded-md transition"
        >
          Спробувати знову
        </button>
      </div>
    </main>
  );
}