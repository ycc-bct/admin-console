"use client";

import { useState } from "react";
import { AccountRecord } from "@/lib/data";
import { useStore } from "@/lib/store";

interface Props {
  account: AccountRecord;
  onClose: () => void;
}

export default function CompleteAccountModal({ account, onClose }: Props) {
  const { completeAccount } = useStore();
  const [gacId, setGacId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gacId.trim()) return;
    completeAccount(account.id, gacId.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Complete Account Creation</h3>
        <p className="text-sm text-gray-500 mb-4">
          Assign a GAC ID to <span className="font-semibold">{account.userName}</span> ({account.email})
        </p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">GAC ID</label>
          <input
            type="text"
            value={gacId}
            onChange={(e) => setGacId(e.target.value)}
            placeholder="e.g. 760282"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={!gacId.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-[#005EB8] hover:bg-[#004a93] rounded-lg disabled:opacity-40">
              Complete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
