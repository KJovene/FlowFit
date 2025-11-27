# 🚀 Guide de Déploiement FlowFit

Ce guide vous explique comment déployer l'application FlowFit avec :

- **Frontend** : Vercel
- **Backend** : Railway (ou Render)
- **Base de données** : Supabase PostgreSQL
- **Stockage des fichiers** : Supabase Storage

## 📋 Prérequis

Avant de commencer, créez des comptes sur :

- [Supabase](https://supabase.com) (gratuit)
- [Railway](https://railway.app) ou [Render](https://render.com) (gratuit)
- [Vercel](https://vercel.com) (gratuit)

---

## 1️⃣ Configuration de Supabase

### A. Créer un nouveau projet

1. Connectez-vous à [Supabase](https://app.supabase.com)
2. Cliquez sur **"New Project"**
3. Choisissez un nom et un mot de passe pour votre base de données
4. Sélectionnez une région proche de vos utilisateurs
5. Attendez que le projet soit créé (~2 minutes)

### B. Configurer la base de données

1. Dans le menu de gauche, allez sur **"SQL Editor"**
2. Votre backend Sequelize créera automatiquement les tables au premier démarrage
3. Notez les informations de connexion dans **Settings > Database** :
   - Host : `db.xxxxxxxxxxxxx.supabase.co`
   - Port : `5432`
   - Database name : `postgres`
   - User : `postgres`
   - Password : (votre mot de passe choisi)

### C. Configurer Supabase Storage

1. Dans le menu de gauche, allez sur **"Storage"**
2. Créez 3 buckets publics :
   - Cliquez sur **"New bucket"**
   - Nom : `exercises`, Public : ✅
   - Nom : `sessions`, Public : ✅
   - Nom : `profiles`, Public : ✅

### D. Récupérer les clés API

1. Allez dans **Settings > API**
2. Notez ces informations :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key** : `eyJhbGc...`
   - **service_role key** : `eyJhbGc...` (⚠️ À garder secret !)

---

## 2️⃣ Déploiement du Backend sur Railway

### A. Préparer le repository Git

```bash
# Assurez-vous que votre code est committé
git add .
git commit -m "Préparation pour le déploiement"
git push origin main
```

### B. Déployer sur Railway

1. Allez sur [Railway](https://railway.app)
2. Cliquez sur **"New Project"**
3. Choisissez **"Deploy from GitHub repo"**
4. Sélectionnez votre repository FlowFit
5. Railway détectera automatiquement le backend Node.js

### C. Configurer les variables d'environnement

Dans Railway, allez dans **Variables** et ajoutez :

```env
# Port
PORT=4000
NODE_ENV=production

# Database (Supabase)
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe-supabase

# JWT Secret (générez une clé aléatoire)
JWT_SECRET=votre-cle-secrete-aleatoire-tres-longue

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# Storage Buckets
STORAGE_BUCKET_EXERCISES=exercises
STORAGE_BUCKET_SESSIONS=sessions
STORAGE_BUCKET_PROFILES=profiles
```

### D. Générer une clé JWT sécurisée

```bash
# Dans votre terminal, générez une clé aléatoire
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### E. Récupérer l'URL du backend

Une fois déployé, Railway vous donnera une URL comme :
`https://flowfit-production.up.railway.app`

Notez cette URL pour la configuration du frontend.

---

## 3️⃣ Déploiement du Frontend sur Vercel

### A. Installer Vercel CLI (optionnel)

```bash
npm install -g vercel
```

### B. Déployer via l'interface web

1. Allez sur [Vercel](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Importez votre repository GitHub
4. Vercel détectera automatiquement Vite

### C. Configurer les variables d'environnement

Dans **Settings > Environment Variables**, ajoutez :

```env
VITE_API_URL=https://flowfit-production.up.railway.app/api
```

⚠️ **Important** : Remplacez l'URL par celle de votre backend Railway

### D. Configurer le Root Directory

Dans les **Build & Development Settings** :

- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

### E. Déployer

Cliquez sur **"Deploy"** et attendez quelques minutes.

---

## 4️⃣ Vérification du déploiement

### Backend

Testez votre API :

```bash
curl https://votre-backend.railway.app
# Devrait retourner "API Working"
```

### Base de données

Vérifiez que les tables sont créées dans Supabase :

1. Allez dans **Table Editor**
2. Vous devriez voir : Users, Exercises, Sessions, etc.

### Storage

Testez l'upload d'une image via votre frontend déployé.

### Frontend

1. Ouvrez l'URL Vercel de votre application
2. Essayez de vous inscrire et créer un exercice avec une image

---

## 🔧 Commandes utiles

### Mettre à jour le backend

```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway redéploiera automatiquement
```

### Mettre à jour le frontend

```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel redéploiera automatiquement
```

### Voir les logs Railway

```bash
# Via l'interface web Railway > Deployments > Logs
# Ou avec Railway CLI
railway logs
```

---

## 🐛 Résolution des problèmes courants

### Erreur de connexion à la base de données

- Vérifiez que les variables `DB_HOST`, `DB_PASSWORD` sont correctes
- Supabase peut prendre quelques minutes pour activer la base de données
- Vérifiez que vous avez autorisé les connexions externes dans Supabase

### Erreur d'upload d'images

- Vérifiez que les buckets Supabase sont bien **publics**
- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est définie (pas l'anon key)
- Regardez les logs Railway pour voir les erreurs

### CORS Error

Si vous voyez des erreurs CORS dans la console du navigateur :

1. Vérifiez que `VITE_API_URL` pointe vers le bon backend
2. Le backend a déjà CORS activé par défaut

### Frontend ne se connecte pas au backend

1. Vérifiez la variable `VITE_API_URL` dans Vercel
2. Elle doit finir par `/api` : `https://xxx.railway.app/api`
3. Redéployez le frontend après avoir changé les variables

---

## 📊 Monitoring

### Railway

- Accédez aux logs en temps réel
- Surveillez l'utilisation des ressources
- Plan gratuit : 500h/mois

### Vercel

- Analytics disponibles dans le dashboard
- Monitoring des performances
- Plan gratuit : bande passante illimitée

### Supabase

- Dashboard pour voir les requêtes SQL
- Storage usage
- Plan gratuit : 500 MB database, 1 GB storage

---

## 🔐 Sécurité

### Variables sensibles

- ⚠️ Ne commitez JAMAIS `.env` dans Git
- Les fichiers `.env.example` sont là pour documenter

### JWT Secret

- Utilisez une clé longue et aléatoire (64+ caractères)
- Changez-la si elle est compromise

### Supabase Service Role Key

- Gardez cette clé secrète
- Ne l'exposez jamais côté frontend
- Utilisez uniquement côté backend

---

## ✅ Checklist finale

Avant de mettre en production :

- [ ] Base de données Supabase créée et configurée
- [ ] 3 buckets Storage créés (exercises, sessions, profiles)
- [ ] Backend déployé sur Railway avec toutes les variables d'env
- [ ] Frontend déployé sur Vercel avec `VITE_API_URL` configurée
- [ ] Test d'inscription d'un utilisateur
- [ ] Test de création d'un exercice avec image
- [ ] Test de création d'une session
- [ ] Vérification que les images s'affichent correctement

---

## 🎉 Félicitations !

Votre application FlowFit est maintenant en production !

**URLs à partager :**

- Frontend : `https://votre-app.vercel.app`
- Backend API : `https://votre-api.railway.app`

---

## 📞 Support

En cas de problème :

1. Vérifiez les logs Railway et Vercel
2. Consultez la documentation officielle :
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
