"use client";

import { useTab, Tab } from "@/lib/tab-context";

export default function NavBar() {
  const { tab, setTab } = useTab();

  const tabs: { key: Tab; label: string }[] = [
    { key: "accounts",  label: "Account List" },
    { key: "audit-log", label: "Audit Log" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-stretch justify-between h-14">

        {/* Left: Logo + label + Tabs */}
        <div className="flex items-stretch gap-6">
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

          {/* Tabs */}
          <div className="flex items-stretch gap-1">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative flex items-center h-full px-3 text-sm transition-colors ${
                    active ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0057A8]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Avatar */}
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
