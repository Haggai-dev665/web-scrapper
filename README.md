# 🔍 WebScraper.live - Advanced Web Intelligence Platform

A powerful, full-stack web scraping application built with **Rust** for the backend and **React TypeScript** for the frontend. Extract, analyze, and secure insights from any website with military-grade precision and comprehensive security analysis.

![Web Scraper Interface](https://github.com/user-attachments/assets/fb07f572-46bb-450b-b56a-257428285711)

## ✨ Features

### Core Capabilities
- **🚀 High-Performance Backend**: Built with Rust using Axum framework for blazing-fast performance
- **🎨 Beautiful UI**: Modern React interface with harmonious color palette (cream, turquoise, brown)
- **📊 Comprehensive Analysis**: Extract titles, descriptions, headings, links, images, and metadata
- **⚡ Real-time Processing**: Live feedback with loading states and error handling
- **🔗 API Access**: RESTful API with comprehensive documentation for programmatic access
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🛡️ Error Handling**: Robust error handling with user-friendly messages

### Advanced Features
- **🖼️ Screenshot Capture**: Automatic high-quality screenshots of every scraped page
- **🔒 Security Analysis**: Comprehensive security reports including:
  - HTTPS status and mixed content detection
  - Missing security headers identification
  - Cookie security validation
  - Content Security Policy (CSP) analysis
  - Common vulnerability detection
- **🌐 Network Analysis**: Detailed network resource tracking and performance metrics
- **📝 Console Logs**: Capture JavaScript console messages for debugging
- **🔐 OAuth Integration**: Google and GitHub authentication (coming soon)
- **📊 Usage Analytics**: Track API usage, response times, and success rates
- **🔑 API Key Management**: Generate and manage multiple API keys
- **📚 Comprehensive Documentation**: Built-in API documentation with examples

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│                 │ ──────────────► │                 │
│  React Frontend │                 │  Rust Backend   │
│  (TypeScript)   │ ◄────────────── │     (Axum)      │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
        │                                     │
        │                                     │
   ┌────▼────┐                           ┌────▼────┐
   │ Styled  │                           │ Scraper │
   │Components│                           │ Engine  │
   └─────────┘                           └─────────┘
```

## 🛠️ Technology Stack

### Backend (Rust)
- **Axum**: Modern web framework
- **Reqwest**: HTTP client for web requests
- **Scraper**: HTML parsing and CSS selection
- **Headless Chrome**: Browser automation for JavaScript rendering
- **Tokio**: Async runtime
- **Serde**: JSON serialization/deserialization
- **Tower-HTTP**: CORS middleware
- **MongoDB**: Database for user data and API keys
- **JWT**: Secure authentication
- **Bcrypt**: Password hashing

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
- Rust 1.70+ (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh`)
- Node.js 18+ (`https://nodejs.org/`)
- npm or yarn

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Haggai-dev665/web-scrapper.git
   cd web-scrapper
   ```

2. **Start the Backend**
   ```bash
   cd backend
   cargo run
   ```
   The API will be available at `http://localhost:8080`

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The UI will be available at `http://localhost:3000`

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
cargo test
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

# Scrape a website
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:8080/api/scrape
```

## 🔧 Configuration

### Backend Configuration
- **Port**: Default `8080` (configurable via environment)
- **CORS**: Enabled for all origins in development
- **Timeout**: 30 seconds for HTTP requests

### Frontend Configuration
- **API Base URL**: `http://localhost:8080/api`
- **Development Port**: `3000`

## 🚀 Deployment

### Backend (Production)
```bash
cd backend
cargo build --release
./target/release/web-scraper-backend
```

### Frontend (Production)
```bash
cd frontend
npm run build
# Serve the build folder with any static file server
```

## 🔑 Using API Keys in Your Projects

WebScraper.live provides a powerful API that you can use in your own applications. Here's how:

### 1. Generate Your API Key

1. Sign up at [webscrapper.live](https://webscrapper.live)
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
      'https://api.webscrapper.live/api/scrape',
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
        'https://api.webscrapper.live/api/scrape',
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

Designed for deployment on Heroku at **webscrapper.live**. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Implemented Features

- [x] Screenshot capture functionality
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

**Built with ❤️ using Rust and React**