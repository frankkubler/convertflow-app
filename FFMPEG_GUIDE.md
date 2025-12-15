# Guide FFmpeg - MediaBunny App v2.0

## 🎉 Serveur FFmpeg Complet Implémenté !

Votre application dispose maintenant d'un **serveur FFmpeg professionnel** qui supporte **TOUS les codecs** et formats vidéo/audio.

---

## ✅ Avantages FFmpeg

### Support Universel
- ✅ **H.264** (votre fichier actuel)
- ✅ **H.265/HEVC** (iPhone, caméras modernes)
- ✅ **ProRes** (vidéos professionnelles)
- ✅ **AV1, VP8, VP9, MPEG-4** et bien plus
- ✅ **Tous les codecs audio** (AAC, MP3, FLAC, Opus, etc.)

### Fonctionnalités Avancées
- ✅ Conversion synchrone et asynchrone
- ✅ Queue de jobs (Bull + Redis)
- ✅ Progression en temps réel
- ✅ Trim, Resize, Rotate, Crop
- ✅ Extraction audio
- ✅ Miniatures vidéo
- ✅ Concaténation

---

## 🚀 Installation

### 1. Démarrage Docker

```bash
# Récupérer le code
git pull origin main

# Build avec FFmpeg + Redis
docker-compose build --no-cache

# Lancer (app + Redis)
docker-compose up -d

# Vérifier
docker logs mediabunny-app
docker logs mediabunny-redis
```

### 2. Vérification FFmpeg

```bash
# Vérifier FFmpeg dans le container
docker exec mediabunny-app ffmpeg -version

# Devrait afficher : ffmpeg version 6.x
```

### 3. Test Health Check

```bash
curl http://localhost:3000/api/health

# Réponse attendue:
{
  "status": "ok",
  "ffmpeg": "enabled",
  "redis": "redis://redis:6379"
}
```

---

## 📡 API FFmpeg - Référence Complète

### 1. Métadonnées

**Endpoint** : `GET /api/ffmpeg/metadata/:fileId`

```bash
curl http://localhost:3000/api/ffmpeg/metadata/abc-123
```

**Réponse** :
```json
{
  "success": true,
  "metadata": {
    "duration": 156.5,
    "format": "mov,mp4,m4a,3gp,3g2,mj2",
    "size": 50000000,
    "bitrate": 2560000,
    "video": {
      "codec": "h264",
      "width": 1280,
      "height": 720,
      "fps": 30,
      "bitrate": 2300000
    },
    "audio": {
      "codec": "aac",
      "sampleRate": 48000,
      "channels": 2,
      "bitrate": 192000
    }
  }
}
```

---

### 2. Conversion Simple (Synchrone)

**Endpoint** : `POST /api/ffmpeg/convert`

**Pour fichiers < 100MB** (réponse immédiate)

```bash
curl -X POST http://localhost:3000/api/ffmpeg/convert \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "outputFormat": "mp4",
    "videoCodec": "libx264",
    "audioCodec": "aac",
    "videoBitrate": "2M",
    "audioBitrate": "192k"
  }'
```

**Réponse** :
```json
{
  "success": true,
  "outputId": "xyz-789",
  "outputPath": "/output/xyz-789.mp4",
  "filename": "xyz-789.mp4"
}
```

**Téléchargement** :
```bash
curl http://localhost:3000/output/xyz-789.mp4 -o converted.mp4
```

---

### 3. Conversion Asynchrone (Gros Fichiers)

**Endpoint** : `POST /api/ffmpeg/convert/async`

**Pour fichiers > 100MB** (avec queue)

```bash
curl -X POST http://localhost:3000/api/ffmpeg/convert/async \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "big-file-123",
    "outputFormat": "mp4",
    "videoCodec": "libx265",
    "videoBitrate": "5M"
  }'
```

**Réponse** :
```json
{
  "success": true,
  "jobId": "42",
  "message": "Conversion en cours",
  "statusUrl": "/api/ffmpeg/job/42"
}
```

**Suivre la progression** :
```bash
curl http://localhost:3000/api/ffmpeg/job/42

# Réponse:
{
  "success": true,
  "jobId": "42",
  "state": "active",
  "progress": 45,
  "result": null
}

# Quand terminé (state: "completed"):
{
  "success": true,
  "jobId": "42",
  "state": "completed",
  "progress": 100,
  "result": {
    "outputId": "xyz-789",
    "outputPath": "/output/xyz-789.mp4",
    "filename": "xyz-789.mp4"
  }
}
```

---

### 4. Extraction Audio

**Endpoint** : `POST /api/ffmpeg/extract-audio`

```bash
curl -X POST http://localhost:3000/api/ffmpeg/extract-audio \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "outputFormat": "mp3",
    "bitrate": "320k"
  }'
```

**Formats supportés** : `mp3`, `aac`, `wav`, `flac`, `opus`

---

### 5. Redimensionnement

**Endpoint** : `POST /api/ffmpeg/resize`

```bash
# Redimensionner en 1280x720
curl -X POST http://localhost:3000/api/ffmpeg/resize \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "width": 1280,
    "height": 720,
    "maintainAspectRatio": true
  }'

# Largeur fixe, hauteur automatique
curl -X POST http://localhost:3000/api/ffmpeg/resize \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "width": 1920,
    "maintainAspectRatio": true
  }'
```

---

### 6. Découpage (Trim)

**Endpoint** : `POST /api/ffmpeg/trim`

```bash
# Extraire de 10s à 60s
curl -X POST http://localhost:3000/api/ffmpeg/trim \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "startTime": 10,
    "endTime": 60
  }'
```

**Astuce** : Utilise codec copy (rapide, sans ré-encodage)

---

### 7. Rotation

**Endpoint** : `POST /api/ffmpeg/rotate`

```bash
# Rotation 90°
curl -X POST http://localhost:3000/api/ffmpeg/rotate \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "rotation": 90
  }'
```

**Valeurs** : `90`, `180`, `270`

---

### 8. Miniature Vidéo

**Endpoint** : `POST /api/ffmpeg/thumbnail`

```bash
# Miniature à 1 seconde
curl -X POST http://localhost:3000/api/ffmpeg/thumbnail \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "timestamp": 1,
    "size": "640x360"
  }'
```

**Résultat** : Image JPEG

---

## 📊 Exemples de Workflow Complets

### Workflow 1 : Conversion H.265 → H.264

```bash
# 1. Upload du fichier H.265
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@video_hevc.mp4"

# Réponse: { "fileId": "abc-123", ... }

# 2. Conversion en H.264
curl -X POST http://localhost:3000/api/ffmpeg/convert \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "outputFormat": "mp4",
    "videoCodec": "libx264",
    "audioCodec": "aac",
    "videoBitrate": "2M"
  }'

# 3. Télécharger
curl http://localhost:3000/output/xyz-789.mp4 -o converted.mp4
```

### Workflow 2 : Créer un extrait HD

```bash
# 1. Upload
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@longue_video.mp4"

# 2. Extraire 30s à 1080p
curl -X POST http://localhost:3000/api/ffmpeg/convert/async \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "abc-123",
    "outputFormat": "mp4",
    "startTime": 30,
    "duration": 30,
    "width": 1920,
    "height": 1080,
    "videoBitrate": "5M"
  }'

# 3. Suivre progression
watch -n 1 'curl -s http://localhost:3000/api/ffmpeg/job/42 | jq .progress'

# 4. Télécharger quand terminé
curl http://localhost:3000/output/xyz-789.mp4 -o extrait_hd.mp4
```

### Workflow 3 : Préparer pour le web

```bash
# Vidéo + audio + miniature

# 1. Conversion optimisée web (H.264 + AAC)
curl -X POST http://localhost:3000/api/ffmpeg/convert \
  -d '{
    "fileId": "abc-123",
    "outputFormat": "mp4",
    "videoCodec": "libx264",
    "audioCodec": "aac",
    "videoBitrate": "1.5M",
    "audioBitrate": "128k"
  }'

# 2. Créer miniature
curl -X POST http://localhost:3000/api/ffmpeg/thumbnail \
  -d '{"fileId": "abc-123", "timestamp": 1, "size": "640x360"}'

# 3. Extraire audio MP3
curl -X POST http://localhost:3000/api/ffmpeg/extract-audio \
  -d '{"fileId": "abc-123", "outputFormat": "mp3", "bitrate": "192k"}'
```

---

## 🛠️ Codecs Recommandés

### Vidéo

| Codec | Usage | Commande | Qualité | Taille |
|-------|-------|----------|---------|--------|
| **libx264** | Web, compatible | `"videoCodec": "libx264"` | Excellente | Moyenne |
| **libx265** | Haute compression | `"videoCodec": "libx265"` | Très bonne | Petite |
| **libvpx-vp9** | WebM | `"videoCodec": "libvpx-vp9"` | Bonne | Petite |
| **copy** | Sans ré-encodage | `"videoCodec": "copy"` | Originale | Originale |

### Audio

| Codec | Usage | Commande | Qualité | Taille |
|-------|-------|----------|---------|--------|
| **aac** | Web, compatible | `"audioCodec": "aac"` | Excellente | Moyenne |
| **libmp3lame** | MP3 universel | `"audioCodec": "libmp3lame"` | Bonne | Petite |
| **libopus** | Haute qualité | `"audioCodec": "libopus"` | Excellente | Très petite |
| **copy** | Sans ré-encodage | `"audioCodec": "copy"` | Originale | Originale |

---

## ⚠️ Limites et Recommandations

### Limites

1. **Taille maximale** : 500 MB par défaut
   - Modifiable dans `.env` : `MAX_FILE_SIZE=1000000000`

2. **Timeout** : 10 minutes par conversion synchrone
   - Utilisez `/convert/async` pour gros fichiers

3. **Mémoire** : Dépend du fichier
   - Augmenter RAM Docker si nécessaire

### Recommandations

- **< 100 MB** : `/convert` (synchrone)
- **> 100 MB** : `/convert/async` (queue)
- **Trim rapide** : Utilisez `"videoCodec": "copy"`
- **Qualité max** : H.264 CRF 18, bitrate 5M+
- **Web optimisé** : H.264 CRF 23, bitrate 1-2M

---

## 🔧 Dépannage

### Erreur "FFmpeg not found"

```bash
# Vérifier dans le container
docker exec mediabunny-app which ffmpeg

# Devrait retourner: /usr/bin/ffmpeg
```

### Redis non accessible

```bash
# Vérifier Redis
docker logs mediabunny-redis

# Tester connexion
docker exec mediabunny-redis redis-cli ping
# Devrait retourner: PONG
```

### Conversion échoue

```bash
# Logs du serveur
docker logs mediabunny-app -f

# Vérifier le fichier d'entrée
curl http://localhost:3000/api/ffmpeg/metadata/abc-123
```

---

## 📚 Références

- **FFmpeg Documentation** : https://ffmpeg.org/documentation.html
- **fluent-ffmpeg** : https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
- **Bull Queue** : https://github.com/OptimalBits/bull

---

## ✅ Récapitulatif

**Avant (MediaBunny)** :
- ❌ Erreur `undecodable_source_codec`
- ❌ Seulement H.264/AAC
- ❌ Node.js sans WebCodecs

**Maintenant (FFmpeg)** :
- ✅ **TOUS les codecs** (H.265, ProRes, etc.)
- ✅ Conversion synchrone + asynchrone
- ✅ Queue de jobs avec progression
- ✅ Trim, resize, rotate, thumbnail
- ✅ Production ready

**Votre fichier H.264+AAC fonctionnera à 100% !** 🎉
