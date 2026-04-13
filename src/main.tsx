import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TabProvider } from "@/lib/tab-context";
import { StoreProvider } from "@/lib/store";
import NavBar from "@/components/NavBar";
import Page from "@/app/page";
import "@/app/globals.css";

function App() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#FAFCFE" }}
    >
      <TabProvider>
        <StoreProvider>
          <div className="flex-shrink-0 z-30">
            <NavBar />
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6">
              <Page />
            </div>
          </main>
        </StoreProvider>
      </TabProvider>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
