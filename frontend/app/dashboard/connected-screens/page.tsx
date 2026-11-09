import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import ConnectedScreensManagement from "@/components/connected-screens/ConnectedScreensManagement";

export default function ConnectedScreensPage() {
  return (
    <ModuleGuard module="connected-screens">
      <DashboardPagePlaceholder
        title="Écrans connectés"
        description="Consultez l’état, la connexion et les informations des écrans installés."
      >
        <ConnectedScreensManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}



// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function ConnectedScreensPage() {
//   return (
//     <ModuleGuard module="connected-screens">
//       <DashboardPagePlaceholder
//         title="Écrans connectés"
//         description="Consultez l’état, la connexion et les informations des écrans installés."
//       />
//     </ModuleGuard>
//   );
// }