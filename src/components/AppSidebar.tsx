import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Focus, 
  Timer, 
  Trophy, 
  BookOpen, 
  Search, 
  Plus, 
  LayoutDashboard,
  User,
  LogOut,
  ListTodo,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mes Tâches", url: "/dashboard/tasks", icon: ListTodo },
  { title: "Pomodoro", url: "/dashboard/pomodoro", icon: Timer },
  { title: "Ma Progression", url: "/dashboard/progress", icon: Trophy },
  { title: "Explorer les Défis", url: "/dashboard/challenges", icon: Search },
  { title: "Mes Défis", url: "/dashboard/my-challenges", icon: BookOpen },
];

const professorItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Étudiants", url: "/dashboard/students", icon: Users },
  { title: "Mes Défis", url: "/dashboard/my-challenges", icon: BookOpen },
  { title: "Créer un Défi", url: "/dashboard/create-challenge", icon: Plus },
];

export function AppSidebar() {
  const { profile, role, signOut } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const items = role === "professor" ? professorItems : studentItems;
  
  const getInitials = () => {
    if (!profile) return "U";
    return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  };

  return (
    <Sidebar className="glass-sidebar border-r-0" collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Focus className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold gradient-text">FOCUS+</span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "professor" ? "Espace Professeur" : "Espace Étudiant"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <SidebarMenuButton
          asChild
          tooltip="Mon Profil"
          isActive={location.pathname === "/dashboard/profile"}
        >
          <NavLink 
            to="/dashboard/profile" 
            className="flex items-center gap-3"
            activeClassName="bg-primary/10 text-primary"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {profile?.first_name} {profile?.last_name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {role === "professor" ? "Professeur" : "Étudiant"}
                </span>
              </div>
            )}
          </NavLink>
        </SidebarMenuButton>
        
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={signOut}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
