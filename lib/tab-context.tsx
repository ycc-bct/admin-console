"use client";
import { createContext, useContext, useState } from "react";

export type Tab = "accounts" | "audit-log";
interface TabCtx { tab: Tab; setTab: (t: Tab) => void; }
const TabContext = createContext<TabCtx>({ tab: "accounts", setTab: () => {} });

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("accounts");
  return <TabContext.Provider value={{ tab, setTab }}>{children}</TabContext.Provider>;
}
export const useTab = () => useContext(TabContext);
