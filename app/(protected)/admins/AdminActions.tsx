"use client";

import { useState, useTransition } from "react";
import { AdminStatus } from "@/app/generated/prisma/enums";
import { toggleAdminStatusAction, deleteAdminAction } from "./actions";

interface AdminActionsProps {
  adminId: number;
  adminEmail: string;
  status: AdminStatus;
  isCurrentAdmin: boolean;
}

export default function AdminActions({
  adminId,
  adminEmail,
  status,
  isCurrentAdmin,
}: AdminActionsProps) {
  if (isCurrentAdmin) {
    return (
      <span className="text-xs text-slate-400 italic">Поточний акаунт</span>
    );
  }

  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleAdminStatusAction(adminId, status);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAdminAction(adminId);
      setShowConfirm(false);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Кнопка зміни статусу */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 px-2.5 py-1 rounded transition disabled:opacity-50"
      >
        {status === "DISABLED" ? "Активувати" : "Деактивувати"}
      </button>

      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 px-2.5 py-1 rounded transition disabled:opacity-50"
      >
        Видалити
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Підтвердження видалення
            </h3>
            <p className="text-sm text-slate-600">
              Ви дійсно бажаєте видалити адміністратора{" "}
              <span className="font-semibold">{adminEmail}</span>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 rounded-md transition"
              >
                Скасувати
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
              >
                {isPending ? "Видалення..." : "Так, видалити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}