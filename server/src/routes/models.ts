import express from 'express';
import { getAllModels, createDeviceModel, deleteDeviceModel } from '../controllers/modelController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { wrapAsync } from '../utils/wrapAsync';
import { upload } from '../utils/upload';

const router = express.Router();

router.get('/', wrapAsync(authenticate), wrapAsync(requireAdmin), wrapAsync(getAllModels));

// ✅ CRITICAL FIX: Upload middleware must be FIRST
router.post('/', 
  upload.single('imageUrl'), // This parses multipart data and populates req.body
  (req, res, next) => {
    // Debug middleware to see what's happening
    console.log('After multer - req.body:', req.body);
    console.log('After multer - req.file:', req.file);
    next();
  },
  wrapAsync(authenticate), 
  wrapAsync(requireAdmin), 
  wrapAsync(createDeviceModel)
);

router.delete('/:id', wrapAsync(authenticate), wrapAsync(requireAdmin), wrapAsync(deleteDeviceModel));

export default router;