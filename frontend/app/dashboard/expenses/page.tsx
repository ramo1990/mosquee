import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ExpensesManagement from "@/components/expenses/ExpensesManagement";

export default function ExpensesPage() {
  return (
    <ModuleGuard module="expenses">
      <DashboardPagePlaceholder
        title="Dépenses"
        description="Enregistrez et suivez les dépenses liées au fonctionnement et aux projets de la mosquée."
      >
        <ExpensesManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function ExpensesPage() {
//   return (
//     <ModuleGuard module="expenses">
//       <DashboardPagePlaceholder
//         title="Dépenses"
//         description="Enregistrez et suivez les dépenses liées au fonctionnement et aux projets de la mosquée."
//       />
//     </ModuleGuard>
//   );
// }