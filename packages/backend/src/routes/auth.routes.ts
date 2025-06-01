import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login.bind(authController)
);

router.get(
  '/me',
  authenticate,
  authController.getCurrentUser.bind(authController)
);

export default router; 