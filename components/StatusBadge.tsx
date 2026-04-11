import { AuditLog } from "@/lib/data";

type BadgeType = "NEW" | "TRANSFER" | "PENDING_ACCOUNT_CREATION" | "COMPLETED" | AuditLog["event"];

const config: Record<string, { label: string; className: string; icon?: string }> = {
  NEW: { label: "NEW", className: "bg-yellow-100 text-yellow-700 border border-yellow-300", icon: "⏱" },
  TRANSFER: { label: "TRANSFER", className: "bg-[#005EB8]/10 text-[#005EB8] border border-[#005EB8]/30", icon: "⇄" },
  PENDING_ACCOUNT_CREATION: { label: "PENDING ACCOUNT CREATION", className: "bg-purple-100 text-purple-700 border border-purple-300", icon: "⏱" },
  COMPLETED: { label: "COMPLETED", className: "bg-green-100 text-green-700 border border-green-300", icon: "✓" },
  APPROVE_REGISTRATION: { label: "APPROVE REGISTRATION", className: "bg-green-100 text-green-700" },
  REJECT_REGISTRATION: { label: "REJECT REGISTRATION", className: "bg-red-50 text-red-700" },
  APPROVE_TRANSFER: { label: "APPROVE TRANSFER", className: "bg-green-100 text-green-700" },
  REJECT_TRANSFER: { label: "REJECT TRANSFER", className: "bg-red-50 text-red-700" },
  COMPLETE_ACCOUNT: { label: "COMPLETE ACCOUNT", className: "bg-[#005EB8]/10 text-[#005EB8]" },
};

export default function StatusBadge({ type }: { type: BadgeType }) {
  const c = config[type] ?? { label: type, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.className}`}>
      {c.icon && <span>{c.icon}</span>}
      {c.label}
    </span>
  );
}
