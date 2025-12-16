import { readdirSync, statSync } from 'fs';
import path from 'path';
import { Input, ALL_FORMATS, FilePathSource } from 'mediabunny';
import { deleteFile } from '../utils/filesystem.js';

export class MediaService {
  async getFileMetadata(filePath: string) {
    // FilePathSource gère lui-même l'ouverture/fermeture des fichiers
    const input = new Input({
      source: new FilePathSource(filePath),
      formats: ALL_FORMATS
    });

    try {
      const duration = await input.computeDuration();
      const videoTrack = await input.getPrimaryVideoTrack();
      const audioTrack = await input.getPrimaryAudioTrack();
      const tags = await input.getMetadataTags();

      return {
        duration,
        video: videoTrack ? {
          codec: videoTrack.codec,
          width: videoTrack.displayWidth,
          height: videoTrack.displayHeight,
          rotation: videoTrack.rotation
        } : null,
        audio: audioTrack ? {
          codec: audioTrack.codec,
          sampleRate: audioTrack.sampleRate,
          channels: audioTrack.numberOfChannels
        } : null,
        tags
      };
    } catch (error: any) {
      console.error('Error reading metadata:', error);
      throw new Error(`Failed to read file metadata: ${error.message}`);
    }
  }

  findFileById(directory: string, fileId: string): string[] {
    const files = readdirSync(directory);
    const matchedFiles = files.filter(file => file.startsWith(fileId));
    return matchedFiles.map(file => path.join(directory, file));
  }

  deleteFileById(fileId: string) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const outputDir = process.env.OUTPUT_DIR || './output';
    
    const uploadFiles = this.findFileById(uploadDir, fileId);
    const outputFiles = this.findFileById(outputDir, fileId);
    
    for (const file of [...uploadFiles, ...outputFiles]) {
      deleteFile(file);
    }
  }

  listAllFiles() {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const files = readdirSync(uploadDir);
    
    const fileInfos = files.map((filename) => {
        const filePath = path.join(uploadDir, filename);
        const stats = statSync(filePath);
        
        return {
          id: path.parse(filename).name,
          filename,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });
    
    return fileInfos.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
  }
}
