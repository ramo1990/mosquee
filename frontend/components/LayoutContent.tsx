
"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutContentInner({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isEcranPage = pathname === "/ecran";

  return (
    <>
      {!isEcranPage && (
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-50 -translate-y-20 rounded-md bg-white px-4 py-2 font-medium text-gray-900 shadow focus:translate-y-0"
        >
          Aller au contenu
        </a>
      )}

      {!isEcranPage && <Navbar />}

      <main
        id="main-content"
        className={`mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 ${
          isEcranPage ? "max-w-none p-0" : ""
        }`}
      >
        {children}
      </main>

      {!isEcranPage && <Footer />}
    </>
  );
}

export default function LayoutContent({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex-1 bg-gray-50" />}
    >
      <LayoutContentInner>{children}</LayoutContentInner>
    </Suspense>
  );
}
