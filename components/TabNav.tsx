"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Account List" },
  { href: "/audit-log", label: "Audit Log" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#005EB8] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
