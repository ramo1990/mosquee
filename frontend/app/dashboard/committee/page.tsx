
import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import CommitteeManagement from "@/components/committee/CommitteeManagement";

export default function CommitteePage() {
  return (
    <ModuleGuard module="committee">
      <DashboardPagePlaceholder
        title="Membres du comité"
        description="Gérez les membres du comité, leurs responsabilités et leurs informations de contact."
      >
        <CommitteeManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function CommitteePage() {
//   return (
//     <ModuleGuard module="committee">
//       <DashboardPagePlaceholder
//         title="Membres du comité"
//         description="Gérez les membres du comité, leurs responsabilités et leurs informations de contact."
//       />
//     </ModuleGuard>
//   );
// }