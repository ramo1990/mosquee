import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ConnectedScreensPage() {
  return (
    <ModuleGuard module="connected-screens">
      <DashboardPagePlaceholder
        title="Écrans connectés"
        description="Consultez l’état, la connexion et les informations des écrans installés."
      />
    </ModuleGuard>
  );
}