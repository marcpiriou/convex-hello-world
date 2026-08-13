# Liste de tâches — Convex + React

Application de gestion de liste de tâches construite avec [Convex](https://convex.dev),
React, Vite, Tailwind CSS et [Convex Auth](https://labs.convex.dev/auth).

## Fonctionnalités

- **Liste de tâches** : chaque utilisateur crée, met à jour et supprime ses
  propres tâches (`convex/tasks.ts`), avec un statut (à faire / en cours /
  terminée) et un type optionnel.
- **Back office** (`/admin`) : les administrateurs configurent les **types de
  tâches** proposés aux utilisateurs (nom, couleur, description) —
  `convex/taskTypes.ts`.
- **Deux espaces d'authentification** :
  - `/login` — connexion/inscription des utilisateurs de la liste de tâches.
  - `/admin/login` — connexion/inscription des administrateurs du back
    office.
  - Les deux portails utilisent le même mécanisme (Convex Auth, provider
    `Password`), mais l'inscription pose un rôle différent (`user` ou
    `admin`) sur le compte créé (voir `convex/auth.ts`). Après connexion,
    chacun est redirigé vers son espace selon son rôle.
- Page de connexion avec illustration générique (SVG + fonds flous en CSS,
  aucune image externe requise) — `src/components/HeroIllustration.tsx`.

> ⚠️ Pour simplifier ce projet de démonstration, s'inscrire depuis
> `/admin/login` donne directement le rôle `admin`. Dans une vraie
> application, restreignez la création de comptes administrateurs
> (invitation, validation manuelle, promotion depuis le dashboard Convex...).

## Configurer Convex

Ce dépôt contient déjà tout le code (schéma, fonctions, authentification,
frontend). Il ne reste plus qu'à le connecter à un déploiement Convex — cette
étape nécessite une connexion à votre compte Convex, donc à faire une fois en
local :

1. **Installer les dépendances** (si ce n'est pas déjà fait) :

   ```bash
   npm install
   ```

2. **Lancer `convex dev`** pour créer/relier un déploiement :

   ```bash
   npx convex dev
   ```

   La première exécution ouvre votre navigateur pour vous connecter (ou
   créer un compte) sur [convex.dev](https://dashboard.convex.dev), puis vous
   demande de choisir/créer un projet. Cette commande :
   - crée un fichier `.env.local` avec `CONVEX_DEPLOYMENT` et
     `VITE_CONVEX_URL` (ne pas committer ce fichier — il est déjà ignoré par
     `.gitignore`) ;
   - pousse le schéma (`convex/schema.ts`) et les fonctions vers votre
     déploiement de développement ;
   - régénère `convex/_generated/` (déjà présent dans ce dépôt, il sera
     simplement mis à jour) ;
   - reste actif et redéploie automatiquement à chaque modification des
     fichiers dans `convex/`.

3. **Configurer Convex Auth** (JWT utilisés pour l'authentification) :

   ```bash
   npx @convex-dev/auth
   ```

   Cette commande (à lancer une fois, `convex dev` déjà actif dans un autre
   terminal) génère une paire de clés JWT et les enregistre comme variables
   d'environnement sur votre déploiement, et complète `convex/auth.config.ts`
   si besoin. Voir la
   [documentation Convex Auth](https://labs.convex.dev/auth/setup) pour le
   détail.

4. **Lancer le frontend** (dans un autre terminal, ou via la commande
   combinée ci-dessous) :

   ```bash
   npm run dev:frontend
   ```

   Ou pour lancer Convex **et** Vite en une seule commande :

   ```bash
   npm run dev
   ```

5. Ouvrez `http://localhost:5173/login` pour l'espace utilisateurs, ou
   `http://localhost:5173/admin/login` pour le back office. Créez un compte
   depuis chacun pour tester les deux rôles.

## Scripts

| Commande               | Description                                         |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Lance Vite et `convex dev` en parallèle              |
| `npm run dev:frontend`  | Lance uniquement le serveur Vite                     |
| `npm run dev:backend`   | Lance uniquement `convex dev`                        |
| `npm run build`         | Vérifie les types puis build le frontend (`dist/`)   |
| `npm run lint`          | Lint (oxlint)                                        |

## Structure du projet

```
convex/
  schema.ts       Tables : users (+ rôle), taskTypes, tasks
  auth.ts         Configuration Convex Auth (provider Password + rôle)
  auth.config.ts  Configuration JWT (générée/complétée par `npx @convex-dev/auth`)
  http.ts         Routes HTTP nécessaires à l'authentification
  users.ts        Requête `viewer` (utilisateur courant)
  taskTypes.ts    CRUD des types de tâches (admin uniquement)
  tasks.ts        CRUD des tâches (propres à chaque utilisateur)
  lib/authz.ts    Garde-fous d'authentification/rôle réutilisables

src/
  main.tsx                    Point d'entrée (ConvexAuthProvider + Router)
  App.tsx                     Routes de l'application
  pages/LoginPage.tsx          Page de connexion/inscription (2 portails)
  pages/TasksPage.tsx          Liste de tâches de l'utilisateur
  pages/AdminPage.tsx          Back office (types de tâches)
  components/                 Composants partagés (en-tête, illustration...)
```
