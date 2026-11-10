import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoBiz AI — Your business copilot",
  description: "AI-powered workspace for everyday business operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
