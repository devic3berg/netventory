import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { wrapAsync } from '../utils/wrapAsync';
import { createRequest, updateRequest } from '../controllers/requestController';
import { getRequests } from '../controllers/requestController';
import { getRequestById } from '../controllers/requestController';
import { upload } from '../utils/upload';

const router = express.Router();

router.post('/', wrapAsync(authenticate), upload.single('attachment'), wrapAsync(createRequest));
router.get('/', wrapAsync(authenticate), wrapAsync(getRequests));
router.get('/:id', wrapAsync(authenticate), wrapAsync(requireAdmin), wrapAsync(getRequestById));
router.put('/:id', wrapAsync(authenticate), wrapAsync(requireAdmin), wrapAsync(updateRequest));

export default router;
