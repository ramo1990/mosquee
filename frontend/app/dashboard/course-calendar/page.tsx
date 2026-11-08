import DashboardPagePlaceholder from "@/components/DashboardPagePlaceholder";
import ModuleGuard from "@/components/ModuleGuard";

export default function CourseCalendarPage() {
  return (
    <ModuleGuard module="course-calendar">
      <DashboardPagePlaceholder
        title="Calendrier des cours"
        description="Consultez et planifiez les séances, horaires et événements pédagogiques."
      />
    </ModuleGuard>
  );
}