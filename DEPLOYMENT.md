# Deployment Guide for WebScraper.live

## Heroku Deployment

### Prerequisites
1. Heroku CLI installed
2. Heroku account
3. MongoDB Atlas account (for production database)

### Step 1: Prepare the Application

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Update CORS settings** in `backend/src/main.rs`
   ```rust
   .allow_origin([
       "https://webscrapper.live".parse().unwrap(),
       // Add your frontend URL here
   ])
   ```

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create webscrapper-api

# Add Rust buildpack
heroku buildpacks:set emk/rust -a webscrapper-api

# Add Node.js buildpack for frontend
heroku buildpacks:add heroku/nodejs -a webscrapper-api
```

### Step 3: Configure Environment Variables

```bash
# MongoDB connection (use MongoDB Atlas)
heroku config:set MONGODB_URI="your-mongodb-atlas-uri" -a webscrapper-api

# JWT Secret
heroku config:set JWT_SECRET="your-super-secret-jwt-key" -a webscrapper-api

# Port (Heroku sets this automatically)
heroku config:set PORT=8080 -a webscrapper-api
```

### Step 4: Deploy

```bash
# Push to Heroku
git push heroku main

# Check logs
heroku logs --tail -a webscrapper-api
```

### Step 5: Frontend Deployment

The frontend can be deployed to Netlify, Vercel, or as a static site:

#### Option 1: Netlify
```bash
cd frontend
npm run build
# Deploy dist folder to Netlify
```

#### Option 2: Vercel
```bash
cd frontend
npm run build
vercel --prod
```

### Step 6: Domain Configuration

1. **Add custom domain to Heroku**
   ```bash
   heroku domains:add api.webscrapper.live -a webscrapper-api
   ```

2. **Configure DNS**
   - Add CNAME record: `api.webscrapper.live` → `your-app.herokuapp.com`
   - Add A record: `webscrapper.live` → Your frontend hosting IP

### Step 7: Environment Variables for Frontend

Update `frontend/.env.production`:
```
VITE_API_URL=https://api.webscrapper.live
```

## MongoDB Atlas Setup

1. **Create a cluster**
   - Go to MongoDB Atlas
   - Create a new cluster (M0 free tier is fine for development)

2. **Create a database user**
   - Security → Database Access
   - Add new database user with password

3. **Whitelist IP addresses**
   - Security → Network Access
   - Add IP address (0.0.0.0/0 for Heroku)

4. **Get connection string**
   - Databases → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

## Production Checklist

- [ ] MongoDB Atlas configured and accessible
- [ ] Environment variables set in Heroku
- [ ] CORS configured for production domain
- [ ] JWT secret is secure and random
- [ ] Frontend environment variables point to production API
- [ ] DNS records configured
- [ ] SSL certificates configured (automatic with Heroku)
- [ ] Rate limiting configured (if needed)
- [ ] Monitoring and logging set up

## Troubleshooting

### Build Fails
- Check Heroku logs: `heroku logs --tail`
- Ensure all dependencies are in Cargo.toml
- Verify buildpack is set correctly

### Database Connection Issues
- Verify MongoDB URI format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Errors
- Verify frontend URL is in allowed origins list
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
- Email: support@webscrapper.live
