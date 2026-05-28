import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { FormaPagamento, StatusPedido, TipoUsuario } from "../../types";
import { traduzirFormaPagamento, traduzirStatusPedido, traduzirTipoUsuario } from "../../utils/formatters";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#E8442A] text-white hover:bg-[#d23920] disabled:bg-slate-300",
    secondary: "bg-white text-slate-700 border border-gray-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:text-[#E8442A] hover:bg-orange-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition shadow-sm disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#E8442A] ${className}`}
    />
  );
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">Buscar</span>
      <Input {...props} className={`pl-20 ${props.className ?? ""}`} />
    </div>
  );
}

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-[#E8442A]" />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-lg font-black text-[#E8442A]">
        BA
      </div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`w-full ${className}`}>{children}</section>;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">{children}</div>
    </div>
  );
}

export function Toast({ message, tone = "info" }: { message: string; tone?: "info" | "error" | "success" }) {
  const tones = {
    info: "border-orange-100 bg-white text-slate-700",
    error: "border-red-100 bg-red-50 text-red-700",
    success: "border-green-100 bg-green-50 text-green-700",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${tones[tone]}`}>{message}</div>;
}

export function ConfirmDialog({ children }: { children: ReactNode }) {
  return <Modal>{children}</Modal>;
}

export function StatusBadge({
  value,
  type = "generic",
}: {
  value?: StatusPedido | TipoUsuario | FormaPagamento | boolean | string;
  type?: "pedido" | "usuario" | "pagamento" | "boolean" | "generic";
}) {
  const text =
    type === "pedido" && typeof value === "string"
      ? traduzirStatusPedido(value as StatusPedido)
      : type === "usuario" && typeof value === "string"
      ? traduzirTipoUsuario(value as TipoUsuario)
      : type === "pagamento" && typeof value === "string"
      ? traduzirFormaPagamento(value as FormaPagamento)
      : typeof value === "boolean"
      ? value
        ? "Ativo"
        : "Inativo"
      : value || "Sem status";

  const isGood = ["ACEITO", "PRONTO", "ENTREGUE", "ADMIN", "CLIENTE", "PIX", true, "Aberto", "Ativo"].includes(value as never);
  const isBad = ["RECUSADO", "CANCELADO", false, "Fechado", "Inativo"].includes(value as never);
  const color = isGood
    ? "bg-green-50 text-green-700 border-green-100"
    : isBad
    ? "bg-red-50 text-red-700 border-red-100"
    : "bg-orange-50 text-[#E8442A] border-orange-100";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${color}`}>{text}</span>;
}
