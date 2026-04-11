"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PendingRequest } from "@/lib/data";
import UserAvatar from "./UserAvatar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface Props {
  onClose: () => void;
}

function truncate(str: string, max = 20) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export default function PendingApprovalsDrawer({ onClose }: Props) {
  const { pendingRequests, approveRequest, rejectRequest } = useStore();
  const [rejectTarget, setRejectTarget] = useState<PendingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger slide-in on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const filtered = pendingRequests.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.org.bpId.toLowerCase().includes(search.toLowerCase())
  );

  function handleRejectConfirm() {
    if (!rejectTarget) return;
    rejectRequest(rejectTarget.id, rejectReason || undefined);
    setRejectTarget(null);
    setRejectReason("");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[90vw] max-w-5xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-7 py-5 flex items-start justify-between flex-shrink-0 bg-white">
          <div>
            <h2 className="text-xl font-normal text-gray-900 tracking-tight">Requests</h2>
            <p className="text-sm text-gray-400 mt-0.5">Review new registrations and organization transfer requests.</p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors ml-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 px-7 py-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-medium">No pending requests</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50 border-b border-gray-200 text-left px-5 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">User Identity</th>
                  <th className="bg-gray-50 border-b border-gray-200 text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Organization</th>
                  <th className="bg-gray-50 border-b border-gray-200 text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Request Date</th>
                  <th className="bg-gray-50 border-b border-gray-200 text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-[#005EB8]/5 transition-colors">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={req.userName} />
                        <div>
                          <div className="text-sm text-gray-800">{req.userName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{req.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      {req.status === "TRANSFER" ? (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-mono bg-gray-100 text-gray-400 line-through">{req.org.currentBpId}</span>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-mono bg-[#0057A8] text-white">{req.org.bpId}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-800">
                            <span title={req.org.currentName}>{truncate(req.org.currentName ?? "")}</span>
                            <span className="text-gray-400">→</span>
                            <span title={req.org.name}>{truncate(req.org.name)}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-mono bg-[#005EB8]/10 text-[#005EB8] mb-1">{req.org.bpId}</div>
                          <div className="text-sm text-gray-800">{req.org.name}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-sm text-gray-800">{req.requestDate}</div>
                    </td>
                    <td className="px-4 py-2.5 w-52">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() => setRejectTarget(req)}
                          className="w-24 py-1.5 border border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 text-xs font-medium rounded-md transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveRequest(req.id)}
                          className="w-24 py-1.5 border border-green-500 text-green-600 hover:bg-green-50 text-xs font-medium rounded-md transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50" onClick={() => setRejectTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Reject Registration</h3>
            <p className="text-sm text-gray-500 mb-4">
              Rejecting request for <span className="font-semibold">{rejectTarget.userName}</span> ({rejectTarget.email})
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]/30 focus:border-[#005EB8]/60 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
