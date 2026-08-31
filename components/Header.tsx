import Link from "next/link";
import { logoutAction } from "@/app/(protected)/actions";

interface HeaderProps {
  userEmail?: string;
  userRole?: string;
}

export default function Header({ userEmail, userRole }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between text-slate-800">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-700">{userEmail}</span>
        {userRole && (
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300 font-semibold">
            {userRole}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/profile"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          Мій профіль
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition"
          >
            Вийти
          </button>
        </form>
      </div>
    </header>
  );
}