
"use client";

import Link from "next/link";
import { Bell, UserRound } from "lucide-react";

export default function MemberHeader({
  name,
}: {
  name: string;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
      <div>
        <p className="text-sm font-bold text-gray-900">
          Mon espace personnel
        </p>
        <p className="hidden text-xs text-gray-500 sm:block">
          Bienvenue dans votre espace fidèle
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          <Bell size={19} />
        </button>

        <Link
          href="/compte"
          className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800"
        >
          <UserRound size={17} />
          <span className="hidden sm:inline">{name}</span>
        </Link>
      </div>
    </header>
  );
}
