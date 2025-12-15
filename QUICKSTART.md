# 🚀 Démarrage Rapide - MediaBunny App v2.0 (FFmpeg)

## ✨ Nouveautés v2.0

**Serveur FFmpeg complet implémenté !**

- ✅ Support de **TOUS les codecs** (H.264, H.265/HEVC, ProRes, AV1, VP9, etc.)
- ✅ Queue de jobs asynchrone (Bull + Redis)
- ✅ Progression en temps réel
- ✅ API REST complète
- ✅ Interface web (Vue 3)

---

## 💻 Installation (30 secondes)

```bash
# 1. Récupérer le code
git pull origin main

# 2. Lancer avec Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 3. Ouvrir dans le navigateur
http://localhost:3000
```

**C'est tout !** FFmpeg + Redis + Application sont installés automatiquement.

---

## ✅ Vérification

### 1. Health Check

```bash
curl http://localhost:3000/api/health

# Réponse attendue:
{
  "status": "ok",
  "ffmpeg": "enabled",
  "redis": "redis://redis:6379"
}
```

### 2. Vérifier FFmpeg

```bash
docker exec mediabunny-app ffmpeg -version

# Devrait afficher : ffmpeg version 6.x
```

### 3. Vérifier Redis

```bash
docker exec mediabunny-redis redis-cli ping

# Devrait retourner : PONG
```

---

## 🎯 Test Rapide avec votre fichier H.264+AAC

### Étape 1 : Upload

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@votre_fichier.mp4"

# Réponse:
{
  "success": true,
  "file": {
    "id": "abc-123-xyz",
    "filename": "votre_fichier.mp4",
    "size": 50000000
  }
}
```

**Note** : Copier le `id` pour les étapes suivantes.

### Étape 2 : Métadonnées

```bash
curl http://localhost:3000/api/ffmpeg/metadata/abc-123-xyz

# Réponse:
{
  "success": true,
  "metadata": {
    "duration": 156.5,
    "format": "mov,mp4,m4a,3gp,3g2,mj2",
    "video": {
      "codec": "h264",
      "width": 1280,
      "height": 720,
      "fps": 30
    },
    "audio": {
      "codec": "aac",
      "sampleRate": 48000,
      "channels": 2
    }
  }
}
```

### Étape 3 : Conversion (VA FONCTIONNER !)

```bash
curl -X POST http://localhost:3000/api/ffmpeg/convert \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123-xyz",
    "outputFormat": "mp4",
    "videoCodec": "libx264",
    "audioCodec": "aac",
    "videoBitrate": "2M"
  }'

# Réponse:
{
  "success": true,
  "outputId": "output-456",
  "outputPath": "/output/output-456.mp4",
  "filename": "output-456.mp4"
}
```

### Étape 4 : Téléchargement

```bash
curl http://localhost:3000/output/output-456.mp4 -o converted.mp4
```

**✅ SUCCÈS !** Votre fichier est converti sans erreur `undecodable_source_codec`.

---

## 📖 Fonctionnalités Disponibles

### 1. Conversion Simple

```bash
curl -X POST http://localhost:3000/api/ffmpeg/convert \
  -d '{"fileId": "abc-123", "outputFormat": "mp4"}'
```

### 2. Extraction Audio MP3

```bash
curl -X POST http://localhost:3000/api/ffmpeg/extract-audio \
  -d '{"fileId": "abc-123", "outputFormat": "mp3", "bitrate": "320k"}'
```

### 3. Redimensionnement 1080p

```bash
curl -X POST http://localhost:3000/api/ffmpeg/resize \
  -d '{"fileId": "abc-123", "width": 1920, "height": 1080}'
```

### 4. Découpage (10s → 60s)

```bash
curl -X POST http://localhost:3000/api/ffmpeg/trim \
  -d '{"fileId": "abc-123", "startTime": 10, "endTime": 60}'
```

### 5. Rotation 90°

```bash
curl -X POST http://localhost:3000/api/ffmpeg/rotate \
  -d '{"fileId": "abc-123", "rotation": 90}'
```

### 6. Miniature

```bash
curl -X POST http://localhost:3000/api/ffmpeg/thumbnail \
  -d '{"fileId": "abc-123", "timestamp": 5, "size": "640x360"}'
```

---

## 📊 Conversion Asynchrone (Gros Fichiers)

Pour fichiers > 100 MB :

```bash
# 1. Démarrer la conversion
curl -X POST http://localhost:3000/api/ffmpeg/convert/async \
  -d '{"fileId": "big-file", "outputFormat": "mp4"}'

# Réponse: {"jobId": "42", ...}

# 2. Suivre la progression
curl http://localhost:3000/api/ffmpeg/job/42

# Réponse:
{
  "jobId": "42",
  "state": "active",
  "progress": 45
}

# 3. Quand terminé (state: "completed")
{
  "jobId": "42",
  "state": "completed",
  "progress": 100,
  "result": {
    "outputPath": "/output/xyz.mp4",
    "filename": "xyz.mp4"
  }
}

# 4. Télécharger
curl http://localhost:3000/output/xyz.mp4 -o converted.mp4
```

---

## 📱 Interface Web

**Accéder** : http://localhost:3000

L'interface web permet :
- 📁 Upload par glisser-déposer
- ℹ️ Affichage des métadonnées
- 🔄 Conversion avec options
- 📈 Progression en temps réel
- 📥 Téléchargement direct

---

## 📄 Documentation Complète

| Fichier | Description |
|---------|-------------|
| **[FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md)** | 📖 Guide complet avec tous les exemples |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Explication technique |
| [README.md](./README.md) | Vue d'ensemble |

---

## 🔧 Commandes Docker Utiles

```bash
# Voir les logs en temps réel
docker logs mediabunny-app -f

# Arrêter l'application
docker-compose down

# Redemarrer
docker-compose restart

# Rebuild complet
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Entrer dans le container
docker exec -it mediabunny-app sh

# Voir les fichiers uploadés
docker exec mediabunny-app ls -lh /app/server/uploads

# Voir les fichiers convertis
docker exec mediabunny-app ls -lh /app/server/output
```

---

## ⚠️ Dépannage Rapide

### Erreur "Cannot connect to Redis"

```bash
# Vérifier Redis
docker logs mediabunny-redis

# Redémarrer Redis
docker-compose restart redis
```

### Erreur "FFmpeg not found"

```bash
# Vérifier FFmpeg
docker exec mediabunny-app which ffmpeg

# Rebuild si nécessaire
docker-compose build --no-cache
```

### Conversion échoue

```bash
# Voir les logs détaillés
docker logs mediabunny-app -f

# Vérifier les métadonnées du fichier
curl http://localhost:3000/api/ffmpeg/metadata/FILE_ID
```

---

## 🎉 Récapitulatif

### ❌ Avant (MediaBunny Node.js)

```
Erreur: undecodable_source_codec
Support: Seulement H.264/AAC
Production: Non
```

### ✅ Maintenant (FFmpeg)

```
Support: TOUS les codecs (H.265, ProRes, AV1, VP9, etc.)
Queue: Jobs asynchrones avec progression
Production: Ready !
```

---

## 🚀 Prochaines Étapes

1. **Tester avec vos fichiers** (H.264, H.265, etc.)
2. **Explorer l'interface web** (http://localhost:3000)
3. **Lire le guide complet** ([FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md))
4. **Déployer en production** (voir documentation)

---

**Votre fichier H.264+AAC fonctionnera à 100% maintenant !** 🎉

**Questions ?** Consultez [FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md) pour tous les détails.
