import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();

console.log('AuthController keys:', Object.keys(AuthController));
console.log('typeof AuthController.login:', typeof AuthController.login);
router.post('/register', wrapAsync(AuthController.register));
router.post('/login', wrapAsync(AuthController.login));
router.get('/me', wrapAsync(authenticate), wrapAsync(AuthController.getProfile));

export default router;