import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import FinanceManagement from "@/components/finance/FinanceManagement";

export default function FinancePage() {
  return (
    <ModuleGuard module="finance">
      <DashboardPagePlaceholder
        title="Finances et rapports"
        description="Consultez les recettes, dépenses, soldes et rapports financiers de la mosquée."
      >
        <FinanceManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function FinancePage() {
//   return (
//     <ModuleGuard module="finance">
//       <DashboardPagePlaceholder
//         title="Finances et rapports"
//         description="Consultez les recettes, dépenses, soldes et rapports financiers de la mosquée."
//       />
//     </ModuleGuard>
//   );
// }