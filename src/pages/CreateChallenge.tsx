import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, Calendar, BookOpen, ArrowLeft, FileText } from "lucide-react";

export default function CreateChallenge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/zip",
        "application/x-zip-compressed",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier PDF ou ZIP",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 10 Mo",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!title || !subject || !startDate || !endDate) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast({
        title: "Dates invalides",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let fileUrl = null;
      let fileName = null;

      // Upload file if present
      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("challenge-files")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("challenge-files")
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
      }

      // Create challenge
      const { error } = await supabase.from("challenges").insert({
        creator_id: user.id,
        title,
        description,
        subject,
        start_date: startDate,
        end_date: endDate,
        file_url: fileUrl,
        file_name: fileName,
      });

      if (error) throw error;

      toast({
        title: "Défi créé! 🎉",
        description: "Votre défi a été publié avec succès",
      });

      navigate("/dashboard/my-challenges");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer un nouveau défi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre du défi *</Label>
              <Input
                id="title"
                placeholder="Ex: Exercices d'algèbre linéaire"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Matière / Module *</Label>
              <Input
                id="subject"
                placeholder="Ex: Mathématiques"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les objectifs et le contenu du défi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Fichier joint (optionnel)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour ajouter un fichier PDF ou ZIP
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Taille max: 10 Mo
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer le défi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
