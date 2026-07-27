import React from 'react'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Хедер / Брендинг */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            МАН.Кадри
          </h1>
          <p className="text-sm text-slate-500">
            Система кадрового документообігу
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          {children}
        </div>

        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} МАН. Усі права захищено.
        </p>
      </div>
    </div>
  )
}