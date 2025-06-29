import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          error: 'All fields are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters' 
        });
      }

      const result = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        message: 'User registered successfully',
        ...result,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        error: error.message || 'Registration failed' 
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const result = await AuthService.login({ email, password });

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({ 
        error: error.message || 'Login failed' 
      });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await AuthService.getProfile(userId);

      res.json({
        message: 'Profile retrieved successfully',
        user: profile,
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(404).json({ 
        error: error.message || 'Profile not found' 
      });
    }
  }
}