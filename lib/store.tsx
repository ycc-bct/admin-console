"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  PendingRequest,
  AccountRecord,
  AuditLog,
  initialPendingRequests,
  initialAccounts,
  initialAuditLogs,
} from "./data";

interface StoreCtx {
  pendingRequests: PendingRequest[];
  accounts: AccountRecord[];
  auditLogs: AuditLog[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason?: string) => void;
  completeAccount: (id: string, gacId: string) => void;
}

const Store = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(initialPendingRequests);
  const [accounts, setAccounts] = useState<AccountRecord[]>(initialAccounts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const addLog = useCallback(
    (
      event: AuditLog["event"],
      details: string,
      targetName: string,
      targetId: string,
      targetEmail: string
    ) => {
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        administrator: "candace@giant.com",
        administratorName: "Candace Cheng",
        event,
        details,
        targetName,
        targetId,
        targetEmail,
        ip: "172.24.8.192",
        userAgent: "Mozilla/5.0 (Macintosh;...",
      };
      setAuditLogs((prev) => [log, ...prev]);
    },
    []
  );

  const approveRequest = useCallback(
    (id: string) => {
      const req = pendingRequests.find((r) => r.id === id);
      if (!req) return;
      const gacId = Math.floor(100000 + Math.random() * 900000).toString();
      const newAccount: AccountRecord = {
        id: `acc-${Date.now()}`,
        userName: req.userName,
        email: req.email,
        org: req.org,
        requestDate: req.requestDate,
        status: "PENDING_ACCOUNT_CREATION",
      };
      setAccounts((prev) => [newAccount, ...prev]);
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
      const eventType = req.status === "TRANSFER" ? "APPROVE_TRANSFER" : "APPROVE_REGISTRATION";
      addLog(
        eventType,
        "",
        req.userName,
        id.slice(-8).toUpperCase(),
        req.email
      );
    },
    [pendingRequests, addLog]
  );

  const rejectRequest = useCallback(
    (id: string, reason?: string) => {
      const req = pendingRequests.find((r) => r.id === id);
      if (!req) return;
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
      const eventType = req.status === "TRANSFER" ? "REJECT_TRANSFER" : "REJECT_REGISTRATION";
      addLog(
        eventType,
        reason || "",
        req.userName,
        id.slice(-8).toUpperCase(),
        req.email
      );
    },
    [pendingRequests, addLog]
  );

  const completeAccount = useCallback(
    (id: string, gacId: string) => {
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "COMPLETED", gacId } : a))
      );
      const acc = accounts.find((a) => a.id === id);
      if (acc) {
        addLog("COMPLETE_ACCOUNT", `Account creation completed. GAC ID: ${gacId}`, acc.userName, id.slice(-8).toUpperCase(), acc.email);
      }
    },
    [accounts, addLog]
  );

  return (
    <Store.Provider value={{ pendingRequests, accounts, auditLogs, approveRequest, rejectRequest, completeAccount }}>
      {children}
    </Store.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Store);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
