import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema, loginSchema } from '../validations/user.validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', validateRequest(createUserSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validateRequest(updateUserSchema), userController.updateProfile);
router.delete('/profile', authenticate, userController.deleteProfile);

export default router; 