# Gestion des Étudiants - ESISA

Application web complète de gestion des étudiants développée avec **Next.js 16**, **NextAuth.js 4**, **SQLite**, et **Tailwind CSS**.

## 🎯 Fonctionnalités

- ✅ **Authentification sécurisée** avec NextAuth.js (session-based)
- ✅ **Gestion complète des étudiants** (CRUD - Create, Read, Update, Delete)
- ✅ **Base de données SQLite** avec schéma structuré
- ✅ **API RESTful** pour les étudiants
- ✅ **Interface utilisateur moderne** avec Tailwind CSS
- ✅ **Interface responsive** et adaptée aux mobiles
- ✅ **Compatible Vercel** pour le déploiement

## 🛠️ Stack Technologique

### Frontend
- **Next.js 16** avec App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**

### Backend
- **Next.js API Routes**
- **NextAuth.js 4** pour l'authentification

### Base de données
- **SQLite 3**
- **Bcrypt.js** pour le hachage sécurisé des mots de passe

## 📋 Configuration Requise

- **Node.js** 20.x ou supérieur
- **npm** 11.x ou supérieur
- **Git** 2.x ou supérieur

## 🚀 Installation Rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/helaidi-web/gestion-etudiant-ESISA.git
cd gestion-etudiant-ESISA
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Accéder à `http://localhost:3000`

### 5. Initialiser la base de données

```bash
curl http://localhost:3000/api/init
```

### Identifiants de test (par défaut)

- **Email**: `admin@esisa.ac.ma`
- **Mot de passe**: `admin123`

## 📁 Structure du Projet

```
gestion-etudiant/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts      # Configuration NextAuth
│   │   ├── init/route.ts                    # Initialisation BD
│   │   ├── students/
│   │   │   ├── route.ts                     # API CRUD
│   │   │   └── [id]/route.ts                # API par ID
│   ├── dashboard/
│   │   ├── page.tsx                         # Liste des étudiants
│   │   ├── add/page.tsx                     # Ajouter étudiant
│   │   └── edit/[id]/page.tsx               # Modifier étudiant
│   ├── login/page.tsx                       # Page de connexion
│   ├── layout.tsx                           # Layout global
│   └── page.tsx                             # Page d'accueil (redirection)
├── lib/
│   └── db.ts                                # Configuration SQLite
├── public/                                  # Assets statiques
├── .env.local                               # Variables d'environnement (git ignored)
├── .env.example                             # Template env
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── vercel.json                              # Configuration Vercel
└── package.json
```

## 🗄️ Schéma de Base de Données

### Table `users`
Stocke les utilisateurs avec authentification

### Table `students`
Stocke les informations détaillées des étudiants

### Table `courses` et `enrollments`
Pour l'extension future des fonctionnalités

## 🔌 API Endpoints

### Authentification (NextAuth)
- `POST /api/auth/signin` - Se connecter
- `GET /api/auth/session` - Récupérer la session active
- `GET /api/auth/signout` - Se déconnecter

### Étudiants (authentification requise)
- `GET /api/students` - Récupérer tous les étudiants
- `POST /api/students` - Créer un nouvel étudiant
- `GET /api/students/[id]` - Récupérer un étudiant spécifique
- `PUT /api/students/[id]` - Mettre à jour un étudiant
- `DELETE /api/students/[id]` - Supprimer un étudiant

### Autres
- `GET /api/init` - Initialiser la base de données

## 🌐 Déploiement sur Vercel

### Prérequis
- Compte Vercel (gratuit : https://vercel.com)
- Dépôt GitHub configuré

### Procédure de Déploiement

1. **Pousser le code sur GitHub** :
```bash
git push origin main
```

2. **Connecter Vercel à GitHub** :
   - Aller sur https://vercel.com/dashboard
   - Cliquer sur "New Project"
   - Sélectionner le dépôt `gestion-etudiant-ESISA`

3. **Configurer les variables d'environnement** :
   - Dans les settings de Vercel, ajouter :
   ```
   NEXTAUTH_SECRET=votre-cle-secrete-32-caracteres-minimum
   NEXTAUTH_URL=https://votre-domaine.vercel.app (HTTPS obligatoire)
   ```

4. **Déployer** :
   - Cliquer sur "Deploy"
   - L'application sera déployée automatiquement

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcryptjs
- ✅ Sessions sécurisées avec NextAuth.js
- ✅ Protection CSRF intégrée
- ✅ Variables sensibles en .env.local (git ignored)
- ✅ Validation des entrées côté serveur
- ✅ Routes protégées nécessitant une authentification

## 📝 Commandes Utiles

```bash
# Installation des dépendances
npm install

# Développement (http://localhost:3000)
npm run dev

# Build pour production
npm run build

# Lancer la version production
npm start

# Vérification du code (ESLint)
npm run lint

# Vérification des types TypeScript
npx tsc --noEmit
```

## 🐛 Dépannage

### Erreur: "Database locked"
- Arrêter le serveur
- Relancer avec `npm run dev`
- Si nécessaire, supprimer `lib/students.db` et relancer l'initialisation

### Erreur: "User not found" au login
- Vérifier que l'API init a été appelée : `curl http://localhost:3000/api/init`
- Les identifiants par défaut sont : `admin@esisa.ac.ma` / `admin123`

### Erreur: Application ne démarre pas
- Vérifier que le port 3000 n'est pas utilisé
- Nettoyer le cache : `rm -rf .next node_modules && npm install`

## 📧 Contact

- **Email**: h.elaidi@esisa.ac.ma
- **GitHub**: https://github.com/helaidi-web/gestion-etudiant-ESISA

## 📄 Licence

Ce projet est un projet académique développé pour ESISA.

---

**✅ Statut du Projet**: Prêt pour la production et le déploiement sur Vercel

**Dernière mise à jour**: Février 2026
