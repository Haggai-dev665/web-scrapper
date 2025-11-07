# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses two types of authentication:

1. **JWT Token**: For user-related endpoints (dashboard, API keys management)
   - Include in header: `Authorization: Bearer <token>`

2. **API Key**: For scraping endpoints
   - Include in header: `x-api-key: <your-api-key>`

## Endpoints

### 1. Health Check
**GET** `/api/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "service": "web-scraper-backend",
  "version": "0.1.0"
}
```

### 2. User Registration
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "subscriptionTier": "Free",
    "monthlyRequests": 0,
    "monthlyLimit": 1000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. User Login
**POST** `/api/auth/login`

Authenticate and get a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 4. Scrape Website
**POST** `/api/scrape`

**Authentication**: Requires API Key

Scrapes and analyzes a website URL using Puppeteer for advanced browser automation.

**Headers:**
```
x-api-key: your-api-key-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples...",
    "headings": [
      "H1: Example Domain",
      "H2: More Information"
    ],
    "links": [
      {
        "text": "More information...",
        "href": "https://www.iana.org/domains/example",
        "isExternal": true
      }
    ],
    "images": [
      {
        "alt": "Example logo",
        "src": "/logo.png",
        "width": "100",
        "height": "50"
      }
    ],
    "metaTags": {
      "description": "This domain is for use in illustrative examples",
      "viewport": "width=device-width, initial-scale=1.0"
    },
    "screenshot": "data:image/png;base64,iVBORw0KGg...",
    "wordCount": 28,
    "responseTimeMs": 2450,
    "textContent": "Example Domain This domain is for use...",
    "wordFrequency": {
      "domain": 3,
      "example": 2
    },
    "readingTimeMinutes": 0.14,
    "readabilityScore": 85.5,
    "language": "English",
    "socialMediaLinks": [],
    "pageSizeKb": 12.5,
    "renderedHtml": "<!DOCTYPE html>...",
    "networkResources": [
      {
        "name": "https://example.com/style.css",
        "initiatorType": "stylesheet",
        "startTimeMs": 0,
        "durationMs": 100,
        "transferSize": 1024,
        "encodedBodySize": 1024
      }
    ],
    "responseHeaders": {
      "content-type": "text/html",
      "server": "nginx"
    },
    "consoleLogs": [
      {
        "level": "info",
        "message": "Page loaded successfully"
      }
    ],
    "securityReport": {
      "isHttps": true,
      "mixedContent": false,
      "missingSecurityHeaders": [
        "strict-transport-security",
        "content-security-policy"
      ],
      "insecureCookies": false,
      "csp": null,
      "notes": []
    }
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

## Data Types

### ScrapedData
| Field | Type | Description |
|-------|------|-------------|
| url | string | The scraped URL |
| title | string | Page title |
| description | string | Meta description |
| headings | string[] | All headings (H1-H6) with prefixes |
| links | LinkInfo[] | All links found on the page |
| images | ImageInfo[] | All images found on the page |
| meta_tags | Record<string, string> | Meta tags and their values |
| screenshot | string? | Base64 encoded screenshot (future feature) |
| word_count | number | Total word count in page content |
| response_time_ms | number | Time taken to process the request |

### LinkInfo
| Field | Type | Description |
|-------|------|-------------|
| text | string | Link text or href if no text |
| href | string | Link URL |
| is_external | boolean | Whether the link is external |

### ImageInfo
| Field | Type | Description |
|-------|------|-------------|
| alt | string | Alt text of the image |
| src | string | Image source URL |
| width | string? | Image width attribute |
| height | string? | Image height attribute |

## Example Usage

### cURL Examples

```bash
# Health check
curl http://localhost:8080/api/health

# Scrape a website
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:8080/api/scrape
```

### JavaScript/Axios Example

```javascript
import axios from 'axios';

// Health check
const health = await axios.get('http://localhost:8080/api/health');
console.log(health.data);

// Scrape website
const result = await axios.post('http://localhost:8080/api/scrape', {
  url: 'https://example.com'
});

if (result.data.success) {
  console.log('Scraped data:', result.data.data);
} else {
  console.error('Error:', result.data.error);
}
```

## Error Codes

- **400 Bad Request**: Invalid URL format or missing URL parameter
- **500 Internal Server Error**: Network error, parsing error, or server error
- **Timeout**: Request timeout (30 seconds)

## Rate Limiting

Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

CORS is enabled for all origins in development mode. For production, configure specific allowed origins.