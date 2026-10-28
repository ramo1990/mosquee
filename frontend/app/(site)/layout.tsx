import type { ReactNode } from "react";

import LayoutContent from "@/components/LayoutContent";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <LayoutContent>{children}</LayoutContent>
  );
}