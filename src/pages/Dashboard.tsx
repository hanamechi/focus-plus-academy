import { useAuth } from "@/contexts/AuthContext";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ProfessorDashboard } from "@/components/dashboard/ProfessorDashboard";

export default function Dashboard() {
  const { role } = useAuth();

  return role === "professor" ? <ProfessorDashboard /> : <StudentDashboard />;
}
