# Heroku Deployment Setup

## Step 1: Add Puppeteer Buildpack

Heroku needs a special buildpack to install Chrome for Puppeteer. Run these commands:

```bash
# Add the Puppeteer buildpack (this installs Chrome)
heroku buildpacks:add jontewks/puppeteer

# Make sure Node.js buildpack is also added (should be first)
heroku buildpacks:add heroku/nodejs --index 1

# Verify buildpacks are configured
heroku buildpacks
```

You should see output like:
```
=== webscrap Buildpack URLs
1. heroku/nodejs
2. jontewks/puppeteer
```

## Step 2: Set Environment Variables

```bash
# Set the Chrome executable path for Puppeteer
heroku config:set PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome-stable

# Set your MongoDB URI (if not already set)
heroku config:set MONGODB_URI="your_mongodb_uri_here"

# Set a secure JWT secret (if not already set)
heroku config:set JWT_SECRET="your-secure-random-jwt-secret-here"

# Set Node environment
heroku config:set NODE_ENV=production

# Verify config
heroku config
```

## Step 3: Commit and Deploy

```bash
# Make sure all changes are committed
git add .
git commit -m "Configure Puppeteer for Heroku"

# Deploy to Heroku
git push heroku main

# Or if using GitHub integration, just push to GitHub
git push origin main
```

## Step 4: Monitor Logs

```bash
# Watch the deployment logs
heroku logs --tail

# You should see:
# ✅ Database initialized
# ✅ Auth service initialized
# ✅ Scraper service created
# 📦 Using Chrome at: /app/.apt/usr/bin/google-chrome-stable
# ✅ Puppeteer browser launched
```

## Troubleshooting

### If Chrome is still not found:

1. **Check buildpacks are in correct order:**
   ```bash
   heroku buildpacks
   ```
   Should show Node.js first, then puppeteer.

2. **Try alternative buildpack:**
   ```bash
   heroku buildpacks:clear
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-google-chrome
   ```

3. **Set alternative Chrome path:**
   ```bash
   heroku config:set CHROME_BIN=/app/.apt/usr/bin/google-chrome
   ```

### If server crashes on startup:

The app is now configured to start even if Puppeteer fails to initialize. Check logs:
```bash
heroku logs --tail
```

Look for:
- ✅ Success messages
- ⚠️  Warning messages (non-fatal)
- ❌ Error messages (fatal)

### Test the deployment:

```bash
# Test health endpoint
curl https://webscrapper.live/api/health

# Test scraping (requires API key)
curl -X POST https://webscrapper.live/api/scrape \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"url": "https://example.com"}'
```

## Alternative: Use Heroku Chrome Buildpack

If `jontewks/puppeteer` doesn't work, try the official Google Chrome buildpack:

```bash
heroku buildpacks:clear
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-google-chrome
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-chromedriver

heroku config:set PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome-stable
```

## Important Notes

- The server will now start successfully even if Chrome isn't available
- Scraping requests will fail with a helpful error message if Chrome isn't installed
- Always check `heroku logs --tail` to verify Chrome is found during startup
- Chrome installation adds ~200MB to your slug size
