import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import SermonsManagement from "@/components/sermons/SermonsManagement";

export default function SermonsPage() {
  return (
    <ModuleGuard module="sermons">
      <DashboardPagePlaceholder
        title="Prêches et sermons"
        description="Publiez les khutbas, sermons et enseignements destinés à la communauté."
      >
        <SermonsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}