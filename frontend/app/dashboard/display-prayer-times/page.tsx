import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import DisplayPrayerTimesManagement from "@/components/display-prayer-times/DisplayPrayerTimesManagement";

export default function DisplayPrayerTimesPage() {
  return (
    <ModuleGuard module="display-prayer-times">
      <DashboardPagePlaceholder
        title="Horaires de prière affichés"
        description="Gérez les horaires de prière et l’iqama affichés sur les écrans."
      >
        <DisplayPrayerTimesManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}



// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function DisplayPrayerTimesPage() {
//   return (
//     <ModuleGuard module="display-prayer-times">
//         <DashboardPagePlaceholder
//         title="Horaires de prière affichés"
//         description="Gérez les horaires de prière et l’iqama affichés sur les écrans."
//         />
//     </ModuleGuard>
//   );
// }