import express from 'express';
import { getDevices, createDevice } from '../controllers/deviceController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { wrapAsync } from '../utils/wrapAsync';

const router = express.Router();

router.get('/', wrapAsync(authenticate), wrapAsync(getDevices));
router.post('/', wrapAsync(authenticate), wrapAsync(requireAdmin), wrapAsync(createDevice));

export default router;
