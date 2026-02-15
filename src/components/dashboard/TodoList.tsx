import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export function TodoList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("student_tasks")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const { error } = await supabase.from("student_tasks").insert({
      user_id: user.id,
      title: newTask.trim(),
    });
    if (!error) {
      setNewTask("");
      fetchTasks();
      toast.success("Tâche ajoutée !");
    }
  };

  const toggleTask = async (task: Task) => {
    await supabase
      .from("student_tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from("student_tasks").delete().eq("id", id);
    fetchTasks();
    toast.success("Tâche supprimée");
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Ma To-Do List
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{tasks.length} terminées
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add task */}
        <div className="flex gap-2">
          <Input
            placeholder="Ajouter une tâche..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="bg-secondary/50"
          />
          <Button size="icon" onClick={addTask} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Task list */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {loading ? (
            <p className="text-center text-muted-foreground py-4">Chargement...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucune tâche pour le moment 📝
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  task.completed
                    ? "bg-success/10 opacity-60"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task)}
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
