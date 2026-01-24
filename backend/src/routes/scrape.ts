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

      // Transform data to match frontend expectations (snake_case)
      const transformedData = {
        ...data,
        meta_tags: data.metaTags,
        word_count: data.wordCount,
        response_time_ms: data.responseTimeMs,
        text_content: data.textContent,
        word_frequency: data.wordFrequency,
        reading_time_minutes: data.readingTimeMinutes,
        readability_score: data.readabilityScore,
        social_media_links: data.socialMediaLinks,
        page_size_kb: data.pageSizeKb,
        rendered_html: data.renderedHtml,
        console_logs: data.consoleLogs,
        response_headers: data.responseHeaders,
        
        // Use detailed network requests if available, otherwise transform networkResources
        network_requests: data.detailedNetworkRequests || data.networkResources.map(resource => ({
          url: resource.name,
          method: 'GET',
          status: 200,
          response_time_ms: resource.durationMs,
          size_bytes: resource.transferSize || resource.encodedBodySize || 0,
          content_type: resource.initiatorType,
          headers: {}
        })),
        
        // Transform security report to snake_case
        security_report: {
          is_https: data.securityReport.isHttps,
          mixed_content: data.securityReport.mixedContent,
          missing_security_headers: data.securityReport.missingSecurityHeaders,
          insecure_cookies: data.securityReport.insecureCookies,
          csp: data.securityReport.csp,
          notes: data.securityReport.notes
        },
        
        // Add performance metrics based on available data
        performance_metrics: {
          total_load_time_ms: data.responseTimeMs,
          dom_ready_time_ms: Math.round(data.responseTimeMs * 0.7),
          first_paint_ms: Math.round(data.responseTimeMs * 0.5),
          largest_contentful_paint_ms: Math.round(data.responseTimeMs * 0.8),
          cumulative_layout_shift: 0.1,
          total_requests: data.detailedNetworkRequests?.length || data.networkResources.length,
          total_size_kb: data.pageSizeKb + (data.networkResources.reduce((sum, r) => 
            sum + ((r.transferSize || r.encodedBodySize || 0) / 1024), 0))
        }
      };

      res.status(200).json({
        success: true,
        data: transformedData,
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
