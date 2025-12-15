# MediaBunny App - Application Web Auto-Hébergée

Application web moderne et performante pour la conversion de fichiers médias utilisant [MediaBunny](https://github.com/Vanilagy/mediabunny).

## 🚀 Fonctionnalités

- ✅ Conversion multi-formats (MP4, WebM, MP3, WAV, etc.)
- ✅ Extraction audio depuis vidéo
- ✅ Analyse complète des métadonnées
- ✅ Découpage et trim de médias
- ✅ Redimensionnement vidéo
- ✅ Interface moderne et réactive (Vue 3 + Tailwind CSS v4 + DaisyUI 5)
- ✅ Auto-hébergement complet
- ✅ API REST complète
- ✅ Déploiement Docker

## ⚠️ Limitations importantes

### Codecs supportés

MediaBunny utilise l'API **WebCodecs** du navigateur/Node.js, ce qui signifie que seuls les codecs supportés par votre environnement fonctionneront :

**Codecs vidéo supportés (généralement) :**
- H.264 (AVC)
- VP8
- VP9
- AV1

**Codecs audio supportés :**
- AAC
- Opus
- MP3
- Vorbis

**Codecs NON supportés (erreur "undecodable_source_codec") :**
- H.265 (HEVC) - support limité
- ProRes
- DNxHD
- Codecs propriétaires

### Environnement serveur

En environnement **Node.js** (comme dans Docker), le support des codecs est encore plus limité car Node.js n'implémente pas complètement WebCodecs. Pour une conversion côté serveur robuste, il faudrait utiliser **FFmpeg** au lieu de MediaBunny.

### Solution recommandée

Pour un environnement de production avec support complet des codecs :
1. Utiliser MediaBunny **côté client** (navigateur) où WebCodecs est pleinement implémenté
2. Ou remplacer MediaBunny par **FFmpeg** côté serveur pour un support universel

## 📌 Technologies Utilisées

### Backend
- Node.js 20+ avec Express
- TypeScript
- MediaBunny 1.26.0 (avec limitations WebCodecs)
- Multer (gestion fichiers)

### Frontend
- Vue.js 3.5+ (Composition API)
- Vite 6.x
- TypeScript
- **Tailwind CSS 4.0** (CSS-first)
- **DaisyUI 5.5** (composants UI)
- Pinia (state management)
- Axios

## 📋 Prérequis

- Node.js 20 ou supérieur
- npm 10 ou supérieur
- Docker et Docker Compose (optionnel)

## 🛠️ Installation

### Option 1: Installation Manuelle

1. **Cloner le dépôt**
```bash
git clone https://github.com/frankkubler/mediabunny-app.git
cd mediabunny-app
```

2. **Installer toutes les dépendances**
```bash
npm run install:all
```

3. **Configuration**

Créer les fichiers `.env` :

**server/.env**
```env
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=500000000
UPLOAD_DIR=./uploads
OUTPUT_DIR=./output
CORS_ORIGIN=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Lancer en mode développement**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`  
Le client démarre sur `http://localhost:5173`

5. **Build pour production**
```bash
npm run build
npm start
```

### Option 2: Installation Docker

1. **Build et démarrage**
```bash
docker-compose up -d
```

2. **Accéder à l'application**
```
http://localhost:3000
```

3. **Arrêter l'application**
```bash
docker-compose down
```

4. **Voir les logs**
```bash
docker logs mediabunny-app -f
```

## 📁 Structure du Projet

```
mediabunny-app/
├── server/              # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/ # Logique métier
│   │   ├── routes/      # Routes API
│   │   ├── services/    # Services (MediaBunny)
│   │   ├── middleware/  # Middlewares
│   │   └── utils/       # Utilitaires
│   ├── uploads/         # Fichiers uploadés
│   └── output/          # Fichiers convertis
├── client/              # Frontend Vue.js 3
│   ├── src/
│   │   ├── components/  # Composants Vue
│   │   ├── views/       # Pages
│   │   ├── stores/      # State management (Pinia)
│   │   └── services/    # Services API
│   └── dist/            # Build production
├── docker-compose.yml   # Configuration Docker
└── Dockerfile
```

## 📡 API Endpoints

### Media

- `POST /api/media/upload` - Upload un fichier
- `GET /api/media/metadata/:fileId` - Récupère les métadonnées
- `DELETE /api/media/:fileId` - Supprime un fichier
- `GET /api/media/list` - Liste tous les fichiers

### Conversion

- `POST /api/conversion/convert` - Convertit un fichier
  ```json
  {
    "fileId": "uuid-du-fichier",
    "outputFormat": "mp4",
    "codec": "avc",
    "bitrate": 5000000
  }
  ```
- `POST /api/conversion/extract-audio` - Extrait l'audio
- `POST /api/conversion/resize` - Redimensionne une vidéo
- `POST /api/conversion/trim` - Découpe un média
- `POST /api/conversion/rotate` - Pivote une vidéo

## 🔧 Configuration

### Variables d'environnement Serveur

- `PORT`: Port du serveur (défaut: 3000)
- `NODE_ENV`: Environnement (development/production)
- `MAX_FILE_SIZE`: Taille max des fichiers en octets (défaut: 500MB)
- `UPLOAD_DIR`: Dossier des uploads
- `OUTPUT_DIR`: Dossier des fichiers convertis
- `CORS_ORIGIN`: Origin CORS autorisée

### Variables d'environnement Client

- `VITE_API_URL`: URL de l'API backend

## ✨ Tailwind CSS v4 et DaisyUI 5

Cette application utilise les **dernières versions** de Tailwind CSS et DaisyUI :

### Changements importants Tailwind CSS v4

- **Configuration CSS-first** : Plus de `tailwind.config.js`
- **Import simple** : `@import "tailwindcss"` 
- **Plugin Vite** : `@tailwindcss/vite`
- **Plugins** : `@plugin "daisyui"`

### DaisyUI 5

- Version 5.5.5 compatible avec Tailwind CSS v4
- Import via `@plugin "daisyui"`
- Thèmes prédéfinis

## 📝 Développement

```bash
# Installer les dépendances
npm run install:all

# Mode développement (serveur + client)
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Serveur uniquement
npm run dev:server

# Client uniquement
npm run dev:client
```

## 🐳 Déploiement Docker

```bash
# Build
docker-compose build

# Démarrer
docker-compose up -d

# Logs
docker-compose logs -f

# Arrêter
docker-compose down

# Reconstruire complètement
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Sécurité

- Validation des types de fichiers
- Limite de taille configurable
- Helmet.js pour sécurité HTTP
- CORS configuré
- Gestion des erreurs
- Nettoyage automatique des fichiers

## 🐛 Dépannage

### Erreur "undecodable_source_codec"

Cette erreur signifie que le codec de votre fichier n'est pas supporté par WebCodecs. Solutions :

1. **Utiliser un fichier avec codec supporté** (H.264, VP8, VP9)
2. **Pré-convertir avec FFmpeg** :
   ```bash
   ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
   ```
3. **Migrer vers FFmpeg côté serveur** pour support universel

### Problème de dépendances

```bash
rm -rf node_modules server/node_modules client/node_modules
rm package-lock.json server/package-lock.json client/package-lock.json
npm run install:all
```

### Warnings FileHandle

Les warnings de fermeture de FileHandle ont été corrigés dans les dernières versions. Assurez-vous d'avoir la dernière version :

```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Améliorations futures

### Pour production

1. **Remplacer MediaBunny par FFmpeg** côté serveur
   - Support universel des codecs
   - Meilleures performances
   - Plus de fonctionnalités

2. **Ajouter une queue de jobs** (Bull/BullMQ)
   - Traitement asynchrone
   - Gestion de la charge
   - Retry automatique

3. **Implémenter le stockage S3**
   - Scalabilité
   - CDN
   - Durabilité

4. **Ajouter authentification**
   - JWT
   - OAuth2
   - Rate limiting

## 📚 Ressources

- [MediaBunny Documentation](https://mediabunny.dev)
- [MediaBunny GitHub](https://github.com/Vanilagy/mediabunny)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [DaisyUI 5](https://daisyui.com)
- [Vue.js 3](https://vuejs.org)
- [Vite](https://vitejs.dev)
- [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)

## 📝 Licence

Ce projet utilise MediaBunny sous licence MPL-2.0.

## 🙏 Remerciements

- [MediaBunny](https://github.com/Vanilagy/mediabunny) par Vanilagy
- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

---

**Auteur** : Frank KUBLER  
**Repository** : [https://github.com/frankkubler/mediabunny-app](https://github.com/frankkubler/mediabunny-app)
