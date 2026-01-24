import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { DatabaseConnection } from './services/database';
import { AuthService } from './services/auth';
import { ScraperService } from './services/scraper';
import { authMiddleware, apiKeyMiddleware } from './middleware/auth';
import { createAuthRoutes } from './routes/auth';
import { createScrapeRoutes } from './routes/scrape';
import { createApiKeyRoutes } from './routes/apiKeys';
import { createDashboardRoutes } from './routes/dashboard';
import { createAnalyticsRoutes } from './routes/analytics';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://webscrap-9f292cec4bcc.herokuapp.com',
  'https://webscrap-9f292cec4bcc.herokuapp.com',
  'https://webscrapper.live',
  'https://www.webscrapper.live',
  'http://localhost:3000',
  'https://webscrap-6f95e72052c4.herokuapp.com/'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // Allow all origins in development
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Initialize services
let db: DatabaseConnection;
let authService: AuthService;
let scraperService: ScraperService;

async function initializeServices() {
  console.log('🔧 Initializing services...');
  
  // Initialize database
  db = await DatabaseConnection.create();
  console.log('✅ Database initialized');
  
  // Initialize auth service
  authService = new AuthService(db);
  console.log('✅ Auth service initialized');
  
  // Initialize scraper service (non-blocking)
  scraperService = new ScraperService();
  // Don't await - let it initialize in background
  scraperService.initialize().catch(err => {
    console.error('⚠️  Scraper initialization failed (non-fatal):', err.message);
  });
  console.log('✅ Scraper service created');
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'web-scraper-backend',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Setup routes after initialization
async function setupRoutes() {
  // Public routes (no authentication required)
  app.use('/api/auth', createAuthRoutes(authService));

  // Protected routes (require JWT authentication)
  app.use('/api/dashboard', authMiddleware(authService), createDashboardRoutes(db));
  app.use('/api/keys', authMiddleware(authService), createApiKeyRoutes(authService, db));
  app.use('/api/analytics', authMiddleware(authService), createAnalyticsRoutes(db));

  // API routes (require API key authentication)
  app.use('/api/scrape', apiKeyMiddleware(authService), createScrapeRoutes(scraperService, db));

  // Serve frontend static files in production
  const frontendPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'public')  // In production, frontend is copied to backend/dist/public
    : path.join(__dirname, '../../frontend/dist');  // In development, use frontend/dist
  console.log('📁 Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath, { maxAge: '1d' }));

  // Serve index.html for SPA routes (frontend routes)
  app.get('*', (_req: Request, res: Response): void => {
    // Don't serve index.html for API routes
    if (_req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
      return;
    }
    
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('<h1>Frontend not built. Please run: npm run build</h1>');
      }
    });
  });
}

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
async function startServer() {
  try {
    await initializeServices();
    await setupRoutes();

    const port = process.env.PORT || 8080;
    const host = '0.0.0.0';

    app.listen(port, () => {
      console.log(`🚀 Web Scraper API running on http://${host}:${port}`);
      console.log(`📋 Health check: GET http://${host}:${port}/api/health`);
      console.log(`👤 Register: POST http://${host}:${port}/api/auth/register`);
      console.log(`🔑 Login: POST http://${host}:${port}/api/auth/login`);
      console.log(`🔍 Scrape: POST http://${host}:${port}/api/scrape (requires API key)`);
      console.log(`📊 Dashboard: GET http://${host}:${port}/api/dashboard/stats (requires JWT)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing gracefully...');
  if (scraperService) {
    await scraperService.close();
  }
  if (db) {
    await db.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing gracefully...');
  if (scraperService) {
    await scraperService.close();
  }
  if (db) {
    await db.close();
  }
  process.exit(0);
});

// Start the server
startServer();
