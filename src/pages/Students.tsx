import { StudentList } from "@/components/dashboard/StudentList";
import { AssignTaskForm } from "@/components/dashboard/AssignTaskForm";

export default function Students() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Mes Étudiants 👨‍🏫</h1>
        <p className="text-muted-foreground">
          Suivez la progression de vos étudiants et assignez-leur des tâches
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentList />
        <AssignTaskForm />
      </div>
    </div>
  );
}
