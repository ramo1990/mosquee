import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import MosqueSettingsManagement from "@/components/mosque-settings/MosqueSettingsManagement";

export default function MosqueSettingsPage() {
  return (
    <ModuleGuard module="mosque-settings">
      <DashboardPagePlaceholder
        title="Paramètres de la mosquée"
        description="Modifiez les informations générales, les contacts, l’identité visuelle et la configuration de la mosquée."
      >
        <MosqueSettingsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function MosqueSettingsPage() {
//   return (
//     <ModuleGuard module="mosque-settings">
//       <DashboardPagePlaceholder
//         title="Paramètres de la mosquée"
//         description="Modifiez les informations générales, les contacts, l’identité visuelle et la configuration de la mosquée."
//       />
//     </ModuleGuard>
//   );
// }