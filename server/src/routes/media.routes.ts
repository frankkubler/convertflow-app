import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload.js';
import { MediaController } from '../controllers/media.controller.js';

const router = express.Router();
const controller = new MediaController();

// Error handler pour multer (fichier trop grand, format invalide, requête tronquée par proxy)
const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    console.error('[Upload] Multer error:', err.code, err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: `Fichier trop grand. Limite : ${process.env.MAX_FILE_SIZE || '500MB'}` });
    }
    return res.status(400).json({ success: false, message: `Erreur upload: ${err.message}` });
  }
  if (err) {
    console.error('[Upload] Error:', err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

router.post('/upload', upload.single('file'), multerErrorHandler, controller.uploadFile);
router.get('/metadata/:fileId', controller.getMetadata);
router.delete('/:fileId', controller.deleteFile);
router.get('/list', controller.listFiles);

export default router;
