import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import AttendanceManagement from "@/components/attendance/AttendanceManagement";

export default function AttendancePage() {
  return (
    <ModuleGuard module="attendance">
      <DashboardPagePlaceholder
        title="Gestion des présences"
        description="Enregistrez les présences, absences et retards des élèves."
      >
        <AttendanceManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function AttendancePage() {
//   return (
//     <ModuleGuard module="attendance">
//       <DashboardPagePlaceholder
//         title="Gestion des présences"
//         description="Enregistrez les présences, absences et retards des élèves."
//       />
//     </ModuleGuard>
//   );
// }