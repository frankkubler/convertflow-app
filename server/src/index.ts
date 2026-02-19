import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync, accessSync } from 'fs';

// Routes
import mediaRoutes from './routes/media.routes.js';
import ffmpegRoutes from './routes/ffmpeg.routes.js';

// Queue workers (important : doit être importé pour que le worker démarre)
import './queues/conversion.queue.js';

// Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: false,  // Désactive upgrade-insecure-requests (incompatible HTTP pur)
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      connectSrc: [
        "'self'",
        'http:',    // autorise toutes les connexions HTTP (proxy, LXC, etc.)
        'https:',
        'ws:',
        'wss:',
      ],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      // upgradeInsecureRequests volontairement absent : app en HTTP pur
    }
  }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(compression());
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ extended: true, limit: '10gb' }));

// Créer les répertoires nécessaires
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
const outputDir = process.env.OUTPUT_DIR || path.join(__dirname, '../output');

// Utiliser mkdirSync pour éviter les warnings de FileHandle
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('✓ Directories created');

// Routes API
app.use('/api/media', mediaRoutes);
app.use('/api/ffmpeg', ffmpegRoutes);

// Servir les fichiers de sortie
app.use('/output', express.static(outputDir));

// Servir le client (production)
const clientPath = path.join(__dirname, '../../client/dist');
try {
  accessSync(clientPath);
  app.use(express.static(clientPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
  console.log('✓ Client app served from:', clientPath);
} catch {
  console.log('⚠️  Client dist not found. Run: cd client && npm run build');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    ffmpeg: 'enabled',
    redis: process.env.REDIS_URL || 'localhost:6379'
  });
});

// Error handler global (doit être APRÈS toutes les routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server] Unhandled error:', err.message, err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`📂 Output directory: ${outputDir}`);
  console.log(`🔴 Redis: ${process.env.REDIS_URL || 'redis://localhost:6379'}`);
  console.log(`🎥 FFmpeg: Enabled`);
});
