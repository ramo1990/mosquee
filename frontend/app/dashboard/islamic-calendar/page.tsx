import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import IslamicCalendarManagement from "@/components/islamic-calendar/IslamicCalendarManagement";

export default function IslamicCalendarPage() {
  return (
    <ModuleGuard module="islamic-calendar">
      <DashboardPagePlaceholder
        title="Calendrier islamique"
        description="Consultez et gérez les dates importantes du calendrier hégirien et les événements religieux."
      >
        <IslamicCalendarManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function IslamicCalendarPage() {
//   return (
//     <ModuleGuard module="islamic-calendar">
//       <DashboardPagePlaceholder
//         title="Calendrier islamique"
//         description="Consultez et gérez les dates importantes du calendrier hégirien et les événements religieux."
//       />
//     </ModuleGuard>
//   );
// }