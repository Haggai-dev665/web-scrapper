# Deployment Guide for Web Scraper

## Heroku Deployment

### Prerequisites
1. Heroku CLI installed
2. Heroku account
3. MongoDB Atlas account (for production database)

### Step 1: Prepare the Application

1. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cp backend/.env.example backend/.env
   # Edit .env with your production values
   ```

2. **Update CORS settings** in `backend/src/index.ts`
   - The allowed origins already include production URL
   - Add your custom domain if needed

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs

# Add Puppeteer buildpack (for web scraping)
heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
```

### Step 3: Configure Environment Variables

```bash
# MongoDB connection (use MongoDB Atlas)
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/webscraper?retryWrites=true&w=majority"

# JWT Secret (generate a strong random key)
heroku config:set JWT_SECRET="$(openssl rand -base64 32)"

# Node Environment
heroku config:set NODE_ENV=production

# Puppeteer Configuration
heroku config:set PUPPETEER_SKIP_DOWNLOAD=true
heroku config:set PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

# Port (set automatically by Heroku)
# No need to set PORT manually - Heroku will set it
```

### Step 4: Deploy

```bash
# Add remote if not already added
heroku git:remote -a your-app-name

# Push to Heroku
git push heroku main

# Or if on a different branch
git push heroku your-branch:main

# Check logs
heroku logs --tail
```

### Step 5: Verify Deployment

The application serves the frontend from the backend, so everything runs on one dyno:

```bash
# Open your app
heroku open

# Check app status
heroku ps

# View logs
heroku logs --tail
```

### Step 6: Domain Configuration (Optional)

1. **Add custom domain to Heroku**
   ```bash
   heroku domains:add webscraper.com
   heroku domains:add www.webscraper.com
   ```

2. **Configure DNS**
   - Add DNS records as shown by Heroku
   - SSL certificates are automatic with Heroku

## MongoDB Atlas Setup

1. **Create a cluster**
   - Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M0 free tier is fine for development)

2. **Create a database user**
   - Security → Database Access
   - Add new database user with strong password
   - Grant read/write permissions

3. **Whitelist IP addresses**
   - Security → Network Access  
   - Add IP address: 0.0.0.0/0 (allows connections from anywhere, including Heroku)
   - Or add specific Heroku IP ranges for better security

4. **Get connection string**
   - Databases → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/webscraper?retryWrites=true&w=majority`

## Production Checklist

- [ ] MongoDB Atlas configured and accessible
- [ ] Environment variables set in Heroku (MONGODB_URI, JWT_SECRET)
- [ ] CORS configured for production domain
- [ ] JWT secret is secure and random (use `openssl rand -base64 32`)
- [ ] Puppeteer buildpack added for web scraping
- [ ] Frontend built and included in deployment
- [ ] DNS records configured (if using custom domain)
- [ ] SSL certificates configured (automatic with Heroku)
- [ ] Monitoring and logging reviewed

## Troubleshooting

### Build Fails
- Check Heroku logs: `heroku logs --tail`
- Verify PUPPETEER_SKIP_DOWNLOAD is set
- Ensure all dependencies are in package.json
- Check that TypeScript compiles without errors

### Database Connection Issues
- Verify MongoDB URI format
- Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0)
- Ensure database user has correct permissions
- Test connection string locally first

### Frontend Not Loading
- Verify frontend build completed: check logs for "frontend/dist"
- Ensure backend serves static files from correct path
- Check that index.html exists in frontend/dist
- Verify API base URL in frontend code

### CORS Errors
- Check allowed origins in backend/src/index.ts
- Ensure production domain is included
- For testing, temporarily allow all origins

### API Errors
- Check Heroku logs for backend errors
- Verify JWT_SECRET is set
- Test endpoints individually
- Check API key authentication
- Check that credentials are set to true
- Ensure headers include authorization

### API Key Issues
- Verify X-API-Key header is being sent
- Check that API key exists in database
- Ensure middleware is correctly configured

## Scaling Considerations

1. **Database**: Upgrade MongoDB Atlas tier as usage grows
2. **Heroku Dynos**: Scale up or add more dynos
   ```bash
   heroku ps:scale web=2 -a webscrapper-api
   ```
3. **Caching**: Implement Redis for caching scraped data
4. **CDN**: Use Cloudflare for frontend assets

## Monitoring

1. **Heroku Metrics**
   ```bash
   heroku metrics -a webscrapper-api
   ```

2. **Application Logs**
   ```bash
   heroku logs --tail -a webscrapper-api
   ```

3. **MongoDB Metrics**
   - Check MongoDB Atlas dashboard for query performance
   - Monitor connection pool usage

## Security Best Practices

1. Keep JWT secret secure and rotate periodically
2. Use HTTPS only in production
3. Implement rate limiting to prevent abuse
4. Regularly update dependencies
5. Monitor for security vulnerabilities
6. Use environment variables for all secrets
7. Implement proper input validation
8. Use prepared statements for database queries

## Support

For issues or questions:
- GitHub Issues: https://github.com/Haggai-dev665/web-scrapper/issues
- Email: support@webscraper.live
