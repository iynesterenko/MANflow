import Link from "next/link";
import { UserRole } from "@/lib/auth";
import { logout } from "@/app/actions/auth"; // Імпортуємо Server Action виходу

interface HeaderProps {
  userEmail: string;
  userRole: UserRole;
}

export default function Header({ userEmail, userRole }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium ">{userEmail}</span>
        <span className="text-xs  rounded border ">
          {userRole}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/profile"
          className="text-sm font-medium"
        >
          Мій профіль
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium px-3 py-1.5 rounded-lg "
          >
            Вийти
          </button>
        </form>
      </div>
    </header>
  );
}
