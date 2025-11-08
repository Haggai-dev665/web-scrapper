# Deployment Guide for WebScraper.live

## Heroku Deployment

### Prerequisites
1. Heroku CLI installed
2. Heroku account
3. MongoDB Atlas account (for production database)

### Step 1: Prepare the Application

1. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your production values
   ```

2. **Ensure frontend is built**
   ```bash
   npm run build
   ```

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create webscrap-app

# Or use existing app
# heroku git:remote -a webscrap-9f292cec4bcc
```

### Step 3: Configure Environment Variables

```bash
# MongoDB connection (use MongoDB Atlas)
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"

# JWT Secret (generate a secure random string)
heroku config:set JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Node environment
heroku config:set NODE_ENV="production"

# Optional: Set frontend URL if different from Heroku domain
heroku config:set FRONTEND_URL="https://your-app.herokuapp.com"
```

### Step 4: Deploy

```bash
# Ensure you're on the correct branch
git checkout main

# Push to Heroku
git push heroku main

# Or if deploying from a different branch
git push heroku your-branch:main

# Check logs
heroku logs --tail
```

### Step 5: Verify Deployment

1. **Check the app is running**
   ```bash
   heroku open
   ```

2. **Test the health endpoint**
   ```bash
   curl https://your-app.herokuapp.com/api/health
   ```

3. **Check logs for errors**
   ```bash
   heroku logs --tail
   ```

## MongoDB Atlas Setup

1. **Create a cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M0 free tier is fine for development)
   - Select a cloud provider and region close to your Heroku app

2. **Create a database user**
   - Security → Database Access
   - Add new database user with password
   - Grant read/write permissions

3. **Whitelist IP addresses**
   - Security → Network Access
   - Add IP address: `0.0.0.0/0` (allow from anywhere - required for Heroku)
   - Note: This is safe when combined with strong authentication

4. **Get connection string**
   - Databases → Connect → Connect your application
   - Choose Node.js driver
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `webscraper`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/webscraper?retryWrites=true&w=majority
```

## Build Process

The application uses a combined build process:

1. **Root package.json** handles the overall build:
   ```json
   {
     "scripts": {
       "build": "cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build",
       "heroku-postbuild": "cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build",
       "start": "cd backend && npm start"
     }
   }
   ```

2. **Backend build** (TypeScript compilation):
   ```bash
   cd backend && npm run build
   ```

3. **Frontend build** (Vite production build):
   ```bash
   cd frontend && npm run build
   ```

4. **Heroku automatically runs** `heroku-postbuild` during deployment

## Application Structure

```
web-scrapper/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main server file (serves frontend)
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── middleware/       # Auth middleware
│   ├── dist/                 # Compiled TypeScript (after build)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   └── services/         # API services
│   ├── dist/                 # Built frontend (after build)
│   └── package.json
├── Procfile                  # Heroku process file
└── package.json              # Root package.json
```

## Frontend Serving

The backend serves the frontend in production:

- **Static files**: Served from `frontend/dist` with 1-day cache
- **SPA routes**: All non-API routes serve `index.html`
- **API routes**: All routes starting with `/api/` are handled by backend

## Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-characters` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Port number (set by Heroku) | `8080` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.herokuapp.com` |

## Production Checklist

- [x] MongoDB Atlas configured and accessible
- [x] Environment variables set in Heroku
- [x] CORS configured for production domain
- [x] JWT secret is secure and random (min 32 characters)
- [x] Frontend built and included in deployment
- [x] Backend serves frontend static files
- [x] SPA routing configured
- [x] API routes properly protected
- [ ] Rate limiting configured (future enhancement)
- [ ] Monitoring and logging set up (future enhancement)

## Troubleshooting

### Build Fails

**Check Heroku logs:**
```bash
heroku logs --tail
```

**Common issues:**
- Missing dependencies in package.json
- TypeScript compilation errors
- Node version incompatibility (ensure Node >= 18)

### Frontend Not Loading

**Check if frontend was built:**
```bash
heroku run ls -la frontend/dist
```

**Verify static file serving:**
- Check backend/src/index.ts serves from correct path
- Ensure dist folder is not in .gitignore
- Verify build script ran successfully

### Database Connection Issues

**Check MongoDB URI:**
- Verify connection string format
- Ensure IP whitelist includes 0.0.0.0/0
- Check database user has correct permissions
- Test connection locally first

### CORS Errors

**Verify allowed origins:**
- Check backend/src/index.ts CORS configuration
- Ensure production domain is in allowedOrigins
- Check browser console for exact origin being blocked

### API Key Issues

**Verify API key authentication:**
- Check X-API-Key header is being sent
- Verify API key exists in database
- Ensure middleware is correctly configured

## Scaling Considerations

1. **Database**: Upgrade MongoDB Atlas tier as usage grows
2. **Heroku Dynos**: Scale horizontally or vertically
   ```bash
   # Scale to 2 dynos
   heroku ps:scale web=2
   
   # Upgrade to performance dyno
   heroku ps:type performance-m
   ```
3. **Caching**: Consider adding Redis for caching
4. **CDN**: Use Cloudflare for frontend assets

## Monitoring

### Heroku Metrics
```bash
heroku metrics
```

### Application Logs
```bash
heroku logs --tail --source app
```

### MongoDB Metrics
- Check MongoDB Atlas dashboard
- Monitor connection pool usage
- Review slow queries

## Security Best Practices

1. ✅ Keep JWT secret secure and rotate periodically
2. ✅ Use HTTPS only in production
3. ✅ Implement rate limiting to prevent abuse
4. ✅ Regularly update dependencies
5. ✅ Monitor for security vulnerabilities
6. ✅ Use environment variables for all secrets
7. ✅ Implement proper input validation
8. ✅ Use parameterized queries (MongoDB does this by default)

## Continuous Deployment

### Automatic Deployment

Enable automatic deployment from GitHub:

```bash
# Connect Heroku to GitHub repository
heroku git:remote -a your-app-name

# Enable automatic deploys from main branch
# (Do this in Heroku Dashboard → Deploy → GitHub)
```

### Manual Deployment

```bash
# Deploy current branch
git push heroku main

# Deploy specific branch
git push heroku feature-branch:main
```

## Domain Configuration

1. **Add custom domain to Heroku**
   ```bash
   heroku domains:add webscraper.live
   heroku domains:add www.webscraper.live
   ```

2. **Configure DNS**
   - Add CNAME record: `www` → `your-app.herokuapp.com`
   - Add ALIAS/ANAME record: `@` → `your-app.herokuapp.com`

3. **Enable SSL**
   - Heroku provides automatic SSL certificates
   - Verify: `heroku certs:auto`

## Support

For issues or questions:
- GitHub Issues: https://github.com/Haggai-dev665/web-scrapper/issues
- Email: support@webscraper.live
- Documentation: /api-docs

## Quick Commands Reference

```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Restart app
heroku restart

# Run migrations (if needed)
heroku run npm run migrate

# Open app in browser
heroku open

# Set config var
heroku config:set KEY=value

# View all config vars
heroku config

# Scale dynos
heroku ps:scale web=2

# Check app info
heroku info
```
