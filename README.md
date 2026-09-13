# FOCUS+ — Academic Productivity Platform

## À propos du projet

FOCUS+ est une plateforme web de productivité académique combinant la gestion du temps (méthode Pomodoro), la gamification (XP/Badges) et le partage de ressources pédagogiques entre enseignants et étudiants.

Le projet a été développé en équipe dans le cadre d'un projet académique, avec deux stacks distincts :

- **Stack 1 :** Angular + FastAPI (Python) + MySQL (SQLAlchemy, authentification JWT), tests Selenium/pytest
- **Stack 2 :** Jakarta EE (Java) + JPA/Hibernate + JSP + MySQL, déployé sur WildFly


**Démo live : https://focus-plus-academy.lovable.app**

Cette démo a été déployée avec [Lovable](https://lovable.dev) afin que le projet soit consultable en ligne par n'importe qui, sans avoir besoin de cloner et lancer le code en local. Elle reproduit fidèlement les mêmes fonctionnalités et le même comportement que la version originale (Angular/FastAPI ou Jakarta EE) : un déploiement du projet avec le stack original donnerait un résultat identique en termes de fonctionnalités et d'expérience utilisateur.

---

## Cahier des Charges : Projet FOCUS+

### 1. Présentation du Projet
**Nom de l'application :** FOCUS+

**Concept :** Une plateforme web de productivité académique combinant la gestion du temps (Méthode Pomodoro), la gamification (XP/Badges) et le partage de ressources pédagogiques entre enseignants et étudiants.

### 2. Objectifs Stratégiques
- Lutter contre la procrastination via un environnement de travail contraint (Mode Strict).
- Favoriser l'engagement par un système de récompenses visuelles.
- Centraliser les ressources en permettant aux professeurs de créer des défis liés à des fichiers de cours.

### 3. Analyse Fonctionnelle (Par Rôle)

**A. Tronc Commun (Tous les utilisateurs)**
- Authentification simplifiée : Connexion via nom/prénom et sélection du rôle.
- Interface Adaptative : Mode Sombre/Clair avec persistance du choix.
- Recherche Globale : Barre de recherche intégrée au header pour filtrer les modules et défis.
- Sidebar Dynamique : Menu changeant selon le rôle (Focus pour étudiants, Création pour professeurs).

**B. Espace Étudiant**
- Gestionnaire de Temps (Pomodoro) : Cycle de 25 minutes avec compte à rebours visuel (SVG progressif).
- Mode Strict : Détection de la sortie de l'onglet (API Visibility) pour empêcher la distraction.
- Système de Progression : Gain automatique de 50 XP par session validée, déblocage de badges (Novice, Productif, Expert) selon le score.
- Consultation des Défis : Liste des modules publiés par les professeurs avec option "Participer".

**C. Espace Professeur**
- Module de Création : Formulaire complet pour publier un défi (Titre, Dates, Description).
- Gestion de Fichiers : Possibilité d'attacher des documents (PDF/ZIP).
- Suivi : Visualisation du nombre de participants par défi et suppression des anciens modules.

### 4. Spécifications Techniques — Stack Original
- **Front-end :** Angular
- **Back-end :** FastAPI (Python), architecture REST, authentification JWT
- **Base de données :** MySQL (via SQLAlchemy)
- **Tests :** Selenium, pytest
- **Variante :** Jakarta EE (Java) + JPA/Hibernate + JSP + WildFly

*(La démo déployée ci-dessus utilise Lovable — React, TypeScript, Vite, Supabase — pour permettre une consultation en ligne immédiate, tout en reproduisant le même comportement fonctionnel que le stack original.)*

### 5. Design (UI/UX)
- Style : Glassmorphism (effets de verre, flou d'arrière-plan, ombres douces).
- Animations : Transitions fluides entre les pages et effets de rebond (bounce) sur les alertes critiques.

### 6. Contraintes et Sécurité
- Responsivité : L'interface doit être utilisable sur desktop et tablette (Sidebar adaptée).
- Intégrité du Focus : Le chronomètre doit se mettre en pause ou alerter l'utilisateur si la fenêtre perd le focus (Mode Strict).
