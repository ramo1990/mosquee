import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ReligiousAnnouncementsPage() {
  return (
    <ModuleGuard module="religious-announcements">
      <DashboardPagePlaceholder
        title="Annonces religieuses"
        description="Publiez les annonces liées aux prières, cours, rappels et activités religieuses."
      />
    </ModuleGuard>
  );
}