# 🚀 Portfolio V2 - Mathéo PATIN (SysAdmin & Dev)

> **Une interface immersive style "Terminal / Cyberpunk" développée avec React, Tailwind et Supabase.**

[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com/)

Ce projet est une **Progressive Web App (SPA)** conçue pour présenter mon parcours et mes projets. Il ne s'agit pas d'un simple site vitrine statique : tout le contenu est dynamique, administrable et interactif.

🔗 **Live Demo :** [https://mpatin-portfolio.vercel.app](https://mpatin-portfolio.vercel.app)

---

## ✨ Fonctionnalités Clés

### 🖥️ Expérience Utilisateur (Frontend)

- **Design Terminal / Système :** Interface inspirée des terminaux Linux et macOS.
- **Command Palette (`Ctrl + K`) :** Navigation ultra-rapide au clavier pour les Power Users.
- **Animations Fluides :** Transitions de pages et apparitions en cascade avec `Framer Motion`.
- **Effets "Hacker" :** Texte qui s'écrit tout seul, curseurs clignotants, simulations de logs serveur.

### ⚙️ Ingénierie (Backend & Logic)

- **Générateur de CV PDF Dynamique :** Utilisation de `@react-pdf/renderer` pour générer un CV imprimable à partir des données de la BDD (avec photo ronde, métadonnées, etc.).
- **Admin Panel Sécurisé :** Interface complète pour ajouter/modifier/supprimer des projets et des expériences sans toucher au code.
- **Formulaire de Contact Blindé :**
  - **Honeypot :** Champ caché pour piéger les robots.
  - **Captcha Terminal :** Défi mathématique (`exemple : calc 5 + 3`) pour valider l'humain.
  - **Feedback Visuel :** Bouton dynamique (Rouge/Vert) selon l'état de sécurité.

### ☁️ Infrastructure

- **Base de données :** PostgreSQL via **Supabase**.
- **Stockage :** Bucket S3 (Supabase Storage) pour les images et assets.
- **Déploiement :** CI/CD automatique via **Vercel**.

---

## 🛠️ Stack Technique

| Domaine | Technologie | Usage |
| :--- | :--- | :--- |
| **Core** | React 18 + Vite | Performance et rapidité de dev |
| **Style** | Tailwind CSS | Design System utilitaire |
| **Animation** | Framer Motion | Transitions de pages et micro-interactions |
| **Data & Auth** | Supabase | BDD temps réel, Auth, Storage |
| **PDF** | React-PDF | Génération de documents côté client |
| **Emailing** | EmailJS | Envoi de mails sans serveur backend |
| **Utils** | cmdk | Command Palette accessible |

---

## 📦 Installation & Démarrage local

Pour tester le projet sur votre machine :

```bash
# 1. Cloner le dépôt
git clone [https://github.com/mpatin27/mpatin-portfolio.git](https://github.com/mpatin27/mpatin-portfolio.git)

# 2. Installer les dépendances
cd mpatin-portfolio
npm install

# 3. Configurer les variables d'environnement
# (Voir section suivante)

# 4. Lancer le serveur de développement
npm run dev
```

---

## 🔑 Configuration (.env)

Créez un fichier .env à la racine et ajoutez vos clés API :

```.env
# Supabase (BDD & Auth)
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_publique

# EmailJS (Contact Form)
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

## 🗄️ Structure de la Base de Données (SQL)

Le projet repose sur 3 tables principales dans Supabase :

1. profile : Infos personnelles, skills, photo (avatar_url), statut.
2. projects : Liste des projets (titre, desc, tags, liens, images, ordre).
3. cv_items : Expériences et Formations (catégorie, dates, lieux).

(Le script SQL d'initialisation est disponible sur demande)

---

## 🐛 Gestion des Erreurs & Routing

- Page 404 Personnalisée : Simulation d'un "Kernel Panic" / BSOD avec compte à rebours.
- Routing SPA : Configuration vercel.json pour gérer le rechargement des pages React en production.

---

## 👨‍💻 Auteur

Mathéo PATIN | Admin Sys, Réseaux & BDD

- 🌐 [Portfolio](https://mpatin-portfolio.vercel.app)
- 🐙 [GitHub](https://github.com/mpatin27)
- 💼 [LinkedIn](www.linkedin.com/in/patin-matheo)

---

"Je construis des ponts entre le système et le web."
