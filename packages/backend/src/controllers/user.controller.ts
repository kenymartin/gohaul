import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import { generateToken } from '../utils/auth';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema, loginSchema } from '../validations/user.validation';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    const userData: CreateUserDTO = req.body;
    const user = await userService.createUser(userData);
    const token = generateToken(user);
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    const token = generateToken(user);
    
    res.json({
      user,
      token
    });
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userService.getUserById(userId);
    res.json(user);
  }

  async updateProfile(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData: UpdateUserDTO = req.body;
    const user = await userService.updateUser(userId, userData);
    res.json(user);
  }

  async deleteProfile(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await userService.deleteUser(userId);
    res.status(204).send();
  }
} 