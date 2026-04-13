"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { AuditLog } from "@/lib/data";
import UserAvatar from "@/components/UserAvatar";

type ActionVariant = "approve" | "reject" | "neutral";
type SortCol = "time" | "admin" | "user";
type SortDir = "asc" | "desc";

const eventConfig: Record<AuditLog["event"], { label: string; variant: ActionVariant }> = {
  APPROVE_REGISTRATION: { label: "APPROVE REGISTRATION", variant: "approve" },
  REJECT_REGISTRATION:  { label: "REJECT REGISTRATION",  variant: "reject"  },
  APPROVE_TRANSFER:     { label: "APPROVE TRANSFER",      variant: "approve" },
  REJECT_TRANSFER:      { label: "REJECT TRANSFER",       variant: "reject"  },
  COMPLETE_ACCOUNT:     { label: "COMPLETE ACCOUNT",      variant: "neutral" },
};

const variantStyle: Record<ActionVariant, { label: string; bg: string; text: string }> = {
  approve: { label: "text-green-700", bg: "bg-green-50",  text: "text-green-600" },
  reject:  { label: "text-red-600",   bg: "bg-red-50",    text: "text-red-600"   },
  neutral: { label: "text-[#005EB8]", bg: "bg-[#005EB8]/10", text: "text-[#005EB8]" },
};


function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return (
    <svg className="ml-1.5 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
  return (
    <svg className="ml-1.5 w-4 h-4 text-[#005EB8] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === "asc"
        ? <path d="M12 19V5M5 12l7-7 7 7" />
        : <path d="M12 5v14M5 12l7 7 7-7" />}
    </svg>
  );
}

export default function AuditLogPage() {
  const { auditLogs } = useStore();

  const [search, setSearch]   = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir(col === "time" ? "desc" : "asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return auditLogs
      .filter((log) => {
        if (!q) return true;
        return (
          log.targetName.toLowerCase().includes(q) ||
          log.administratorName.toLowerCase().includes(q) ||
          log.administrator.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortCol === "time")  cmp = a.timestamp.localeCompare(b.timestamp);
        if (sortCol === "admin") cmp = a.administratorName.localeCompare(b.administratorName);
        if (sortCol === "user")  cmp = a.targetName.localeCompare(b.targetName);
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [auditLogs, search, sortCol, sortDir]);

  return (
    <>
      {/* Page Title + Search — sticky */}
      <div className="sticky top-0 z-20 pt-6 pb-3" style={{ backgroundColor: "#FAFCFE" }}>
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900 mb-3">
          Audit Log
          <span className="text-sm font-medium text-[#005EB8] bg-[#005EB8]/10 px-2.5 py-0.5 rounded-full">{filtered.length}</span>
        </h1>
        <div className="flex items-center gap-4">
        <div className="relative w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search actor or target entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]/30 focus:border-[#005EB8]/60 bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{width:"16%"}} />
            <col style={{width:"22%"}} />
            <col style={{width:"36%"}} />
            <col style={{width:"26%"}} />
          </colgroup>
          <thead>
            <tr>
              <th onClick={() => handleSort("time")}
                className="sticky top-[118px] z-10 bg-[#F0F2F5] border-b border-gray-200 group text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none rounded-tl-xl">
                <span className="flex items-center">Timestamp (UTC)<SortIcon active={sortCol === "time"} dir={sortDir} /></span>
              </th>
              <th onClick={() => handleSort("admin")}
                className="sticky top-[118px] z-10 bg-[#F0F2F5] border-b border-gray-200 group text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                <span className="flex items-center">Actor<SortIcon active={sortCol === "admin"} dir={sortDir} /></span>
              </th>
              <th className="sticky top-[118px] z-10 bg-[#F0F2F5] border-b border-gray-200 text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Event
              </th>
              <th onClick={() => handleSort("user")}
                className="sticky top-[118px] z-10 bg-[#F0F2F5] border-b border-gray-200 group text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none rounded-tr-xl">
                <span className="flex items-center">Target Entity<SortIcon active={sortCol === "user"} dir={sortDir} /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-14 text-center text-sm text-gray-400">No logs found.</td>
              </tr>
            ) : (
              filtered.map((log) => {
                const evt   = eventConfig[log.event];
                const style = variantStyle[evt.variant];

                return (
                  <tr key={log.id} className="border-b border-gray-100 last:border-b-0 hover:bg-[#005EB8]/5 transition-colors">

                    {/* Timestamp */}
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-sm text-gray-600 font-mono">{log.timestamp.slice(0, 10)}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{log.timestamp.slice(11, 16)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={log.administratorName} />
                        <div>
                          <div className="text-sm text-gray-800">{log.administratorName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{log.administrator}</div>
                        </div>
                      </div>
                    </td>

                    {/* Event */}
                    <td className="px-6 py-2.5">
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.label}`}>
                        {evt.label}
                      </div>
                      {evt.variant === "reject" && log.details && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-1 pl-2 line-clamp-2">{log.details}</p>
                      )}
                    </td>

                    {/* Target Entity */}
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={log.targetName} />
                        <div>
                          <div className="text-sm text-gray-800">{log.targetName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{log.targetEmail}</div>
                        </div>
                      </div>
                    </td>


                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
