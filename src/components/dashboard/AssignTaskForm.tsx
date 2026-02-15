import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, ClipboardList, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface AssignedTask {
  id: string;
  title: string;
  student_id: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export function AssignTaskForm() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    if (user) fetchAssignedTasks();
  }, [user]);

  const fetchStudents = async () => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");

    if (!roleData) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name")
      .in("user_id", roleData.map((r) => r.user_id));

    if (profiles) setStudents(profiles);
  };

  const fetchAssignedTasks = async () => {
    const { data } = await supabase
      .from("assigned_tasks")
      .select("id, title, student_id, completed, due_date, created_at")
      .eq("professor_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setAssignedTasks(data);
  };

  const handleAssign = async () => {
    if (!title.trim() || !selectedStudent || !user) return;
    setSubmitting(true);

    const { error } = await supabase.from("assigned_tasks").insert({
      professor_id: user.id,
      student_id: selectedStudent,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
    });

    if (!error) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setSelectedStudent("");
      fetchAssignedTasks();
      toast.success("Tâche assignée avec succès !");
    } else {
      toast.error("Erreur lors de l'assignation");
    }
    setSubmitting(false);
  };

  const deleteTask = async (id: string) => {
    await supabase.from("assigned_tasks").delete().eq("id", id);
    fetchAssignedTasks();
    toast.success("Tâche supprimée");
  };

  const getStudentName = (id: string) => {
    const s = students.find((s) => s.user_id === id);
    return s ? `${s.first_name} ${s.last_name}` : "Inconnu";
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Assigner une Tâche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="bg-secondary/50">
            <SelectValue placeholder="Choisir un étudiant" />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.user_id} value={s.user_id}>
                {s.first_name} {s.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Titre de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-secondary/50"
        />

        <Textarea
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-secondary/50"
          rows={2}
        />

        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-secondary/50"
        />

        <Button onClick={handleAssign} disabled={submitting || !title.trim() || !selectedStudent} className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Assigner
        </Button>

        {/* Recent assigned tasks */}
        {assignedTasks.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tâches récentes assignées</p>
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-xl text-sm ${
                  task.completed ? "bg-success/10" : "bg-secondary/50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    → {getStudentName(task.student_id)}
                    {task.completed && " ✅"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive shrink-0"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
