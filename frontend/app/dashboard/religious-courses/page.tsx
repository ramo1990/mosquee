import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function ReligiousCoursesPage() {
  return (
    <ModuleGuard module="religious-courses">
      <DashboardPagePlaceholder
        title="Cours religieux"
        description="Gérez les cours de Coran, hadith, fiqh et autres enseignements religieux."
      />
    </ModuleGuard>
  );
}