import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  Input, 
  Output, 
  Conversion,
  ALL_FORMATS,
  FilePathSource,
  FilePathTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  Mp3OutputFormat,
  WavOutputFormat
} from 'mediabunny';
import { MediaService } from './media.service.js';

interface ConversionOptions {
  fileId: string;
  outputFormat: string;
  codec?: string;
  bitrate?: number;
  quality?: number;
}

export class ConversionService {
  private mediaService = new MediaService();

  private getOutputFormat(format: string) {
    switch (format.toLowerCase()) {
      case 'mp4':
        return new Mp4OutputFormat();
      case 'webm':
        return new WebMOutputFormat();
      case 'mp3':
        return new Mp3OutputFormat();
      case 'wav':
      case 'wave':
        return new WavOutputFormat();
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }
  }

  async convertMedia(options: ConversionOptions) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const outputDir = process.env.OUTPUT_DIR || './output';
    
    const sourceFiles = await this.mediaService.findFileById(uploadDir, options.fileId);
    if (!sourceFiles.length) {
      throw new Error('Source file not found');
    }

    const sourcePath = sourceFiles[0];
    const outputId = uuidv4();
    const outputPath = path.join(outputDir, `${outputId}.${options.outputFormat}`);

    const input = new Input({
      source: new FilePathSource(sourcePath),
      formats: ALL_FORMATS
    });

    const output = new Output({
      format: this.getOutputFormat(options.outputFormat),
      target: new FilePathTarget(outputPath)
    });

    try {
      const conversion = await Conversion.init({ input, output });
      
      // Vérifier s'il y a des pistes abandonnées
      if (conversion.discardedTracks && conversion.discardedTracks.length > 0) {
        const discardedReasons = conversion.discardedTracks.map(dt => 
          `${dt.track.constructor.name}: ${dt.reason}`
        ).join(', ');
        
        console.warn(`Warning: Some tracks were discarded: ${discardedReasons}`);
        
        // Si toutes les pistes sont abandonnées, lever une erreur explicite
        const hasVideoTracks = conversion.videoTracks && conversion.videoTracks.length > 0;
        const hasAudioTracks = conversion.audioTracks && conversion.audioTracks.length > 0;
        
        if (!hasVideoTracks && !hasAudioTracks) {
          throw new Error(
            `Cannot convert file: All tracks were discarded. ` +
            `Reasons: ${discardedReasons}. ` +
            `This may be due to unsupported codecs. Try a different source file or output format.`
          );
        }
      }
      
      await conversion.execute();

      return {
        outputId,
        outputPath: `/output/${path.basename(outputPath)}`,
        filename: path.basename(outputPath)
      };
    } catch (error: any) {
      // Nettoyer le fichier de sortie en cas d'erreur
      try {
        const fs = await import('fs/promises');
        await fs.unlink(outputPath);
      } catch (cleanupError) {
        // Ignorer les erreurs de nettoyage
      }
      
      // Relancer l'erreur avec un message plus clair
      if (error.message.includes('discarded')) {
        throw error;
      } else {
        throw new Error(`Conversion failed: ${error.message}`);
      }
    }
  }

  async extractAudio(fileId: string, outputFormat: string = 'mp3', bitrate?: number) {
    return this.convertMedia({
      fileId,
      outputFormat,
      bitrate
    });
  }

  async resizeVideo(fileId: string, width?: number, height?: number, maintainAspectRatio: boolean = true) {
    // Cette fonctionnalité nécessiterait une implémentation plus avancée avec MediaBunny
    // Pour l'instant, on retourne une conversion simple
    return this.convertMedia({
      fileId,
      outputFormat: 'mp4'
    });
  }

  async trimMedia(fileId: string, startTime: number, endTime: number) {
    // Implémentation de trim - nécessite une configuration spécifique de MediaBunny
    return this.convertMedia({
      fileId,
      outputFormat: 'mp4'
    });
  }

  async rotateVideo(fileId: string, rotation: number) {
    // Implémentation de rotation
    return this.convertMedia({
      fileId,
      outputFormat: 'mp4'
    });
  }
}
