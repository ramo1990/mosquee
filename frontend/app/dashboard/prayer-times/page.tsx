import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function PrayerTimesPage() {
  return (
    <ModuleGuard module="prayer-times">
      <DashboardPagePlaceholder
        title="Horaires de prière"
        description="Gérez les horaires quotidiens, l’iqama, la Jumua et les horaires spécifiques à la mosquée."
      />
    </ModuleGuard>
  );
}