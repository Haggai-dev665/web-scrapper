import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCopy, FiCheck, FiCode, FiBook, FiKey } from 'react-icons/fi';

const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#A5B4FC',
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

const DocsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 1.125rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SidebarLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${colors.shadowMd};
  border: 1px solid ${colors.border};
  height: fit-content;
  position: sticky;
  top: 20px;
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  color: ${colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 1.25rem;
  font-weight: 700;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? colors.primary : 'transparent'};
  color: ${props => props.active ? colors.background : colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.active ? colors.primaryDark : colors.backgroundTertiary};
    color: ${props => props.active ? colors.background : colors.textPrimary};
  }
`;

const MainContent = styled.div`
  min-width: 0;
  overflow-x: hidden;
`;

const Section = styled.section`
  background: ${colors.background};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: ${colors.shadowMd};
  border: 1px solid ${colors.border};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  color: ${colors.textPrimary};
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
  font-weight: 700;
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 0.75rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SubsectionTitle = styled.h3`
  color: ${colors.textPrimary};
  font-size: 1.25rem;
  margin-top: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const Text = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-size: 1rem;
`;

const CodeBlock = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  margin: 1.25rem 0;
  box-shadow: ${colors.shadowMd};
  position: relative;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 4px;
  }
  
  code {
    font-family: inherit;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const InlineCode = styled.code`
  background: ${colors.backgroundTertiary};
  color: ${colors.primary};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  overflow-x: auto;
  display: block;
  
  @media (min-width: 768px) {
    display: table;
  }
`;

const Th = styled.th`
  background: ${colors.primary};
  color: ${colors.background};
  padding: 0.875rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid ${colors.primaryDark};
  font-size: 0.875rem;
`;

const Td = styled.td`
  padding: 0.875rem;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

const Tr = styled.tr`
  &:hover {
    background: ${colors.backgroundTertiary};
  }
`;

const Badge = styled.span<{ type?: 'get' | 'post' | 'put' | 'delete' }>`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
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
  color: ${colors.background};
`;

const Alert = styled.div<{ type?: 'info' | 'warning' | 'success' }>`
  padding: 1rem;
  border-radius: 8px;
  margin: 1.25rem 0;
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
  font-size: 0.9375rem;
`;

const ApiDocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copied, setCopied] = useState<string | null>(null);

  const sections = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'endpoints', label: 'API Endpoints' },
    { id: 'scraping', label: 'Web Scraping' },
    { id: 'rate-limits', label: 'Rate Limits' },
    { id: 'errors', label: 'Error Handling' },
    { id: 'examples', label: 'Code Examples' },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DocsContainer>
      <PageHeader>
        <PageTitle>📚 API Documentation</PageTitle>
        <PageDescription>
          Complete guide to integrating WebScraper API into your applications
        </PageDescription>
      </PageHeader>

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
                🎉 Welcome to WebScraper API! Start scraping websites in minutes.
              </Alert>

              <Text>
                The WebScraper API allows you to programmatically scrape and analyze websites
                with advanced features including screenshots, network analysis, and security audits.
              </Text>

              <SubsectionTitle>Base URL</SubsectionTitle>
              <CodeBlock style={{ position: 'relative' }}>
                <CopyButton onClick={() => copyToClipboard('https://api.webscraper.live/api', 'base-url')}>
                  {copied === 'base-url' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                </CopyButton>
                <code>https://api.webscraper.live/api</code>
              </CodeBlock>

              <SubsectionTitle>Quick Start</SubsectionTitle>
              <Text>
                1. Create an account and log in to your dashboard<br/>
                2. Generate an API key from the API Keys section<br/>
                3. Make your first API call with your API key<br/>
                4. Start building amazing applications!
              </Text>
            </Section>
          )}

          {activeSection === 'authentication' && (
            <Section>
              <SectionTitle>Authentication</SectionTitle>

              <Alert type="info">
                🔐 All API requests must be authenticated using your API key.
              </Alert>

              <Text>
                Include your API key in the request header:
              </Text>

              <CodeBlock style={{ position: 'relative' }}>
                <CopyButton onClick={() => copyToClipboard('X-API-Key: your_api_key_here', 'auth-header')}>
                  {copied === 'auth-header' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                </CopyButton>
                <code>X-API-Key: your_api_key_here</code>
              </CodeBlock>

              <Alert type="warning">
                ⚠️ Keep your API keys secure! Do not share them or commit them to version control.
              </Alert>
            </Section>
          )}

          {activeSection === 'endpoints' && (
            <Section>
              <SectionTitle>API Endpoints</SectionTitle>

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

              <CodeBlock style={{ position: 'relative' }}>
                <CopyButton onClick={() => copyToClipboard(`curl -X POST https://api.webscraper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{"url": "https://example.com"}'`, 'scrape-example')}>
                  {copied === 'scrape-example' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                </CopyButton>
                <code>{`curl -X POST https://api.webscraper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{"url": "https://example.com"}'`}</code>
              </CodeBlock>
            </Section>
          )}

          {activeSection === 'scraping' && (
            <Section>
              <SectionTitle>Web Scraping Features</SectionTitle>

              <Text>
                Our scraper extracts comprehensive data from websites including:
              </Text>

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
                    <Td>All links with text</Td>
                  </Tr>
                  <Tr>
                    <Td><InlineCode>images</InlineCode></Td>
                    <Td>All images with alt text</Td>
                  </Tr>
                  <Tr>
                    <Td><InlineCode>screenshot</InlineCode></Td>
                    <Td>Base64 encoded screenshot</Td>
                  </Tr>
                </tbody>
              </Table>
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
            </Section>
          )}

          {activeSection === 'errors' && (
            <Section>
              <SectionTitle>Error Handling</SectionTitle>

              <Text>
                The API uses conventional HTTP response codes:
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
            </Section>
          )}

          {activeSection === 'examples' && (
            <Section>
              <SectionTitle>Code Examples</SectionTitle>

              <SubsectionTitle>JavaScript / Node.js</SubsectionTitle>
              <CodeBlock style={{ position: 'relative' }}>
                <CopyButton onClick={() => copyToClipboard(`const axios = require('axios');

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
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

scrapeWebsite('https://example.com');`, 'js-example')}>
                  {copied === 'js-example' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                </CopyButton>
                <code>{`const axios = require('axios');

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
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

scrapeWebsite('https://example.com');`}</code>
              </CodeBlock>

              <SubsectionTitle>Python</SubsectionTitle>
              <CodeBlock style={{ position: 'relative' }}>
                <CopyButton onClick={() => copyToClipboard(`import requests

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

scrape_website('https://example.com')`, 'python-example')}>
                  {copied === 'python-example' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                </CopyButton>
                <code>{`import requests

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

scrape_website('https://example.com')`}</code>
              </CodeBlock>
            </Section>
          )}
        </MainContent>
      </SidebarLayout>
    </DocsContainer>
  );
};

export default ApiDocsPage;
