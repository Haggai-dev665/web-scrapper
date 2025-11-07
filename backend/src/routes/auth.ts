import { Router } from 'express';
import { AuthService } from '../services/auth';
import { RegisterRequest, LoginRequest } from '../models';

export const createAuthRoutes = (authService: AuthService): Router => {
  const router = Router();

  // Register
  router.post('/register', async (req, res) => {
    try {
      const request: RegisterRequest = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.first_name || req.body.firstName,
        lastName: req.body.last_name || req.body.lastName
      };

      const response = await authService.register(request);
      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const request: LoginRequest = {
        email: req.body.email,
        password: req.body.password
      };

      const response = await authService.login(request);
      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  });

  return router;
};
