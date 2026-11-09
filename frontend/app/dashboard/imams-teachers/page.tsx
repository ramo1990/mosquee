
import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ImamsTeachersManagement from "@/components/imams-teachers/ImamsTeachersManagement";

export default function ImamsTeachersPage() {
  return (
    <ModuleGuard module="imams-teachers">
      <DashboardPagePlaceholder
        title="Imams et enseignants"
        description="Gérez les imams, enseignants, leurs spécialités et leurs affectations."
      >
        <ImamsTeachersManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function ImamsTeachersPage() {
//   return (
//     <ModuleGuard module="imams-teachers">
//       <DashboardPagePlaceholder
//         title="Imams et enseignants"
//         description="Gérez les imams, enseignants, leurs spécialités et leurs affectations."
//       />
//     </ModuleGuard>
//   );
// }