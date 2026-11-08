"use client";

import { useEffect, useState, type ReactNode } from "react";

import { apiGetCurrentUser } from "@/lib/api";
import { canAccessModule } from "@/lib/permissions";
import type { DashboardModule } from "@/lib/permissions";
import type { User } from "@/lib/types";

type ModuleGuardProps = {
  module: DashboardModule;
  children: ReactNode;
};

export default function ModuleGuard({
  module,
  children,
}: ModuleGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Connexion requise
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Vous devez être connecté pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (!canAccessModule(user.role, module)) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          Accès non autorisé
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Vous n’avez pas les droits nécessaires pour accéder à cette section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}