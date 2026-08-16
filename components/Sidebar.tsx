import Link from "next/link";
import { UserRole, SessionPayload } from "@/lib/auth";

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col space-y-6">
      <a>МАН.кадри</a>
      <nav className=" flex-col space-y-2">
        <Link href="/dashboard">Головна</Link>
        <Link href="/employees">Працівники</Link>
        {userRole === "SA" && <Link href="/admins">Адміністратори</Link>}
      </nav>
    </aside>
  );
}
