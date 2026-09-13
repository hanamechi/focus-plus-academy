# Focus Flow (32)

Cahier des Charges : Projet FOCUS+
1. Présentation du Projet
Nom de l'application : FOCUS+

Concept : Une plateforme web de productivité académique combinant la gestion du temps (Méthode Pomodoro), la gamification (XP/Badges) et le partage de ressources pédagogiques entre enseignants et étudiants.

2. Objectifs Stratégiques
Lutter contre la procrastination via un environnement de travail contraint (Mode Strict).

Favoriser l'engagement par un système de récompenses visuelles.

Centraliser les ressources en permettant aux professeurs de créer des défis liés à des fichiers de cours.

3. Analyse Fonctionnelle (Par Rôle)
A. Tronc Commun (Tous les utilisateurs)
Authentification simplifiée : Connexion via nom/prénom et sélection du rôle.

Interface Adaptative : Mode Sombre/Clair avec persistance du choix.

Recherche Globale : Barre de recherche intégrée au header pour filtrer les modules et défis.

Sidebar Dynamique : Menu changeant selon le rôle (Focus pour étudiants, Création pour professeurs).

B. Espace Étudiant
Gestionnaire de Temps (Pomodoro) :

Cycle de 25 minutes avec compte à rebours visuel (SVG progressif).

Mode Strict : Détection de la sortie de l'onglet (API Visibility) pour empêcher la distraction.

Système de Progression : * Gain automatique de 50 XP par session validée.

Déblocage de badges (Novice, Productif, Expert) selon le score.

Consultation des Défis : Liste des modules publiés par les professeurs avec option "Participer".

C. Espace Professeur
Module de Création : Formulaire complet pour publier un défi (Titre, Dates, Description).

Gestion de Fichiers : Possibilité d'attacher des documents (PDF/ZIP).

Suivi : Visualisation du nombre de participants par défi et suppression des anciens modules.

4. Spécifications Techniques
Architecture Front-end
Langages : HTML5, CSS3 (Variables personnalisées), JavaScript Vanilla (ES6+).

Framework CSS : Bootstrap 5.3 pour la structure responsive.

Icônes & Polices : Font Awesome 6.4 & Google Fonts (Plus Jakarta Sans).

Stockage et État
Local Storage : Utilisé pour sauvegarder les préférences de thème et potentiellement les données de session utilisateur.

Gestion d'état : Objets JavaScript pour la gestion en temps réel des défis et du profil utilisateur.

Design (UI/UX)
Style : Glassmorphism (effets de verre, flou d'arrière-plan, ombres douces).

Animations : Transitions fluides entre les pages et effets de rebond (bounce) sur les alertes critiques.

5. Contraintes et Sécurité
Responsivité : L'interface doit être utilisable sur desktop et tablette (Sidebar adaptée).

Intégrité du Focus : Le chronomètre doit se mettre en pause ou alerter l'utilisateur si la fenêtre perd le focus (Mode Strict).

6. Évolutions Futures (V2)
Intégration d'une base de données réelle (Firebase/Node.js) pour la persistance multi-appareils.

Chat en temps réel entre étudiants participant au même défi.

Statistiques hebdomadaires sous forme de graphiques (Chart.js).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://focus-plus-academy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4876f639-fbc9-43bb-bbde-81949691f238).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
