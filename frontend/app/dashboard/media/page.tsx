import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import MediaManagement from "@/components/media/MediaManagement";

export default function MediaPage() {
  return (
    <ModuleGuard module="media">
      <DashboardPagePlaceholder
        title="Images et vidéos"
        description="Ajoutez et organisez les médias utilisés dans les affichages."
      >
        <MediaManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function MediaPage() {
//   return (
//     <ModuleGuard module="media">
//       <DashboardPagePlaceholder
//         title="Images et vidéos"
//         description="Ajoutez et organisez les médias utilisés dans les affichages."
//       />
//     </ModuleGuard>
//   );
// }