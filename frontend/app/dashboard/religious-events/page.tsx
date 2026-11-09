import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ReligiousEventsManagement from "@/components/religious-events/ReligiousEventsManagement";

export default function ReligiousEventsPage() {
  return (
    <ModuleGuard module="religious-events">
      <DashboardPagePlaceholder
        title="Événements religieux"
        description="Consultez et gérez les événements religieux, célébrations et rendez-vous spirituels."
      >
        <ReligiousEventsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function ReligiousEventsPage() {
//   return (
//     <ModuleGuard module="religious-events">
//       <DashboardPagePlaceholder
//         title="Événements religieux"
//         description="Consultez et gérez les événements religieux, célébrations et rendez-vous spirituels."
//       />
//     </ModuleGuard>
//   );
// }