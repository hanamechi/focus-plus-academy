import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import Progress from "./pages/Progress";
import Challenges from "./pages/Challenges";
import MyChallenges from "./pages/MyChallenges";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Students from "./pages/Students";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="progress" element={<Progress />} />
                <Route path="challenges" element={<Challenges />} />
                <Route path="my-challenges" element={<MyChallenges />} />
                <Route path="create-challenge" element={
                  <ProtectedRoute requiredRole="professor">
                    <CreateChallenge />
                  </ProtectedRoute>
                } />
                <Route path="challenge/:id" element={<ChallengeDetail />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="students" element={
                  <ProtectedRoute requiredRole="professor">
                    <Students />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
