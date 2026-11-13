
"use client";

import { useState } from "react";

import ModuleGuard from "@/components/ModuleGuard";
import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import MembersManagement from "@/components/members/MembersManagement";

export default function MembersPage() {
  const [showManagement, setShowManagement] = useState(true);

  return (
    <ModuleGuard module="members">
      <DashboardPagePlaceholder
        title="Gestion des fidèles"
        description="Gérez les fidèles de votre mosquée, leurs informations personnelles et leur statut."
      >
        {showManagement && (
          <MembersManagement />
        )}
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}