import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { URL } from 'url';
import { DatabaseConnection } from '../services/database';
import { AuthRequest } from '../middleware/auth';

export const createAnalyticsRoutes = (db: DatabaseConnection): Router => {
  const router = Router();

  // Get usage analytics
  router.get('/usage', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      console.log('📈 Usage analytics requested for user:', req.userId);

      const timeRange = (req.query.range as string) || '7d';
      const userObjectId = new ObjectId(req.userId);

      // Parse time range
      const daysMap: { [key: string]: number } = {
        '24h': 1,
        '7d': 7,
        '30d': 30
      };
      const days = daysMap[timeRange] || 7;

      // Get real analytics from database
      const stats = await db.getUsageStatsForPeriod(userObjectId, days);

      const failedRequests = stats.totalRequests - stats.successfulRequests;

      // Get recent logs to extract top domains
      const recentLogs = await db.getUsageLogsForUser(userObjectId, 100);
      const domainCounts: { [key: string]: number } = {};

      recentLogs.forEach(log => {
        if (log.urlScraped) {
          try {
            const parsedUrl = new URL(log.urlScraped);
            const domain = parsedUrl.hostname;
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
          } catch (error) {
            // Ignore invalid URLs
          }
        }
      });

      // Get top 5 domains
      const topDomains = Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([domain]) => domain);

      const analytics = {
        totalRequests: stats.totalRequests,
        successfulRequests: stats.successfulRequests,
        failedRequests,
        avgResponseTime: Math.round(stats.avgResponseTime),
        dataProcessed: `${stats.totalRequests * 50} KB`,
        topDomains
      };

      res.status(200).json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get analytics' 
      });
    }
  });

  // Get scraping history
  router.get('/history', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      console.log('📝 Scraping history requested for user:', req.userId);

      // For now, return empty history
      const history = {
        history: [],
        total: 0
      };

      res.status(200).json(history);
    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get history' 
      });
    }
  });

  return router;
};
