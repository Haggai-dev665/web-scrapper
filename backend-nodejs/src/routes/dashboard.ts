import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { DatabaseConnection } from '../services/database';
import { AuthRequest } from '../middleware/auth';
import { DashboardStats, RecentActivity } from '../models';

export const createDashboardRoutes = (db: DatabaseConnection): Router => {
  const router = Router();

  // Get dashboard stats
  router.get('/stats', async (req: AuthRequest, res): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const userObjectId = new ObjectId(req.userId);

      // Fetch real data from database
      const activeKeys = await db.countActiveApiKeys(userObjectId);
      const recentLogs = await db.getUsageLogsForUser(userObjectId, 10);

      // Get stats for different time periods
      const statsToday = await db.getUsageStatsForPeriod(userObjectId, 1);
      const statsMonth = await db.getUsageStatsForPeriod(userObjectId, 30);

      // Convert recent logs to activity format
      const recentActivity: RecentActivity[] = recentLogs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        endpoint: log.endpoint,
        urlScraped: log.urlScraped,
        success: log.success,
        responseTimeMs: log.responseTimeMs
      }));

      const stats: DashboardStats = {
        totalRequestsToday: statsToday.totalRequests,
        totalRequestsThisMonth: statsMonth.totalRequests,
        requestsRemaining: 10000 - statsMonth.totalRequests,
        activeApiKeys: activeKeys,
        avgResponseTimeMs: statsMonth.avgResponseTime,
        successRate: statsMonth.successRate,
        recentActivity,
        usageByDay: []
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get dashboard stats' 
      });
    }
  });

  return router;
};
