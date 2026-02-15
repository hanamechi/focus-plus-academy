import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList } from "lucide-react";

interface AssignedTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  professor_id: string;
  created_at: string;
}

export function AssignedTasksList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<AssignedTask[]>([]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("assigned_tasks")
      .select("*")
      .eq("student_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setTasks(data);
  };

  const toggleComplete = async (task: AssignedTask) => {
    await supabase
      .from("assigned_tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);
    fetchTasks();
  };

  if (tasks.length === 0) return null;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Tâches Assignées par le Professeur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                task.completed ? "bg-success/10 opacity-60" : "bg-secondary/50"
              }`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleComplete(task)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                )}
                {task.due_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Échéance : {new Date(task.due_date).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
