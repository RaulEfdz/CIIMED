"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((ts) => [...ts, { id, message, type }]);
    setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id));
    }, 3500);
  };
  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
