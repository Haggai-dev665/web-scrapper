import { Router } from 'express';
import { AuthService } from '../services/auth';
import { DatabaseConnection } from '../services/database';
import { AuthRequest } from '../middleware/auth';
import { CreateApiKeyRequest } from '../models';

export const createApiKeyRoutes = (
  authService: AuthService,
  _db: DatabaseConnection
): Router => {
  const router = Router();

  // Create API key
  router.post('/', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const request: CreateApiKeyRequest = {
        name: req.body.name,
        description: req.body.description,
        rateLimitPerHour: req.body.rate_limit_per_hour || req.body.rateLimitPerHour
      };

      const response = await authService.createApiKey(req.userId, request);
      res.status(201).json(response);
    } catch (error) {
      console.error('Create API key error:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create API key' 
      });
    }
  });

  // List API keys
  router.get('/', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      console.log('📋 Listing API keys for user:', req.userId);
      const keys = await authService.listApiKeys(req.userId);
      console.log('✅ Found', keys.length, 'API keys');
      
      res.status(200).json(keys);
    } catch (error) {
      console.error('List API keys error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to list API keys' 
      });
    }
  });

  // Get API key usage statistics
  router.get('/:id/usage', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const usage = await authService.getApiKeyUsage(req.userId, req.params.id);
      res.status(200).json(usage);
    } catch (error) {
      console.error('Get API key usage error:', error);
      res.status(404).json({ 
        error: error instanceof Error ? error.message : 'Failed to get API key usage' 
      });
    }
  });

  // Delete API key
  router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await authService.deleteApiKey(req.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete API key error:', error);
      res.status(404).json({ 
        error: error instanceof Error ? error.message : 'Failed to delete API key' 
      });
    }
  });

  return router;
};
