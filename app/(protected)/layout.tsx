import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
    if (!session) {
    redirect('/login')
  }
  return (
    <div>
        <div className="flex min-h-screen bg-slate-100">
      <Sidebar userRole={session.role} />

      <div className="flex-1 flex flex-col">
        <Header userEmail={session.email} userRole={session.role} />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </div>)}
