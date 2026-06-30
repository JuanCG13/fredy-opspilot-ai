import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsPilot AI — Workflow Automation Portfolio Demo",
  description:
    "A portfolio demo by Fredy Gimenez showing AI workflow automation, RAG, approvals, and operational logs.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
