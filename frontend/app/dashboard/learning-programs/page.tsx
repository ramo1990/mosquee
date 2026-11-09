import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";
import LearningProgramsManagement from "@/components/learning-programs/LearningProgramsManagement";

export default function LearningProgramsPage() {
  return (
    <ModuleGuard module="learning-programs">
      <DashboardPagePlaceholder
        title="Programmes d’apprentissage"
        description="Définissez les programmes, objectifs et contenus pédagogiques."
      >
        <LearningProgramsManagement />
      </DashboardPagePlaceholder>
    </ModuleGuard>
  );
}


// import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
// import ModuleGuard from "@/components/ModuleGuard";

// export default function LearningProgramsPage() {
//   return (
//     <ModuleGuard module="learning-programs">
//       <DashboardPagePlaceholder
//         title="Programmes d’apprentissage"
//         description="Définissez les programmes, objectifs et contenus pédagogiques."
//       />
//     </ModuleGuard>
//   );
// }