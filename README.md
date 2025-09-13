# 🔍 Advanced Web Scraper

A powerful, full-stack web scraping application built with **Rust** for the backend and **React TypeScript** for the frontend. Extract and analyze website data with beautiful visualizations and comprehensive insights.

![Web Scraper Interface](https://github.com/user-attachments/assets/fb07f572-46bb-450b-b56a-257428285711)

## ✨ Features

- **🚀 High-Performance Backend**: Built with Rust using Axum framework for blazing-fast performance
- **🎨 Beautiful UI**: Modern React interface with white and raisin black color scheme
- **📊 Comprehensive Analysis**: Extract titles, descriptions, headings, links, images, and metadata
- **⚡ Real-time Processing**: Live feedback with loading states and error handling
- **🔗 API Access**: RESTful API for programmatic access
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🛡️ Error Handling**: Robust error handling with user-friendly messages

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
- **Tokio**: Async runtime
- **Serde**: JSON serialization/deserialization
- **Tower-HTTP**: CORS middleware

### Frontend (React)
- **React 18**: Latest React with hooks
- **TypeScript**: Type-safe development
- **Styled-components**: CSS-in-JS styling
- **Axios**: HTTP client for API calls

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] Screenshot capture functionality
- [ ] Batch URL processing
- [ ] Data export (CSV, JSON)
- [ ] Historical scraping data
- [ ] Advanced filtering options
- [ ] Performance analytics
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