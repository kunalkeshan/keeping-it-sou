import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keeping It Sou",
  description: "Your description here",
};

export default function StaticLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
