import { mkdirSync, unlinkSync, readdirSync, statSync } from 'fs';
import path from 'path';

export function createDirectories() {
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const outputDir = process.env.OUTPUT_DIR || './output';
  
  mkdirSync(uploadDir, { recursive: true });
  mkdirSync(outputDir, { recursive: true });
  
  console.log('✓ Directories created');
}

export function deleteFile(filePath: string) {
  try {
    unlinkSync(filePath);
    console.log(`✓ File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}

export function cleanupOldFiles(directory: string, maxAgeHours: number = 24) {
  const files = readdirSync(directory);
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = statSync(filePath);
    
    if (now - stats.mtimeMs > maxAge) {
      deleteFile(filePath);
    }
  }
}
