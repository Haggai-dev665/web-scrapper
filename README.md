# 🔍 WebScraper.live - Advanced Web Intelligence Platform

A powerful, full-stack web scraping application built with **Node.js + Puppeteer** for the backend and **React TypeScript** for the frontend. Extract, analyze, and secure insights from any website with advanced browser automation and comprehensive security analysis.

![Web Scraper Interface](https://github.com/user-attachments/assets/fb07f572-46bb-450b-b56a-257428285711)

## ✨ Features

### Core Capabilities
- **🚀 High-Performance Backend**: Built with Node.js and Puppeteer for advanced browser automation
- **🎨 Beautiful UI**: Modern React interface with harmonious color palette (cream, turquoise, brown)
- **📊 Comprehensive Analysis**: Extract titles, descriptions, headings, links, images, and metadata
- **⚡ Real-time Processing**: Live feedback with loading states and error handling
- **🔗 API Access**: RESTful API with comprehensive documentation for programmatic access
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🛡️ Error Handling**: Robust error handling with user-friendly messages

### Advanced Features
- **🖼️ Screenshot Capture**: Automatic high-quality screenshots of every scraped page using Puppeteer
- **🔒 Security Analysis**: Comprehensive security reports including:
  - HTTPS status and mixed content detection
  - Missing security headers identification
  - Cookie security validation
  - Content Security Policy (CSP) analysis
  - Common vulnerability detection
- **🌐 Network Analysis**: Detailed network resource tracking and performance metrics
- **📝 Console Logs**: Capture JavaScript console messages for debugging
- **🤖 Headless Chrome**: Full browser automation with Puppeteer for JavaScript-heavy sites
- **🔐 OAuth Integration**: Google and GitHub authentication (coming soon)
- **📊 Usage Analytics**: Track API usage, response times, and success rates
- **🔑 API Key Management**: Generate and manage multiple API keys
- **📚 Comprehensive Documentation**: Built-in API documentation with examples

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│                 │ ──────────────► │                 │
│  React Frontend │                 │  Node.js Backend│
│  (TypeScript)   │ ◄────────────── │   (Puppeteer)   │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
        │                                     │
        │                                     │
   ┌────▼────┐                           ┌────▼────┐
   │ Styled  │                           │Puppeteer│
   │Components│                           │ Engine  │
   └─────────┘                           └─────────┘
```

## 🛠️ Technology Stack

### Backend (Node.js)
- **Express**: Fast, minimalist web framework
- **Puppeteer**: Headless Chrome automation for advanced scraping
- **Puppeteer-Extra**: Enhanced Puppeteer with stealth plugin
- **TypeScript**: Type-safe development
- **MongoDB**: Database for user data and API keys
- **JWT**: Secure authentication
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend (React)
- **React 18**: Latest React with hooks
- **TypeScript**: Type-safe development
- **Styled-components**: CSS-in-JS styling with theme support
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **React Icons**: Beautiful icon library
- **Vite**: Lightning-fast build tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (`https://nodejs.org/`)
- npm or yarn
- MongoDB (local or cloud instance)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Haggai-dev665/web-scrapper.git
   cd web-scrapper
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start the Backend**
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
   The API will be available at `http://localhost:8080`

4. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The UI will be available at `http://localhost:5173`

## 📋 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "web-scraper-backend",
  "version": "0.1.0"
}
```

#### Scrape Website
```http
POST /api/scrape
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples...",
    "headings": [
      "H1: Example Domain"
    ],
    "links": [
      {
        "text": "More information...",
        "href": "https://www.iana.org/domains/example",
        "is_external": true
      }
    ],
    "images": [
      {
        "alt": "Example image",
        "src": "/image.png",
        "width": "300",
        "height": "200"
      }
    ],
    "meta_tags": {
      "description": "This domain is for use in illustrative examples",
      "author": "IANA"
    },
    "word_count": 86,
    "response_time_ms": 245
  },
  "error": null
}
```

**Error Response:**
```json
{
  "success": false,
  "data": null,
  "error": "Invalid URL format"
}
```

## 🎨 UI Features

### Color Scheme
- **Primary**: Raisin Black (`#1e1e1e`)
- **Secondary**: White (`#ffffff`)
- **Accent**: Light grays for subtle contrasts

### Components
- **URL Input**: Clean input field with validation
- **Scrape Button**: Animated button with loading states
- **Results Dashboard**: Organized display of scraped data
- **Metrics Cards**: Visual representation of key statistics
- **Collapsible Sections**: Organized data presentation

## 📊 Data Extraction

The scraper extracts the following information:

- **📄 Page Metadata**
  - Title
  - Description
  - Meta tags
  - Response time

- **📝 Content Analysis**
  - All headings (H1-H6)
  - Word count
  - Text content structure

- **🔗 Link Analysis**
  - All links with anchor text
  - External vs internal classification
  - Link validation

- **🖼️ Image Analysis**
  - Image sources and alt text
  - Dimensions when available
  - Image count statistics

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual API Testing
```bash
# Health check
curl http://localhost:8080/api/health

# Scrape a website (requires API key)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{"url":"https://example.com"}' \
  http://localhost:8080/api/scrape
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Default `8080` (configurable via PORT environment variable)
- **CORS**: Enabled for specified origins
- **Timeout**: 30 seconds for HTTP requests
- **MongoDB**: Configurable via MONGODB_URI environment variable
- **JWT Secret**: Configurable via JWT_SECRET environment variable

### Frontend Configuration
- **API Base URL**: `http://localhost:8080/api` (development)
- **Development Port**: `5173` (Vite default)

## 🚀 Deployment

### Backend (Production)
```bash
cd backend
npm install
npm run build
npm start
```

### Frontend (Production)
```bash
cd frontend
npm install
npm run build
# Serve the dist folder with any static file server
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## 🔑 Using API Keys in Your Projects

WebScraper.live provides a powerful API that you can use in your own applications. Here's how:

### 1. Generate Your API Key

1. Sign up at [webscraper.live](https://webscraper.live)
2. Navigate to your Dashboard
3. Go to "API Keys" section
4. Click "Create New API Key"
5. Copy and securely store your API key

### 2. Make API Calls

#### JavaScript/Node.js Example
```javascript
const axios = require('axios');

async function scrapeWebsite(url) {
  try {
    const response = await axios.post(
      'https://api.webscraper.live/api/scrape',
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'your_api_key_here'
        }
      }
    );
    
    const data = response.data.data;
    console.log('Title:', data.title);
    console.log('Screenshot:', data.screenshot); // Base64 encoded
    console.log('Security Report:', data.security_report);
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeWebsite('https://example.com');
```

#### Python Example
```python
import requests

def scrape_website(url):
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
    }
    response = requests.post(
        'https://api.webscraper.live/api/scrape',
        json={'url': url},
        headers=headers
    )
    
    if response.status_code == 200:
        result = response.json()['data']
        print(f"Title: {result['title']}")
        print(f"Security: {result['security_report']}")
        return result

scrape_website('https://example.com')
```

### 3. API Documentation

Full API documentation available at [/api-docs](/api-docs)

## 🚀 Deployment to Heroku

Designed for deployment on Heroku at **webscraper.live**. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Implemented Features

- [x] Screenshot capture functionality with Puppeteer
- [x] Network security analysis with detailed reports
- [x] Headless Chrome rendering for JavaScript-heavy sites
- [x] API key authentication and management
- [x] OAuth integration UI (Google & GitHub)
- [x] Comprehensive API documentation page
- [x] User dashboard with real data
- [x] Usage analytics and monitoring
- [x] Security vulnerability detection
- [x] Network resource analysis
- [x] Console log capture
- [x] Modern responsive UI with custom color theme
- [x] Full Node.js + Puppeteer backend implementation
- [ ] Batch URL processing
- [ ] Data export (CSV, JSON)
- [ ] Historical scraping data visualization
- [ ] Advanced filtering options
- [ ] Rate limiting and caching
- [ ] Docker containerization

## 👨‍💻 Author

**CHE HAGGAI**
- GitHub: [@Haggai-dev665](https://github.com/Haggai-dev665)

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/Haggai-dev665/web-scrapper/issues) section
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Built with ❤️ using Node.js, Puppeteer, and React**