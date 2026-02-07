
# Plan de Développement : FOCUS+
**Plateforme de productivité académique avec Pomodoro, gamification et partage de ressources**

---

## 🎨 Design & Expérience Utilisateur

### Style Visuel Glassmorphism
- Effets de verre avec transparence et flou d'arrière-plan
- Ombres douces et dégradés subtils
- Mode Sombre/Clair avec persistance du choix
- Animations fluides et transitions élégantes

### Navigation Responsive
- Sidebar dynamique adaptée au rôle (Étudiant/Professeur)
- Header avec barre de recherche globale
- Interface optimisée desktop et tablette

---

## 🔐 Authentification & Profils

### Système d'Authentification Complet
- Inscription par email avec vérification
- Connexion sécurisée avec mot de passe
- Récupération de mot de passe

### Profils Utilisateurs
- Photo de profil (avatar) personnalisable
- Informations académiques (filière, année d'études, spécialité)
- Sélection du rôle : Étudiant ou Professeur
- Statistiques personnelles (XP, badges, sessions complétées)

---

## 👨‍🎓 Espace Étudiant

### Timer Pomodoro Interactif
- Cycle de 25 minutes avec compte à rebours visuel circulaire (SVG progressif)
- Contrôles : Démarrer, Pause, Réinitialiser
- **Mode Strict** : Détection de sortie d'onglet (API Visibility)
  - Alerte visuelle quand l'utilisateur quitte l'onglet
  - Option de pause automatique

### Système de Gamification
- **XP automatique** : +50 XP par session Pomodoro complétée
- **Badges débloquables** :
  - 🥉 Novice (première session)
  - 🥈 Productif (10 sessions)
  - 🥇 Expert (50 sessions)
- Barre de progression vers le prochain badge
- Historique des sessions

### Consultation des Défis
- Liste des modules publiés par les professeurs
- Filtrage et recherche par titre ou matière
- Bouton "Participer" pour rejoindre un défi
- Accès aux fichiers attachés (PDF/ZIP)

---

## 👨‍🏫 Espace Professeur

### Création de Défis
- Formulaire complet :
  - Titre du défi
  - Description détaillée
  - Dates de début et fin
  - Matière/Module
- Upload de fichiers (PDF, ZIP) via Supabase Storage

### Gestion des Défis
- Liste des défis créés avec statut (actif/terminé)
- Visualisation du nombre de participants par défi
- Modification et suppression des défis
- Archivage des anciens modules

---

## 🗄️ Backend & Base de Données (Supabase)

### Tables Principales
- **profiles** : Informations utilisateurs, avatar, données académiques
- **user_roles** : Gestion sécurisée des rôles (étudiant/professeur)
- **challenges** : Défis créés par les professeurs
- **challenge_participants** : Inscriptions des étudiants aux défis
- **pomodoro_sessions** : Historique des sessions Pomodoro
- **user_progress** : XP, badges et statistiques

### Stockage Fichiers
- Bucket Supabase Storage pour les avatars
- Bucket séparé pour les fichiers de cours (PDF/ZIP)
- Politiques RLS pour sécuriser l'accès

---

## 📱 Pages de l'Application

1. **Page d'Accueil** - Présentation de la plateforme
2. **Connexion/Inscription** - Authentification complète
3. **Dashboard Étudiant** - Timer Pomodoro + progression
4. **Mes Défis (Étudiant)** - Liste des défis rejoints
5. **Explorer les Défis** - Tous les défis disponibles
6. **Dashboard Professeur** - Vue d'ensemble des défis créés
7. **Créer un Défi** - Formulaire de création
8. **Détail d'un Défi** - Informations complètes + fichiers
9. **Mon Profil** - Gestion du compte et statistiques
