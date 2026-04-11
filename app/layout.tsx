import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account Hub Admin Console",
  description: "Giant ID Admin Console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body className={`${inter.className} h-screen flex flex-col overflow-hidden`} style={{ backgroundColor: "#FAFCFE" }}>
        <StoreProvider>
          <div className="flex-shrink-0 z-30">
            <NavBar />
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6">{children}</div>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
