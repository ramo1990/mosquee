import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import NotificationsManagement from "@/components/notifications/NotificationsManagement";

export default function NotificationsPage() {
  return (
    <ModuleGuard module="notifications">
      <DashboardPagePlaceholder
        title="Notifications"
        description="Consultez et gérez les alertes et messages importants de l’application."
      >
        <NotificationsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}