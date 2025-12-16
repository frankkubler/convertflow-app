import { execFile as execFileOriginal, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const execFile = promisify(execFileOriginal);

export interface FFmpegMetadata {
  duration: number;
  format: string;
  size: number;
  bitrate: number;
  video?: {
    codec: string;
    width: number;
    height: number;
    fps: number;
    bitrate: number;
  };
  audio?: {
    codec: string;
    sampleRate: number;
    channels: number;
    bitrate: number;
  };
}

export interface ConversionOptions {
  outputFormat?: string;
  videoCodec?: string;
  audioCodec?: string;
  videoBitrate?: string;
  audioBitrate?: string;
  fps?: number;
  width?: number;
  height?: number;
  startTime?: number;
  duration?: number;
  rotation?: number;
  quality?: number;
  preset?: string;        // Preset d'encodage (ultrafast, fast, medium, slow, veryslow)
  tune?: string;          // Optimisation (film, animation, grain, etc.)
  pixelFormat?: string;   // Format de pixel (yuv420p, etc.)
  audioSampleRate?: number; // Taux d'échantillonnage audio
  audioChannels?: number;   // Nombre de canaux audio
}

export class FFmpegService {
  /**
   * Extrait les métadonnées d'un fichier vidéo/audio
   */
  async getMetadata(filePath: string): Promise<FFmpegMetadata> {
    try {
      const { stdout } = await execFile('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ]);

      const metadata = JSON.parse(stdout);
      const videoStream = metadata.streams?.find((s: any) => s.codec_type === 'video');
      const audioStream = metadata.streams?.find((s: any) => s.codec_type === 'audio');

      return {
        duration: parseFloat(metadata.format?.duration || 0),
        format: metadata.format?.format_name || '',
        size: parseInt(metadata.format?.size || 0),
        bitrate: parseInt(metadata.format?.bit_rate || 0),
        video: videoStream ? {
          codec: videoStream.codec_name || '',
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          fps: this.parseFPS(videoStream.r_frame_rate),
          bitrate: parseInt(videoStream.bit_rate || '0')
        } : undefined,
        audio: audioStream ? {
          codec: audioStream.codec_name || '',
          sampleRate: parseInt(audioStream.sample_rate || 0),
          channels: audioStream.channels || 0,
          bitrate: parseInt(audioStream.bit_rate || '0')
        } : undefined
      };
    } catch (error: any) {
      throw new Error(`Erreur lecture métadonnées: ${error.message}`);
    }
  }

  /**
   * Convertit un fichier avec FFmpeg (inspiré de ConvertX)
   */
  async convert(
    inputPath: string,
    outputPath: string,
    options: ConversionOptions = {},
    onProgress?: (percent: number) => void
  ): Promise<void> {
    const args: string[] = [];
    
    // Extraire l'extension réelle du fichier (ex: av1.mp4 -> mp4, h264.mp4 -> mp4)
    const fileExtension = path.extname(outputPath).slice(1);
    let outputFormat = options.outputFormat || fileExtension;
    
    // Si le format contient un point, c'est probablement codec.format (ex: h264.mp4)
    // On doit extraire le vrai format (mp4) et ignorer le préfixe codec
    if (outputFormat.includes('.')) {
      outputFormat = outputFormat.split('.').pop() || outputFormat;
      console.log('[FFmpegService] Format composite détecté, extraction du format réel:', outputFormat);
    }

    // Mapper les extensions vers les formats FFmpeg corrects
    const formatMapping: Record<string, string> = {
      'mkv': 'matroska',
      'mp4': 'mp4',
      'webm': 'webm',
      'avi': 'avi',
      'mov': 'mov',
      'flv': 'flv',
      'wmv': 'asf',
      'm4v': 'mp4',
      'mp3': 'mp3',
      'aac': 'adts',
      'opus': 'opus',
      'wav': 'wav',
      'flac': 'flac',
      'ogg': 'ogg',
      'm4a': 'ipod',
      'gif': 'gif',
      'apng': 'apng',
      'webp': 'webp',
      'ico': 'ico'
    };

    // Utiliser le format FFmpeg correct
    const ffmpegFormat = formatMapping[outputFormat] || outputFormat;
    console.log(`[FFmpegService] Extension: ${outputFormat} → Format FFmpeg: ${ffmpegFormat}`);

    // Parse FFMPEG_ARGS environment variable
    const ffmpegInputArgs = process.env.FFMPEG_ARGS ? process.env.FFMPEG_ARGS.split(/\s+/) : [];
    const ffmpegOutputArgs = process.env.FFMPEG_OUTPUT_ARGS ? process.env.FFMPEG_OUTPUT_ARGS.split(/\s+/) : [];

    // Arguments d'entrée
    args.push(...ffmpegInputArgs);
    args.push('-i', inputPath);

    // Détection automatique des codecs selon le format
    let videoCodec = options.videoCodec;
    let audioCodec = options.audioCodec;

    // Détection des codecs spéciaux dans le nom de fichier (av1.mp4, h264.mp4, etc.)
    const outputBasename = path.basename(outputPath, path.extname(outputPath));
    if (outputBasename.includes('.')) {
      const codecHint = outputBasename.split('.').pop(); // Prendre la dernière partie avant l'extension
      switch (codecHint) {
        case 'av1':
          videoCodec = 'libaom-av1';
          console.log('[FFmpegService] Codec AV1 détecté depuis le nom de fichier');
          break;
        case 'h264':
          videoCodec = 'libx264';
          console.log('[FFmpegService] Codec H.264 détecté depuis le nom de fichier');
          break;
        case 'h265':
          videoCodec = 'libx265';
          console.log('[FFmpegService] Codec H.265 détecté depuis le nom de fichier');
          break;
        case 'h266':
          videoCodec = 'libx266';
          console.log('[FFmpegService] Codec H.266 détecté depuis le nom de fichier');
          break;
      }
    }

    // Validation et correction des codecs selon le format de sortie
    if (outputFormat === 'webm') {
      // WebM supporte VP8, VP9, ou AV1 pour la vidéo
      if (!videoCodec || !['libvpx', 'libvpx-vp9', 'libaom-av1'].includes(videoCodec)) {
        videoCodec = 'libvpx-vp9';
        console.log('[FFmpegService] Codec vidéo corrigé pour WebM:', videoCodec);
      }
      // WebM supporte Vorbis ou Opus pour l'audio
      if (!audioCodec || !['libvorbis', 'libopus'].includes(audioCodec)) {
        audioCodec = 'libopus';
        console.log('[FFmpegService] Codec audio corrigé pour WebM:', audioCodec);
      }
    }

    // Codecs par défaut pour les formats populaires
    if (!videoCodec) {
      switch (outputFormat) {
        case 'mp4':
        case 'm4v':
          videoCodec = 'libx264';
          console.log('[FFmpegService] Codec vidéo par défaut pour MP4:', videoCodec);
          break;
        case 'mkv':
        case 'avi':
        case 'mov':
          videoCodec = 'libx264';
          console.log('[FFmpegService] Codec vidéo par défaut pour', outputFormat + ':', videoCodec);
          break;
        case 'flv':
          videoCodec = 'flv1';
          console.log('[FFmpegService] Codec vidéo par défaut pour FLV:', videoCodec);
          break;
        case 'wmv':
          videoCodec = 'wmv2';
          console.log('[FFmpegService] Codec vidéo par défaut pour WMV:', videoCodec);
          break;
      }
    }

    if (!audioCodec) {
      switch (outputFormat) {
        case 'mp4':
        case 'm4v':
        case 'm4a':
          audioCodec = 'aac';
          console.log('[FFmpegService] Codec audio par défaut pour MP4:', audioCodec);
          break;
        case 'mkv':
        case 'avi':
          audioCodec = 'aac';
          console.log('[FFmpegService] Codec audio par défaut pour', outputFormat + ':', audioCodec);
          break;
        case 'mp3':
          audioCodec = 'libmp3lame';
          console.log('[FFmpegService] Codec audio par défaut pour MP3:', audioCodec);
          break;
        case 'ogg':
          audioCodec = 'libvorbis';
          console.log('[FFmpegService] Codec audio par défaut pour OGG:', audioCodec);
          break;
        case 'opus':
          audioCodec = 'libopus';
          console.log('[FFmpegService] Codec audio par défaut pour Opus:', audioCodec);
          break;
        case 'flac':
          audioCodec = 'flac';
          console.log('[FFmpegService] Codec audio par défaut pour FLAC:', audioCodec);
          break;
        case 'wav':
          audioCodec = 'pcm_s16le';
          console.log('[FFmpegService] Codec audio par défaut pour WAV:', audioCodec);
          break;
      }
    }

    // Formats audio-seulement : désactiver la vidéo
    const audioOnlyFormats = ['mp3', 'aac', 'opus', 'wav', 'flac', 'ogg', 'm4a'];
    const isAudioOnly = audioOnlyFormats.includes(outputFormat);
    
    if (isAudioOnly) {
      args.push('-vn'); // Pas de vidéo
      console.log('[FFmpegService] Format audio seulement, vidéo désactivée');
    }

    // Codecs vidéo
    if (videoCodec && !isAudioOnly) {
      args.push('-c:v', videoCodec);
      
      // Options d'encodage optimisées pour VP9
      if (videoCodec === 'libvpx-vp9') {
        args.push(
          '-speed', '2',          // Vitesse d'encodage (0-5, 2 = équilibre)
          '-tile-columns', '2',   // Parallélisation
          '-threads', '4',        // Nombre de threads
          '-row-mt', '1'          // Multi-threading par rangée
        );
        console.log('[FFmpegService] Options VP9 rapides appliquées');
      }
    }

    // Codecs audio
    if (audioCodec) {
      args.push('-c:a', audioCodec);
    }

    // Bitrates
    if (options.videoBitrate) {
      let videoBitrate = this.normalizeBitrate(options.videoBitrate, '1000k');
      console.log('[FFmpegService] Bitrate vidéo utilisé:', videoBitrate);
      args.push('-b:v', videoBitrate);
    }

    if (options.audioBitrate) {
      let audioBitrate = this.normalizeBitrate(options.audioBitrate, '192k');
      args.push('-b:a', audioBitrate);
    }

    // Preset d'encodage (pour libx264/libx265)
    if (options.preset && (videoCodec === 'libx264' || videoCodec === 'libx265')) {
      args.push('-preset', options.preset);
    }

    // Tune (optimisation pour type de contenu)
    if (options.tune && (videoCodec === 'libx264' || videoCodec === 'libx265')) {
      args.push('-tune', options.tune);
    }

    // Format de pixel
    if (options.pixelFormat) {
      args.push('-pix_fmt', options.pixelFormat);
    }

    // Audio sample rate
    if (options.audioSampleRate) {
      args.push('-ar', options.audioSampleRate.toString());
    }

    // Audio channels
    if (options.audioChannels) {
      args.push('-ac', options.audioChannels.toString());
    }

    // FPS
    if (options.fps) {
      args.push('-r', options.fps.toString());
    }

    // Redimensionnement et rotation (utiliser -vf pour combiner les filtres)
    const filters: string[] = [];
    
    if (options.width || options.height) {
      const scaleFilter = `scale=${options.width || -1}:${options.height || -1}`;
      filters.push(scaleFilter);
    }

    if (options.rotation) {
      const transpose = this.getTransposeFilter(options.rotation);
      if (transpose) {
        filters.push(transpose);
      }
    }

    // Redimensionnement spécial pour ICO (comme ConvertX)
    if (outputFormat === 'ico') {
      filters.push("scale='min(256,iw)':'min(256,ih)':force_original_aspect_ratio=decrease");
    }

    if (filters.length > 0) {
      args.push('-vf', filters.join(','));
    }

    // Découpage (trim)
    if (options.startTime !== undefined) {
      args.push('-ss', options.startTime.toString());
    }
    if (options.duration !== undefined) {
      args.push('-t', options.duration.toString());
    }

    // Qualité (CRF pour H.264/H.265)
    if (options.quality && (videoCodec === 'libx264' || videoCodec === 'libx265')) {
      args.push('-crf', options.quality.toString());
    }

    // Format de sortie
    if (ffmpegFormat) {
      args.push('-f', ffmpegFormat);
    }

    // Arguments de sortie personnalisés
    args.push(...ffmpegOutputArgs);

    // Fichier de sortie
    args.push(outputPath);

    // Obtenir la durée de la vidéo pour calculer la progression
    const metadata = await this.getMetadata(inputPath);
    const totalDuration = metadata.duration || 0;

    // Exécution avec spawn pour capturer la progression
    return new Promise<void>((resolve, reject) => {
      console.log('[FFmpegService] Commande FFmpeg:', 'ffmpeg', args.join(' '));
      
      const ffmpegProcess = spawn('ffmpeg', args);
      
      let stderrData = '';
      
      ffmpegProcess.stderr?.on('data', (data: Buffer) => {
        const text = data.toString();
        stderrData += text;
        
        // Parser la progression depuis stderr
        // FFmpeg affiche: frame=  123 fps= 25 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1677.7kbits/s speed=1.00x
        const timeMatch = text.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (timeMatch && totalDuration > 0) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const seconds = parseFloat(timeMatch[3]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          const percent = Math.min(Math.round((currentTime / totalDuration) * 100), 100);
          
          if (percent > 0) {
            console.log(`[FFmpegService] Progression: ${percent}%`);
            if (onProgress) {
              onProgress(percent);
            }
          }
        }
      });
      
      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          console.log('[FFmpegService] Conversion réussie');
          if (onProgress) onProgress(100);
          resolve();
        } else {
          console.error('[FFmpegService] Erreur FFmpeg (code', code, '):', stderrData);
          reject(new Error(`Erreur FFmpeg (code ${code}): ${stderrData}`));
        }
      });
      
      ffmpegProcess.on('error', (error) => {
        console.error('[FFmpegService] Erreur spawn:', error);
        reject(error);
      });
    });
  }

  /**
   * Normalise un bitrate (corrige les formats invalides)
   */
  private normalizeBitrate(bitrate: string, fallback: string): string {
    let normalized = bitrate.trim();
    // Corrige les cas comme '2Mk' => '2M', '2000kk' => '2000k'
    normalized = normalized.replace(/([0-9]+)Mk$/i, '$1M');
    normalized = normalized.replace(/([0-9]+)kk$/i, '$1k');
    normalized = normalized.replace(/([0-9]+)[mM]$/i, '$1M');
    normalized = normalized.replace(/([0-9]+)[kK]$/i, '$1k');
    // Si la valeur n'est pas au format attendu, fallback
    if (!/^([0-9]+)(k|M)$/i.test(normalized)) {
      return fallback;
    }
    return normalized;
  }

  /**
   * Extrait l'audio d'une vidéo
   */
  async extractAudio(
    inputPath: string,
    outputPath: string,
    options: { codec?: string; bitrate?: string } = {}
  ): Promise<void> {
    return this.convert(inputPath, outputPath, {
      audioCodec: options.codec || 'libmp3lame',
      audioBitrate: options.bitrate || '192k',
      outputFormat: path.extname(outputPath).slice(1)
    });
  }

  /**
   * Redimensionne une vidéo
   */
  async resize(
    inputPath: string,
    outputPath: string,
    width?: number,
    height?: number,
    maintainAspectRatio: boolean = true
  ): Promise<void> {
    return this.convert(inputPath, outputPath, {
      width: maintainAspectRatio && height ? undefined : width,
      height,
      videoCodec: 'libx264',
      audioCodec: 'aac'
    });
  }

  /**
   * Découpe une vidéo
   */
  async trim(
    inputPath: string,
    outputPath: string,
    startTime: number,
    endTime: number
  ): Promise<void> {
    return this.convert(inputPath, outputPath, {
      startTime,
      duration: endTime - startTime,
      videoCodec: 'copy',
      audioCodec: 'copy'
    });
  }

  /**
   * Fait pivoter une vidéo
   */
  async rotate(
    inputPath: string,
    outputPath: string,
    degrees: number
  ): Promise<void> {
    return this.convert(inputPath, outputPath, {
      rotation: degrees,
      videoCodec: 'libx264',
      audioCodec: 'aac'
    });
  }

  /**
   * Crée une miniature
   */
  async createThumbnail(
    inputPath: string,
    outputPath: string,
    timestamp: number = 1,
    size: string = '320x240'
  ): Promise<void> {
    const [width, height] = size.split('x').map(Number);
    
    try {
      await execFile('ffmpeg', [
        '-ss', timestamp.toString(),
        '-i', inputPath,
        '-vframes', '1',
        '-vf', `scale=${width}:${height}`,
        outputPath
      ]);
      console.log('[FFmpegService] Miniature créée');
    } catch (error: any) {
      throw new Error(`Erreur miniature: ${error.message}`);
    }
  }

  /**
   * Concatène plusieurs vidéos
   */
  async concatenate(
    inputPaths: string[],
    outputPath: string
  ): Promise<void> {
    // Créer un fichier temporaire avec la liste des vidéos
    const tmpDir = os.tmpdir();
    const listFile = path.join(tmpDir, `concat-${uuidv4()}.txt`);
    
    try {
      const fileContent = inputPaths.map(p => `file '${p}'`).join('\n');
      // Utiliser writeFileSync pour éviter les warnings de FileHandle
      writeFileSync(listFile, fileContent);

      await execFile('ffmpeg', [
        '-f', 'concat',
        '-safe', '0',
        '-i', listFile,
        '-c', 'copy',
        outputPath
      ]);

      console.log('[FFmpegService] Concaténation réussie');
    } catch (error: any) {
      throw new Error(`Erreur concaténation: ${error.message}`);
    } finally {
      // Nettoyer le fichier temporaire avec unlinkSync
      try {
        unlinkSync(listFile);
      } catch {}
    }
  }

  // Helpers privés

  private parseFPS(rFrameRate?: string): number {
    if (!rFrameRate) return 0;
    const [num, den] = rFrameRate.split('/').map(Number);
    return den ? num / den : num;
  }

  private getTransposeFilter(degrees: number): string | null {
    switch (degrees) {
      case 90: return 'transpose=1';
      case 180: return 'transpose=2,transpose=2';
      case 270: return 'transpose=2';
      default: return null;
    }
  }
}
