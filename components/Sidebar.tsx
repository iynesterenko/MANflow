import Link from "next/link";

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col space-y-6">
      <div className="text-xl font-bold px-2">МАН.кадри</div>

      <nav className="flex flex-col space-y-2">
        <Link
          href="/dashboard"
          className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white transition"
        >
          Головна
        </Link>
        <Link
          href="/employees"
          className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white transition"
        >
          Працівники
        </Link>
        {userRole === "SA" && (
          <Link
            href="/admins"
            className="px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            Адміністратори
          </Link>
        )}
      </nav>
    </aside>
  );
}