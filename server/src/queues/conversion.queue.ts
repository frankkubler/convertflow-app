import Queue from 'bull';
import { FFmpegService } from '../services/ffmpeg.service.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readdirSync } from 'fs';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const conversionQueue = new Queue('conversion', REDIS_URL, {
  settings: {
    lockDuration: 300000, // 5 minutes - évite "job stalled" pour les longues conversions
    stalledInterval: 60000, // Vérifier les jobs bloqués toutes les 60s
    maxStalledCount: 2 // Nombre de tentatives avant de marquer comme échoué
  }
});

console.log('✓ Bull Queue worker started for conversion jobs');

// Traiter 3 jobs en parallèle pour permettre plusieurs conversions simultanées
conversionQueue.process('convert', 3, async (job) => {
  console.log(`[Queue] Processing job ${job.id}...`);
  const ffmpegService = new FFmpegService();
  const { fileId, outputFormat, videoCodec, audioCodec, videoBitrate, audioBitrate } = job.data;

  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const outputDir = process.env.OUTPUT_DIR || './output';

  // Trouver le fichier (utiliser readdirSync pour éviter warnings FileHandle)
  const files = readdirSync(uploadDir);
  const matchedFiles = files.filter(file => file.startsWith(fileId));
  
  if (!matchedFiles.length) {
    throw new Error('Fichier non trouvé');
  }

  const inputPath = path.join(uploadDir, matchedFiles[0]);
  const outputId = uuidv4();
  const outputPath = path.join(outputDir, `${outputId}.${outputFormat}`);

  // Conversion avec suivi de progression
  await ffmpegService.convert(
    inputPath,
    outputPath,
    {
      outputFormat,
      videoCodec,
      audioCodec,
      videoBitrate,
      audioBitrate
    },
    (percent) => {
      job.progress(percent);
    }
  );

  return {
    outputId,
    outputPath: `/output/${path.basename(outputPath)}`,
    filename: path.basename(outputPath)
  };
});

// Gestion des événements
conversionQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} terminé:`, result);
});

conversionQueue.on('failed', (job, err) => {
  console.error(`Job ${job?.id} échoué:`, err.message);
});
