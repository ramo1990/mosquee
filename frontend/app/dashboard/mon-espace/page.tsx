
"use client";

import ModuleGuard from "@/components/ModuleGuard";
import DashboardMemberHome from "@/components/members/DashboardMemberHome";

export default function MemberHomePage() {
  return (
    <ModuleGuard module="dashboard">
      <DashboardMemberHome />
    </ModuleGuard>
  );
}
