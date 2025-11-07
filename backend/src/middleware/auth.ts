import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';

export interface AuthRequest extends Request {
  userId?: string;
  apiKeyId?: string;
}

export const authMiddleware = (authService: AuthService) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.substring(7);
      const userId = await authService.verifyToken(token);
      
      req.userId = userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

export const apiKeyMiddleware = (authService: AuthService) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🔍 API Key middleware called');
      
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        console.log('❌ No API Key found in headers');
        res.status(401).json({ error: 'API key required' });
        return;
      }

      console.log('🔑 API Key found:', apiKey.substring(0, 8) + '...');
      
      const { userId, apiKeyId } = await authService.verifyApiKey(apiKey);
      
      console.log('✅ API Key verified for user:', userId.toString());
      
      req.userId = userId.toString();
      req.apiKeyId = apiKeyId.toString();
      
      next();
    } catch (error) {
      console.log('❌ API Key verification failed:', error);
      res.status(401).json({ error: 'Invalid API key' });
    }
  };
};
