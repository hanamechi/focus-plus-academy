
-- Table for student personal tasks (to-do list)
CREATE TABLE public.student_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own tasks" ON public.student_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can create their own tasks" ON public.student_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own tasks" ON public.student_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can delete their own tasks" ON public.student_tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_student_tasks_updated_at
  BEFORE UPDATE ON public.student_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for professor-assigned tasks
CREATE TABLE public.assigned_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id uuid NOT NULL,
  student_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assigned_tasks ENABLE ROW LEVEL SECURITY;

-- Professors can see tasks they assigned
CREATE POLICY "Professors can view assigned tasks" ON public.assigned_tasks
  FOR SELECT USING (auth.uid() = professor_id);

-- Students can see tasks assigned to them
CREATE POLICY "Students can view their assigned tasks" ON public.assigned_tasks
  FOR SELECT USING (auth.uid() = student_id);

-- Only professors can create assigned tasks
CREATE POLICY "Professors can create assigned tasks" ON public.assigned_tasks
  FOR INSERT WITH CHECK (auth.uid() = professor_id AND has_role(auth.uid(), 'professor'::app_role));

-- Professors can update tasks they assigned
CREATE POLICY "Professors can update assigned tasks" ON public.assigned_tasks
  FOR UPDATE USING (auth.uid() = professor_id AND has_role(auth.uid(), 'professor'::app_role));

-- Students can mark their assigned tasks as completed
CREATE POLICY "Students can complete assigned tasks" ON public.assigned_tasks
  FOR UPDATE USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Professors can delete tasks they assigned
CREATE POLICY "Professors can delete assigned tasks" ON public.assigned_tasks
  FOR DELETE USING (auth.uid() = professor_id AND has_role(auth.uid(), 'professor'::app_role));

CREATE TRIGGER update_assigned_tasks_updated_at
  BEFORE UPDATE ON public.assigned_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow professors to view all student profiles for assignment
CREATE POLICY "Professors can view student profiles" ON public.profiles
  FOR SELECT USING (has_role(auth.uid(), 'professor'::app_role));

-- Allow professors to view student progress
CREATE POLICY "Professors can view student progress" ON public.user_progress
  FOR SELECT USING (has_role(auth.uid(), 'professor'::app_role));

-- Allow professors to view student sessions
CREATE POLICY "Professors can view student sessions" ON public.pomodoro_sessions
  FOR SELECT USING (has_role(auth.uid(), 'professor'::app_role));
