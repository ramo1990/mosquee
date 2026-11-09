import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import TasksManagement from "@/components/tasks/TasksManagement";

export default function TasksPage() {
  return (
    <ModuleGuard module="tasks">
      <DashboardPagePlaceholder
        title="Tâches du comité"
        description="Créez, attribuez et suivez les tâches administratives du comité."
      >
        <TasksManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}

// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function TasksPage() {
//   return (
//     <ModuleGuard module="tasks">
//       <DashboardPagePlaceholder
//         title="Tâches du comité"
//         description="Créez, attribuez et suivez les tâches administratives du comité."
//       />
//     </ModuleGuard>
//   );
// }