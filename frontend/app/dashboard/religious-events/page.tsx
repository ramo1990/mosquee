import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ReligiousEventsPage() {
  return (
    <ModuleGuard module="religious-events">
      <DashboardPagePlaceholder
        title="Événements religieux"
        description="Consultez et gérez les événements religieux, célébrations et rendez-vous spirituels."
      />
    </ModuleGuard>
  );
}