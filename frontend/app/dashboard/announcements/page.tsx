import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import AnnouncementsManagement from "@/components/announcements/AnnouncementsManagement";

export default function AnnouncementsPage() {
  return (
    <ModuleGuard module="announcements">
      <DashboardPagePlaceholder
        title="Annonces"
        description="Publiez et gérez les annonces destinées aux fidèles et aux écrans d’affichage."
      >
        <AnnouncementsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function AnnouncementsPage() {
//   return (
//     <ModuleGuard module="announcements">
//       <DashboardPagePlaceholder
//         title="Annonces"
//         description="Publiez et gérez les annonces destinées aux fidèles et aux écrans d’affichage."
//     />
//     </ModuleGuard>
//   );
// }