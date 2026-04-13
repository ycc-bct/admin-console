"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useStore } from "@/lib/store";
import { useTab } from "@/lib/tab-context";
import { AccountRecord } from "@/lib/data";
import PendingApprovalsModal from "@/components/PendingApprovalsModal";
import CompleteAccountModal from "@/components/CompleteAccountModal";
import UserAvatar from "@/components/UserAvatar";
import AuditLogPage from "@/components/AuditLogPage";

const PAGE_SIZE = 10;

type SortCol = "name" | "org" | "status" | "joined" | null;
type SortDir = "asc" | "desc";

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

function PendingAvatar() {
  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="#cbd5e1" strokeWidth="1.5"
          strokeDasharray="3.5 3" strokeLinecap="round" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-[18px] h-[18px] text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
    </div>
  );
}

export default function Page() {
  const { tab } = useTab();
  return tab === "audit-log" ? <AuditLogPage /> : <AccountListContent />;
}

function AccountListContent() {
  const { pendingRequests, accounts } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<AccountRecord | null>(null);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  function handleSort(col: NonNullable<SortCol>) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir(col === "joined" ? "desc" : "asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return accounts
      .filter((a) =>
        a.userName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.org.bpId.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (!sortCol) return 0; // preserve insertion order
        let cmp = 0;
        if (sortCol === "name")   cmp = a.userName.localeCompare(b.userName);
        if (sortCol === "org")    cmp = a.org.name.localeCompare(b.org.name);
        if (sortCol === "status") {
          const va = a.status === "PENDING_ACCOUNT_CREATION" ? 0 : 1;
          const vb = b.status === "PENDING_ACCOUNT_CREATION" ? 0 : 1;
          cmp = va - vb;
        }
        if (sortCol === "joined") {
          const da = a.status === "COMPLETED" ? a.requestDate : "";
          const db = b.status === "COMPLETED" ? b.requestDate : "";
          if (!da && !db) cmp = 0;
          else if (!da) return 1;
          else if (!db) return -1;
          else cmp = da.localeCompare(db);
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [accounts, search, sortCol, sortDir]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when search or sort changes
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, sortCol, sortDir]);


  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const thBase = "sticky top-[119px] z-10 bg-[#F0F2F5] border-b border-gray-200 text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide";
  const thSort = `${thBase} cursor-pointer hover:text-gray-800 select-none group`;
  const thSortInner = "flex items-center";

  return (
    <>
      {/* Page Title + Search + Actions — all sticky */}
      <div className="sticky top-0 z-20 pt-6 pb-3" style={{ backgroundColor: "#FAFCFE" }}>
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900 mb-3">
          Account List
          <span className="text-sm font-medium text-[#005EB8] bg-[#005EB8]/10 px-2.5 py-0.5 rounded-full">{accounts.length}</span>
        </h1>
        <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, or BP ID..."
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

        {/* Requests */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#005EB8] bg-white hover:bg-[#005EB8]/5 transition-colors flex-shrink-0"
          style={{ border: "1.5px solid rgba(0,94,184,0.3)" }}
        >
          Requests
          {pendingRequests.length > 0 && (
            <span className="text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none" style={{ backgroundColor: "#005EB8" }}>
              {pendingRequests.length}
            </span>
          )}
        </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{width:"18%"}} />
            <col style={{width:"26%"}} />
            <col style={{width:"22%"}} />
            <col style={{width:"10%"}} />
            <col style={{width:"13%"}} />
            <col style={{width:"11%"}} />
          </colgroup>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className={`${thSort} rounded-tl-xl`}>
                <span className={thSortInner}>Name<SortIcon active={sortCol === "name"} dir={sortDir} /></span>
              </th>
              <th className={thBase}>Email</th>
              <th onClick={() => handleSort("org")} className={thSort}>
                <span className={thSortInner}>Organization<SortIcon active={sortCol === "org"} dir={sortDir} /></span>
              </th>
              <th onClick={() => handleSort("status")} className={thSort}>
                <span className={thSortInner}>Status<SortIcon active={sortCol === "status"} dir={sortDir} /></span>
              </th>
              <th onClick={() => handleSort("joined")} className={thSort}>
                <span className={thSortInner}>Joined<SortIcon active={sortCol === "joined"} dir={sortDir} /></span>
              </th>
              <th className={`${thBase} rounded-tr-xl`}>GAC ID</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-sm text-gray-400">No accounts found.</td>
              </tr>
            ) : (
              visible.map((acc) => {
                const isPending = acc.status === "PENDING_ACCOUNT_CREATION";
                return (
                  <tr key={acc.id} className="border-b border-gray-100 last:border-b-0 hover:bg-[#005EB8]/5 transition-colors">

                    {/* Name */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isPending ? <PendingAvatar /> : <UserAvatar name={acc.userName} />}
                        <span className="text-sm text-gray-800 truncate">{acc.userName}</span>
                        {acc.isAdmin && (
                          <span className="flex-shrink-0 inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">Admin</span>
                        )}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-2.5">
                      <span className="text-sm text-gray-600">{acc.email}</span>
                    </td>

                    {/* Organization */}
                    <td className="px-4 py-2.5">
                      <div className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-mono bg-[#005EB8]/10 text-[#005EB8] mb-1">{acc.org.bpId}</div>
                      <div className="text-sm text-gray-700">{acc.org.name}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {isPending
                        ? <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-medium bg-gray-100 text-gray-400 border border-gray-200">Pending</span>
                        : <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-medium bg-green-50 text-green-600 border border-green-200">Active</span>
                      }
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {isPending
                        ? <span className="text-gray-300 text-sm">—</span>
                        : <span className="text-sm text-gray-600 font-mono">{acc.requestDate}</span>
                      }
                    </td>

                    {/* GAC ID */}
                    <td className="px-4 py-2.5">
                      {acc.gacId
                        ? <span className="text-sm text-gray-800 font-mono">{acc.gacId}</span>
                        : <span className="text-gray-300 text-sm">—</span>
                      }
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Infinite scroll sentinel */}
        {hasMore ? (
          <div ref={sentinelRef} className="py-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading more...
          </div>
        ) : (
          <div ref={sentinelRef} />
        )}
      </div>

      {showModal && <PendingApprovalsModal onClose={() => setShowModal(false)} />}
      {completeTarget && <CompleteAccountModal account={completeTarget} onClose={() => setCompleteTarget(null)} />}
    </>
  );
}
