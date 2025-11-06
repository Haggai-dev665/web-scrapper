import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import colors from '../theme/colors';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.cream} 0%, ${colors.backgroundSecondary} 50%, ${colors.cream} 100%);
`;

const Header = styled.header`
  padding: 1.5rem 2rem;
  background: ${colors.white};
  border-bottom: 2px solid ${colors.turquoise};
  box-shadow: 0 2px 10px ${colors.shadow};
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${colors.brown};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${colors.turquoise};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${colors.textSecondary};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${colors.turquoise};
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${colors.brown};
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${colors.textSecondary};
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const SidebarLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${colors.white};
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px ${colors.shadow};
  height: fit-content;
  position: sticky;
  top: 100px;
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  color: ${colors.brown};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? colors.turquoise : 'transparent'};
  color: ${props => props.active ? colors.white : colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '500'};
  
  &:hover {
    background: ${props => props.active ? colors.turquoise : colors.backgroundTertiary};
    color: ${props => props.active ? colors.white : colors.brown};
  }
`;

const MainContent = styled.div``;

const Section = styled.section`
  background: ${colors.white};
  border-radius: 15px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px ${colors.shadow};
`;

const SectionTitle = styled.h2`
  color: ${colors.brown};
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  border-bottom: 3px solid ${colors.turquoise};
  padding-bottom: 0.75rem;
`;

const SubsectionTitle = styled.h3`
  color: ${colors.brown};
  font-size: 1.4rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Text = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const CodeBlock = styled.pre`
  background: ${colors.brown};
  color: ${colors.turquoise};
  padding: 1.5rem;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  margin: 1.5rem 0;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
  
  code {
    font-family: inherit;
  }
`;

const InlineCode = styled.code`
  background: ${colors.backgroundTertiary};
  color: ${colors.brown};
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
`;

const Th = styled.th`
  background: ${colors.turquoise};
  color: ${colors.white};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid ${colors.darkTurquoise};
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.textSecondary};
`;

const Tr = styled.tr`
  &:hover {
    background: ${colors.backgroundTertiary};
  }
`;

const Badge = styled.span<{ type?: 'get' | 'post' | 'put' | 'delete' }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 0.5rem;
  background: ${props => {
    switch (props.type) {
      case 'get': return colors.success;
      case 'post': return colors.info;
      case 'put': return colors.warning;
      case 'delete': return colors.error;
      default: return colors.textMuted;
    }
  }};
  color: ${colors.white};
`;

const Alert = styled.div<{ type?: 'info' | 'warning' | 'success' }>`
  padding: 1.25rem;
  border-radius: 10px;
  margin: 1.5rem 0;
  background: ${props => {
    switch (props.type) {
      case 'info': return `${colors.info}15`;
      case 'warning': return `${colors.warning}15`;
      case 'success': return `${colors.success}15`;
      default: return colors.backgroundTertiary;
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'info': return colors.info;
      case 'warning': return colors.warning;
      case 'success': return colors.success;
      default: return colors.border;
    }
  }};
  color: ${colors.textSecondary};
`;

const ApiDocPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'endpoints', label: 'API Endpoints' },
    { id: 'scraping', label: 'Web Scraping' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'security', label: 'Security Analysis' },
    { id: 'rate-limits', label: 'Rate Limits' },
    { id: 'errors', label: 'Error Handling' },
    { id: 'examples', label: 'Code Examples' },
  ];

  return (
    <PageContainer>
      <Header>
        <Logo to="/">
          ⚡ WebScraper.live
        </Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Get Started</NavLink>
        </Nav>
      </Header>

      <ContentContainer>
        <Title>API Documentation</Title>
        <Subtitle>
          Comprehensive guide to integrating WebScraper.live API into your applications.
          Extract, analyze, and secure insights from any website with our powerful API.
        </Subtitle>

        <SidebarLayout>
          <Sidebar>
            <SidebarTitle>Contents</SidebarTitle>
            <SidebarList>
              {sections.map(section => (
                <SidebarItem
                  key={section.id}
                  active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </SidebarItem>
              ))}
            </SidebarList>
          </Sidebar>

          <MainContent>
            {activeSection === 'getting-started' && (
              <Section>
                <SectionTitle>Getting Started</SectionTitle>
                
                <Alert type="success">
                  🎉 Welcome to WebScraper.live API! Start scraping websites in minutes.
                </Alert>

                <Text>
                  The WebScraper.live API allows you to programmatically scrape and analyze websites
                  with advanced features including screenshots, network analysis, and security audits.
                  Our API is RESTful, returns JSON responses, and uses standard HTTP response codes.
                </Text>

                <SubsectionTitle>Base URL</SubsectionTitle>
                <CodeBlock>
                  <code>https://api.webscraper.live/api</code>
                </CodeBlock>
                <Text>
                  For local development:
                </Text>
                <CodeBlock>
                  <code>http://localhost:8080/api</code>
                </CodeBlock>

                <SubsectionTitle>Quick Start</SubsectionTitle>
                <Text>
                  1. Create an account at <a href="/register">webscraper.live/register</a><br/>
                  2. Generate an API key from your dashboard<br/>
                  3. Make your first API call with your API key<br/>
                  4. Start building amazing applications!
                </Text>

                <CodeBlock>{`# Example: Health Check
curl https://api.webscraper.live/api/health

# Response
{
  "status": "healthy",
  "service": "web-scraper-backend",
  "version": "0.1.0"
}`}</CodeBlock>
              </Section>
            )}

            {activeSection === 'authentication' && (
              <Section>
                <SectionTitle>Authentication</SectionTitle>

                <Alert type="info">
                  🔐 All API requests must be authenticated using your API key.
                </Alert>

                <Text>
                  WebScraper.live uses API keys to authenticate requests. You can view and manage
                  your API keys in your dashboard. Include your API key in the request header:
                </Text>

                <CodeBlock>{`X-API-Key: your_api_key_here`}</CodeBlock>

                <SubsectionTitle>Getting Your API Key</SubsectionTitle>
                <Text>
                  1. Log in to your dashboard<br/>
                  2. Navigate to "API Keys" section<br/>
                  3. Click "Create New API Key"<br/>
                  4. Copy your API key (it will only be shown once!)
                </Text>

                <Alert type="warning">
                  ⚠️ Keep your API keys secure! Do not share them or commit them to version control.
                  Treat them like passwords.
                </Alert>

                <SubsectionTitle>Authentication Example</SubsectionTitle>
                <CodeBlock>{`curl -X POST https://api.webscraper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_live_abc123..." \\
  -d '{"url": "https://example.com"}'`}</CodeBlock>
              </Section>
            )}

            {activeSection === 'endpoints' && (
              <Section>
                <SectionTitle>API Endpoints</SectionTitle>

                <SubsectionTitle>Health Check</SubsectionTitle>
                <div>
                  <Badge type="get">GET</Badge>
                  <InlineCode>/api/health</InlineCode>
                </div>
                <Text>Check the API service status.</Text>
                <CodeBlock>{`curl https://api.webscraper.live/api/health`}</CodeBlock>

                <SubsectionTitle>Scrape Website</SubsectionTitle>
                <div>
                  <Badge type="post">POST</Badge>
                  <InlineCode>/api/scrape</InlineCode>
                </div>
                <Text>Scrape and analyze a website with full rendering and security analysis.</Text>

                <Table>
                  <thead>
                    <tr>
                      <Th>Parameter</Th>
                      <Th>Type</Th>
                      <Th>Required</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tr>
                      <Td><InlineCode>url</InlineCode></Td>
                      <Td>string</Td>
                      <Td>Yes</Td>
                      <Td>The URL to scrape</Td>
                    </Tr>
                  </tbody>
                </Table>

                <CodeBlock>{`curl -X POST https://api.webscraper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "url": "https://example.com"
  }'`}</CodeBlock>
              </Section>
            )}

            {activeSection === 'scraping' && (
              <Section>
                <SectionTitle>Web Scraping Features</SectionTitle>

                <Text>
                  Our scraper extracts comprehensive data from websites including:
                </Text>

                <SubsectionTitle>Extracted Data</SubsectionTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Field</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tr>
                      <Td><InlineCode>title</InlineCode></Td>
                      <Td>Page title</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>description</InlineCode></Td>
                      <Td>Meta description</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>headings</InlineCode></Td>
                      <Td>All H1-H6 headings</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>links</InlineCode></Td>
                      <Td>All links with text and external status</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>images</InlineCode></Td>
                      <Td>All images with alt text and dimensions</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>meta_tags</InlineCode></Td>
                      <Td>All meta tags</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>word_count</InlineCode></Td>
                      <Td>Total words on page</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>reading_time_minutes</InlineCode></Td>
                      <Td>Estimated reading time</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>response_time_ms</InlineCode></Td>
                      <Td>Request processing time</Td>
                    </Tr>
                  </tbody>
                </Table>

                <Alert type="info">
                  💡 We use headless Chrome to render JavaScript-heavy pages, ensuring you get the
                  complete rendered content.
                </Alert>
              </Section>
            )}

            {activeSection === 'screenshots' && (
              <Section>
                <SectionTitle>Screenshot Capture</SectionTitle>

                <Text>
                  Our API automatically captures high-quality screenshots of every page you scrape.
                  Screenshots are returned as base64-encoded PNG images.
                </Text>

                <SubsectionTitle>Response Format</SubsectionTitle>
                <CodeBlock>{`{
  "success": true,
  "data": {
    "url": "https://example.com",
    "screenshot": "iVBORw0KGgoAAAANSUhEUgAA...",
    // ... other data
  }
}`}</CodeBlock>

                <SubsectionTitle>Using Screenshots</SubsectionTitle>
                <Text>
                  The screenshot field contains a base64-encoded PNG image that you can:
                </Text>
                <Text>
                  • Display directly in HTML using data URIs<br/>
                  • Decode and save to a file<br/>
                  • Send to image processing services<br/>
                  • Use for visual regression testing
                </Text>

                <Alert type="success">
                  ✨ Screenshots are captured after the page fully loads, including all JavaScript
                  execution and dynamic content.
                </Alert>
              </Section>
            )}

            {activeSection === 'security' && (
              <Section>
                <SectionTitle>Security Analysis</SectionTitle>

                <Text>
                  Every scrape includes comprehensive security analysis of the target website:
                </Text>

                <SubsectionTitle>Security Report Fields</SubsectionTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Field</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tr>
                      <Td><InlineCode>is_https</InlineCode></Td>
                      <Td>Whether the site uses HTTPS</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>mixed_content</InlineCode></Td>
                      <Td>Detects HTTP resources on HTTPS pages</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>missing_security_headers</InlineCode></Td>
                      <Td>List of missing security headers</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>insecure_cookies</InlineCode></Td>
                      <Td>Detects cookies without Secure/HttpOnly flags</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>csp</InlineCode></Td>
                      <Td>Content Security Policy header value</Td>
                    </Tr>
                    <Tr>
                      <Td><InlineCode>notes</InlineCode></Td>
                      <Td>Additional security observations</Td>
                    </Tr>
                  </tbody>
                </Table>

                <SubsectionTitle>Example Security Report</SubsectionTitle>
                <CodeBlock>{`{
  "security_report": {
    "is_https": true,
    "mixed_content": false,
    "missing_security_headers": [
      "strict-transport-security",
      "x-frame-options"
    ],
    "insecure_cookies": false,
    "csp": "default-src 'self'",
    "notes": [
      "Consider adding HSTS header",
      "X-Frame-Options header missing"
    ]
  }
}`}</CodeBlock>

                <Alert type="warning">
                  🔒 Use security reports to identify vulnerabilities and improve your website's
                  security posture.
                </Alert>
              </Section>
            )}

            {activeSection === 'rate-limits' && (
              <Section>
                <SectionTitle>Rate Limits</SectionTitle>

                <Text>
                  API rate limits are based on your subscription tier:
                </Text>

                <Table>
                  <thead>
                    <tr>
                      <Th>Tier</Th>
                      <Th>Requests/Month</Th>
                      <Th>Rate Limit</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tr>
                      <Td>Free</Td>
                      <Td>1,000</Td>
                      <Td>10 req/min</Td>
                    </Tr>
                    <Tr>
                      <Td>Pro</Td>
                      <Td>10,000</Td>
                      <Td>60 req/min</Td>
                    </Tr>
                    <Tr>
                      <Td>Enterprise</Td>
                      <Td>Unlimited</Td>
                      <Td>Custom</Td>
                    </Tr>
                  </tbody>
                </Table>

                <Alert type="info">
                  📊 Monitor your usage in the dashboard to avoid hitting rate limits.
                </Alert>

                <SubsectionTitle>Rate Limit Headers</SubsectionTitle>
                <Text>
                  All API responses include rate limit information in headers:
                </Text>
                <CodeBlock>{`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1635724800`}</CodeBlock>
              </Section>
            )}

            {activeSection === 'errors' && (
              <Section>
                <SectionTitle>Error Handling</SectionTitle>

                <Text>
                  The API uses conventional HTTP response codes to indicate success or failure:
                </Text>

                <Table>
                  <thead>
                    <tr>
                      <Th>Code</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <Tr>
                      <Td>200</Td>
                      <Td>Success</Td>
                    </Tr>
                    <Tr>
                      <Td>400</Td>
                      <Td>Bad Request - Invalid parameters</Td>
                    </Tr>
                    <Tr>
                      <Td>401</Td>
                      <Td>Unauthorized - Invalid API key</Td>
                    </Tr>
                    <Tr>
                      <Td>429</Td>
                      <Td>Too Many Requests - Rate limit exceeded</Td>
                    </Tr>
                    <Tr>
                      <Td>500</Td>
                      <Td>Internal Server Error</Td>
                    </Tr>
                  </tbody>
                </Table>

                <SubsectionTitle>Error Response Format</SubsectionTitle>
                <CodeBlock>{`{
  "success": false,
  "data": null,
  "error": "Invalid URL format"
}`}</CodeBlock>

                <Alert type="warning">
                  💡 Always check the <InlineCode>success</InlineCode> field before processing data.
                </Alert>
              </Section>
            )}

            {activeSection === 'examples' && (
              <Section>
                <SectionTitle>Code Examples</SectionTitle>

                <SubsectionTitle>JavaScript / Node.js</SubsectionTitle>
                <CodeBlock>{`const axios = require('axios');

const scrapeWebsite = async (url) => {
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
    
    if (response.data.success) {
      console.log('Title:', response.data.data.title);
      console.log('Links:', response.data.data.links.length);
      console.log('Security:', response.data.data.security_report);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

scrapeWebsite('https://example.com');`}</CodeBlock>

                <SubsectionTitle>Python</SubsectionTitle>
                <CodeBlock>{`import requests

def scrape_website(url):
    api_url = 'https://api.webscraper.live/api/scrape'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
    }
    data = {'url': url}
    
    response = requests.post(api_url, json=data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            print(f"Title: {result['data']['title']}")
            print(f"Links: {len(result['data']['links'])}")
            print(f"Security: {result['data']['security_report']}")
    else:
        print(f"Error: {response.status_code}")

scrape_website('https://example.com')`}</CodeBlock>

                <SubsectionTitle>cURL</SubsectionTitle>
                <CodeBlock>{`curl -X POST https://api.webscraper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{"url": "https://example.com"}' \\
  | jq .`}</CodeBlock>

                <Alert type="success">
                  🚀 Ready to start? Sign up for a free account and get your API key today!
                </Alert>
              </Section>
            )}
          </MainContent>
        </SidebarLayout>
      </ContentContainer>
    </PageContainer>
  );
};

export default ApiDocPage;
