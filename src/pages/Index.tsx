import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Focus, Timer, Trophy, BookOpen, Users, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Focus className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold gradient-text">FOCUS+</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/auth")}>Connexion</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={() => navigate("/auth")}>Commencer</Button>
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Boostez votre <span className="gradient-text">productivité</span> académique
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              FOCUS+ combine la méthode Pomodoro, la gamification et le partage de ressources pour transformer votre façon d'étudier.
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground px-8" onClick={() => navigate("/auth")}>
              Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />
      </header>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tout ce dont vous avez besoin pour réussir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card hover:scale-105 transition-transform">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <Timer className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Timer Pomodoro</h3>
              <p className="text-muted-foreground">Cycle de 25 minutes avec Mode Strict pour rester concentré.</p>
            </div>
            <div className="glass-card hover:scale-105 transition-transform">
              <div className="h-14 w-14 rounded-2xl gradient-accent flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamification</h3>
              <p className="text-muted-foreground">Gagnez des XP et débloquez des badges.</p>
            </div>
            <div className="glass-card hover:scale-105 transition-transform">
              <div className="h-14 w-14 rounded-2xl bg-success flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Défis & Ressources</h3>
              <p className="text-muted-foreground">Accédez aux modules partagés par vos professeurs.</p>
            </div>
            <div className="glass-card hover:scale-105 transition-transform">
              <div className="h-14 w-14 rounded-2xl bg-warning flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-muted-foreground">Rejoignez des défis avec d'autres étudiants.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 FOCUS+. Plateforme de productivité académique.
        </div>
      </footer>
    </div>
  );
}
