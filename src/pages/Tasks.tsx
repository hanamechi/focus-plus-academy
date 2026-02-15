import { TodoList } from "@/components/dashboard/TodoList";
import { AssignedTasksList } from "@/components/dashboard/AssignedTasksList";

export default function Tasks() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Mes Tâches 📝</h1>
        <p className="text-muted-foreground">
          Gérez vos tâches personnelles et celles assignées par vos professeurs
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodoList />
        <AssignedTasksList />
      </div>
    </div>
  );
}
