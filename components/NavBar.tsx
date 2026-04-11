"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Account List" },
    { href: "/audit-log", label: "Audit Log" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-stretch justify-between h-14">

        {/* Left: Giant Group logo + Admin Console label + Tabs */}
        <div className="flex items-stretch gap-6">
          {/* Logo + label — centered vertically */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/giant-logo-mark.svg" alt="" style={{ width: 19, height: 18, flexShrink: 0 }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/giant-logo-text.svg" alt="Giant Group" style={{ width: 86, height: 23, flexShrink: 0 }} />
            </div>
            <span className="text-sm font-semibold flex-shrink-0" style={{ color: "#101828" }}>Admin Console</span>
          </div>

          <div className="w-px bg-gray-200 self-center h-5 flex-shrink-0" />

          {/* Tabs — stretch to full nav height */}
          <div className="flex items-stretch gap-1">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative flex items-center px-3 text-sm transition-colors ${
                    active ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0057A8]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Avatar button */}
        <div className="flex items-center">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
            style={{ backgroundColor: "#005EB8" }}
            aria-label="Account menu"
          >
            G
          </button>
        </div>

      </div>
    </nav>
  );
}
