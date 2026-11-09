import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import StudentProgressManagement from "@/components/student-progress/StudentProgressManagement";

export default function StudentProgressPage() {
  return (
    <ModuleGuard module="student-progress">
      <DashboardPagePlaceholder
        title="Suivi des élèves"
        description="Suivez la progression, les résultats et les difficultés des élèves."
      >
        <StudentProgressManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function StudentProgressPage() {
//   return (
//     <ModuleGuard module="student-progress">
//       <DashboardPagePlaceholder
//         title="Suivi des élèves"
//         description="Suivez la progression, les résultats et les difficultés des élèves."
//       />
//     </ModuleGuard>
//   );
// }