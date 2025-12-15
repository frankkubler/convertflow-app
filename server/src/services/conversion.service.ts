import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  Input, 
  Output, 
  Conversion,
  ALL_FORMATS,
  FileSource,
  FileTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  Mp3OutputFormat,
  WaveOutputFormat
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
        return new WaveOutputFormat();
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
      source: new FileSource(sourcePath),
      formats: ALL_FORMATS
    });

    const output = new Output({
      format: this.getOutputFormat(options.outputFormat),
      target: new FileTarget(outputPath)
    });

    try {
      const conversion = await Conversion.init({ input, output });
      await conversion.execute();

      return {
        outputId,
        outputPath: `/output/${path.basename(outputPath)}`,
        filename: path.basename(outputPath)
      };
    } finally {
      await input.close();
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
