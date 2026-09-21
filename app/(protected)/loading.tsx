export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Скелетон шапки */}
      <div className="h-8 bg-slate-200 rounded-md w-1/4"></div>

      {/* Скелетон для 3 карт дашборду */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-slate-200 rounded-lg"></div>
        <div className="h-28 bg-slate-200 rounded-lg"></div>
        <div className="h-28 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Скелетон таблиці */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-3">
        <div className="h-6 bg-slate-200 rounded w-1/6"></div>
        <div className="h-10 bg-slate-100 rounded"></div>
        <div className="h-10 bg-slate-100 rounded"></div>
        <div className="h-10 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
}