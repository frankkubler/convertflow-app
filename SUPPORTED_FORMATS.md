# Formats Supportés - ConvertFlow

## 🎬 Formats Vidéo

| Extension | Format FFmpeg | Codec Vidéo par défaut | Codec Audio par défaut | Notes |
|-----------|---------------|------------------------|------------------------|-------|
| `.mp4` | mp4 | libx264 (H.264) | aac | Format universel recommandé |
| `.webm` | webm | libvpx-vp9 (VP9) | libopus | Optimisé pour le web |
| `.mkv` | matroska | libx264 (H.264) | aac | Format conteneur universel |
| `.avi` | avi | libx264 (H.264) | aac | Format ancien mais compatible |
| `.mov` | mov | libx264 (H.264) | aac | Format QuickTime (Apple) |
| `.flv` | flv | flv1 | aac | Format Flash Video |
| `.wmv` | asf | wmv2 | aac | Windows Media Video |
| `.m4v` | mp4 | libx264 (H.264) | aac | Variant iTunes de MP4 |

### Variantes avec codec spécifique

| Nom de fichier | Codec utilisé | Description |
|----------------|---------------|-------------|
| `video.av1.mp4` | libaom-av1 | AV1 dans conteneur MP4 (nouvelle génération) |
| `video.h264.mp4` | libx264 | H.264 explicite dans MP4 |
| `video.h265.mp4` | libx265 | H.265/HEVC dans MP4 (haute compression) |
| `video.h266.mp4` | libx266 | H.266/VVC dans MP4 (expérimental) |

## 🎵 Formats Audio

| Extension | Format FFmpeg | Codec par défaut | Notes |
|-----------|---------------|------------------|-------|
| `.mp3` | mp3 | libmp3lame | Standard universel |
| `.aac` | adts | aac | Haute qualité, bon compromis |
| `.opus` | opus | libopus | Meilleure compression |
| `.wav` | wav | pcm_s16le | Sans perte, non compressé |
| `.flac` | flac | flac | Sans perte, compressé |
| `.ogg` | ogg | libvorbis | Open source |
| `.m4a` | ipod | aac | AAC dans conteneur MP4 |

## 🖼️ Formats Image/Animation

| Extension | Format FFmpeg | Notes |
|-----------|---------------|-------|
| `.gif` | gif | GIF animé classique |
| `.apng` | apng | PNG animé (meilleure qualité que GIF) |
| `.webp` | webp | Format moderne Google |
| `.ico` | ico | Icône Windows (auto-resize à 256x256) |

## 🎯 Paramètres de Qualité

### Haute Qualité
- **Vidéo** : 5 Mbps
- **Audio** : 256 kbps (vidéo) / 320 kbps (audio seul)

### Moyenne Qualité (Recommandé)
- **Vidéo** : 2 Mbps
- **Audio** : 192 kbps

### Basse Qualité (Fichier compact)
- **Vidéo** : 1 Mbps
- **Audio** : 128 kbps

## ⚙️ Codecs Supportés

### Vidéo
- **libx264** : H.264/AVC (universel, excellent support)
- **libx265** : H.265/HEVC (meilleure compression, plus lent)
- **libx266** : H.266/VVC (expérimental, meilleure compression)
- **libaom-av1** : AV1 (nouvelle génération, royalty-free)
- **libvpx-vp9** : VP9 (web, royalty-free)
- **libvpx** : VP8 (ancien, web)
- **flv1** : Flash Video
- **wmv2** : Windows Media Video

### Audio
- **aac** : AAC (Advanced Audio Coding)
- **libmp3lame** : MP3 (MPEG Audio Layer 3)
- **libopus** : Opus (meilleure compression)
- **libvorbis** : Vorbis (open source)
- **flac** : FLAC (sans perte)
- **pcm_s16le** : PCM 16-bit (WAV)

## 🚀 Optimisations

### VP9 (WebM)
Options automatiques appliquées :
- `-speed 2` : Équilibre vitesse/qualité
- `-tile-columns 2` : Parallélisation
- `-threads 4` : Multi-threading
- `-row-mt 1` : Multi-threading par rangée

### ICO (Icônes)
- Auto-redimensionnement à 256x256 maximum
- Préserve le ratio d'aspect

## 🔧 Variables d'Environnement

- `FFMPEG_ARGS` : Arguments FFmpeg ajoutés avant `-i` (input)
- `FFMPEG_OUTPUT_ARGS` : Arguments FFmpeg ajoutés avant le fichier de sortie

Exemple :
```bash
FFMPEG_ARGS="-hwaccel cuda"
FFMPEG_OUTPUT_ARGS="-movflags +faststart"
```

## 📋 Compatibilité

Basé sur **FFmpeg 8.0.1** avec support des codecs modernes.

Testé et vérifié pour tous les formats listés ci-dessus.
