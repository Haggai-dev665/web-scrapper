import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { ScraperService } from '../services/scraper';
import { DatabaseConnection } from '../services/database';
import { AuthRequest } from '../middleware/auth';
import { UsageLog } from '../models';

export const createScrapeRoutes = (
  scraperService: ScraperService,
  db: DatabaseConnection
): Router => {
  const router = Router();

  router.post('/', async (req: AuthRequest, res): Promise<void> => {
    const startTime = Date.now();
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'URL is required'
      });
      return;
    }

    try {
      const data = await scraperService.scrapeUrl(url);
      const responseTime = Date.now() - startTime;

      // Save usage log
      if (req.userId && req.apiKeyId) {
        const usageLog: UsageLog = {
          userId: new ObjectId(req.userId),
          apiKeyId: new ObjectId(req.apiKeyId),
          endpoint: '/api/scrape',
          urlScraped: url,
          timestamp: new Date(),
          responseTimeMs: responseTime,
          success: true,
          dataSizeBytes: JSON.stringify(data).length
        };

        try {
          await db.saveUsageLog(usageLog);
        } catch (logError) {
          console.error('Failed to save usage log:', logError);
        }
      }

      res.status(200).json({
        success: true,
        data,
        error: null
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Save failed attempt
      if (req.userId && req.apiKeyId) {
        const usageLog: UsageLog = {
          userId: new ObjectId(req.userId),
          apiKeyId: new ObjectId(req.apiKeyId),
          endpoint: '/api/scrape',
          urlScraped: url,
          timestamp: new Date(),
          responseTimeMs: responseTime,
          success: false,
          errorMessage,
          dataSizeBytes: 0
        };

        try {
          await db.saveUsageLog(usageLog);
        } catch (logError) {
          console.error('Failed to save usage log:', logError);
        }
      }

      console.error('Scraping error:', error);
      res.status(500).json({
        success: false,
        data: null,
        error: errorMessage
      });
    }
  });

  return router;
};
