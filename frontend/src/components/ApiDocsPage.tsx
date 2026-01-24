import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiCopy, 
  FiCheck, 
  FiCode, 
  FiBook, 
  FiKey,
  FiGlobe,
  FiShield,
  FiZap,
  FiTerminal,
  FiPlay,
  FiExternalLink,
  FiChevronRight
} from 'react-icons/fi';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DocsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PageDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const QuickLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${colors.primary}10;
  color: ${colors.primary};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primary}20;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.nav`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid ${colors.border};
  height: fit-content;
  position: sticky;
  top: 100px;
  
  @media (max-width: 1024px) {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 1024px) {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h3`
  color: ${colors.textMuted};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem 0;
  padding: 0 0.5rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${props => props.$active ? colors.textLight : colors.textSecondary};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 0.85rem;
  border: none;
  text-align: left;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$active ? colors.primaryDark : colors.backgroundSecondary};
    color: ${props => props.$active ? colors.textLight : colors.textPrimary};
  }
  
  @media (max-width: 1024px) {
    width: auto;
    margin-bottom: 0;
  }
`;

const Content = styled.main`
  min-width: 0;
`;

const Section = styled.section`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${colors.border};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  color: ${colors.textPrimary};
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  color: ${colors.textSecondary};
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const SubSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.border};
  
  &:first-of-type {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

const SubTitle = styled.h3`
  color: ${colors.textPrimary};
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
`;

const Text = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
`;

const CodeBlock = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${colors.secondary};
  border-radius: 12px 12px 0 0;
  border: 1px solid ${colors.secondaryLight};
  border-bottom: none;
`;

const CodeLanguage = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${props => props.$copied ? colors.success : 'transparent'};
  border: 1px solid ${props => props.$copied ? colors.success : colors.secondaryLight};
  color: ${props => props.$copied ? colors.textLight : colors.textMuted};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$copied ? colors.success : colors.secondaryLight};
    color: ${colors.textLight};
  }
`;

const CodeContent = styled.pre`
  background: ${colors.secondary};
  color: ${colors.textLight};
  padding: 1.25rem;
  border-radius: 0 0 12px 12px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Monaco', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  border: 1px solid ${colors.secondaryLight};
  border-top: none;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.secondaryLight};
    border-radius: 4px;
  }
`;

const InlineCode = styled.code`
  background: ${colors.backgroundSecondary};
  color: ${colors.primary};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Monaco', 'Consolas', monospace;
  font-size: 0.85em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
`;

const Th = styled.th`
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid ${colors.border};
  font-size: 0.85rem;
`;

const Td = styled.td`
  padding: 0.875rem 1rem;
  border: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  vertical-align: top;
`;

const Badge = styled.span<{ $type?: 'get' | 'post' | 'put' | 'delete' | 'required' | 'optional' }>`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$type) {
      case 'get': return colors.success;
      case 'post': return colors.primary;
      case 'put': return colors.warning;
      case 'delete': return colors.error;
      case 'required': return colors.error;
      case 'optional': return colors.textMuted;
      default: return colors.textMuted;
    }
  }};
  color: white;
`;

const Alert = styled.div<{ $type?: 'info' | 'warning' | 'success' | 'error' }>`
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: ${props => {
    switch (props.$type) {
      case 'info': return `${colors.primary}10`;
      case 'warning': return `${colors.warning}10`;
      case 'success': return `${colors.success}10`;
      case 'error': return `${colors.error}10`;
      default: return colors.backgroundSecondary;
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'info': return colors.primary;
      case 'warning': return colors.warning;
      case 'success': return colors.success;
      case 'error': return colors.error;
      default: return colors.border;
    }
  }};
  
  .icon {
    font-size: 1.1rem;
    color: ${props => {
      switch (props.$type) {
        case 'info': return colors.primary;
        case 'warning': return colors.warning;
        case 'success': return colors.success;
        case 'error': return colors.error;
        default: return colors.textMuted;
      }
    }};
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      color: ${colors.textPrimary};
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
    
    .text {
      color: ${colors.textSecondary};
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }
`;

const EndpointCard = styled.div`
  background: ${colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.25rem;
  margin: 1rem 0;
  border: 1px solid ${colors.border};
`;

const EndpointHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const EndpointPath = styled.code`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  color: ${colors.textPrimary};
  font-weight: 600;
`;

const EndpointDescription = styled.p`
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
`;

const ResponseExample = styled.div`
  margin-top: 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${colors.backgroundSecondary};
  padding: 0.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: fit-content;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.$active ? colors.surface : 'transparent'};
  color: ${props => props.$active ? colors.textPrimary : colors.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: ${props => props.$active ? colors.shadow : 'none'};
  
  &:hover {
    color: ${colors.textPrimary};
  }
`;

const StepList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  counter-reset: step;
`;

const Step = styled.li`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &::before {
    counter-increment: step;
    content: counter(step);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    padding-top: 0.25rem;
    
    .title {
      font-weight: 600;
      color: ${colors.textPrimary};
      margin-bottom: 0.375rem;
    }
    
    .description {
      color: ${colors.textSecondary};
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;

const ApiDocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copied, setCopied] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState('curl');

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'authentication', label: 'Authentication', icon: FiKey },
    { id: 'scrape', label: 'Scrape Endpoint', icon: FiGlobe },
    { id: 'response', label: 'Response Format', icon: FiCode },
    { id: 'security', label: 'Security Analysis', icon: FiShield },
    { id: 'rate-limits', label: 'Rate Limits', icon: FiZap },
    { id: 'errors', label: 'Error Handling', icon: FiTerminal },
    { id: 'examples', label: 'Code Examples', icon: FiPlay },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExamples = {
    curl: `curl -X POST http://webscrapper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{
    "url": "https://example.com"
  }'`,
    javascript: `const axios = require('axios');

async function scrapeWebsite(url) {
  const response = await axios.post(
    'http://webscrapper.live/api/scrape',
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
    console.log('Links found:', response.data.data.links.length);
    console.log('Security score:', response.data.data.security_report?.score);
  }
  
  return response.data;
}

// Usage
scrapeWebsite('https://example.com')
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
    python: `import requests

def scrape_website(url: str) -> dict:
    """Scrape a website using the WebScraper API."""
    
    api_url = 'http://webscrapper.live/api/scrape'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_api_key_here'
    }
    payload = {'url': url}
    
    response = requests.post(api_url, json=payload, headers=headers)
    response.raise_for_status()
    
    data = response.json()
    
    if data['success']:
        print(f"Title: {data['data']['title']}")
        print(f"Links found: {len(data['data']['links'])}")
        print(f"Security score: {data['data'].get('security_report', {}).get('score')}")
    
    return data

# Usage
if __name__ == '__main__':
    result = scrape_website('https://example.com')
    print(result)`,
    php: `<?php

function scrapeWebsite(string $url): array {
    $apiUrl = 'http://webscrapper.live/api/scrape';
    $apiKey = 'your_api_key_here';
    
    $ch = curl_init($apiUrl);
    
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['url' => $url]),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-API-Key: ' . $apiKey
        ],
        CURLOPT_RETURNTRANSFER => true
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if ($data['success']) {
        echo "Title: " . $data['data']['title'] . "\\n";
        echo "Links: " . count($data['data']['links']) . "\\n";
    }
    
    return $data;
}

// Usage
$result = scrapeWebsite('https://example.com');
print_r($result);`
  };

  return (
    <DocsContainer>
      <PageHeader>
        <PageTitle>
          <FiBook />
          API Documentation
        </PageTitle>
        <PageDescription>
          Complete reference guide for integrating the WebScraper API into your applications.
          Extract data, analyze security, and monitor network requests programmatically.
        </PageDescription>
        <QuickLinks>
          <QuickLink href="#authentication">
            <FiKey size={14} />
            Get API Key
          </QuickLink>
          <QuickLink href="#examples">
            <FiCode size={14} />
            View Examples
          </QuickLink>
          <QuickLink href="#" target="_blank">
            <FiExternalLink size={14} />
            Postman Collection
          </QuickLink>
        </QuickLinks>
      </PageHeader>

      <Layout>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Getting Started</SidebarTitle>
            {sections.slice(0, 2).map(section => (
              <NavItem
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                {section.label}
              </NavItem>
            ))}
          </SidebarSection>
          <SidebarSection>
            <SidebarTitle>Endpoints</SidebarTitle>
            {sections.slice(2, 5).map(section => (
              <NavItem
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                {section.label}
              </NavItem>
            ))}
          </SidebarSection>
          <SidebarSection>
            <SidebarTitle>Reference</SidebarTitle>
            {sections.slice(5).map(section => (
              <NavItem
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                {section.label}
              </NavItem>
            ))}
          </SidebarSection>
        </Sidebar>

        <Content>
          {activeSection === 'overview' && (
            <Section>
              <SectionTitle>
                <FiZap />
                Quick Start
              </SectionTitle>
              <SectionDescription>
                Get up and running with the WebScraper API in under 5 minutes.
              </SectionDescription>

              <Alert $type="success">
                <FiCheck className="icon" />
                <div className="content">
                  <div className="title">Base URL</div>
                  <div className="text">
                    All API requests should be made to: <InlineCode>http://webscrapper.live/api</InlineCode>
                  </div>
                </div>
              </Alert>

              <SubSection>
                <SubTitle>Getting Started</SubTitle>
                <StepList>
                  <Step>
                    <div className="content">
                      <div className="title">Create an Account</div>
                      <div className="description">
                        Sign up for a free account to access the dashboard and API features.
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <div className="content">
                      <div className="title">Generate an API Key</div>
                      <div className="description">
                        Navigate to the API Keys section in your dashboard and create a new key.
                      </div>
                    </div>
                  </Step>
                  <Step>
                    <div className="content">
                      <div className="title">Make Your First Request</div>
                      <div className="description">
                        Use your API key in the X-API-Key header to authenticate requests.
                      </div>
                    </div>
                  </Step>
                </StepList>
              </SubSection>

              <SubSection>
                <SubTitle>Features</SubTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Feature</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><strong>Full Page Scraping</strong></Td>
                      <Td>Extract title, meta tags, headings, links, images, and text content</Td>
                    </tr>
                    <tr>
                      <Td><strong>Screenshots</strong></Td>
                      <Td>Capture full-page screenshots in PNG format (Base64 encoded)</Td>
                    </tr>
                    <tr>
                      <Td><strong>Security Analysis</strong></Td>
                      <Td>HTTPS validation, security headers, and vulnerability scanning</Td>
                    </tr>
                    <tr>
                      <Td><strong>Network Monitoring</strong></Td>
                      <Td>Track all network requests, response times, and resource sizes</Td>
                    </tr>
                    <tr>
                      <Td><strong>Performance Metrics</strong></Td>
                      <Td>Page load times, DOM content loaded, and resource timing</Td>
                    </tr>
                  </tbody>
                </Table>
              </SubSection>
            </Section>
          )}

          {activeSection === 'authentication' && (
            <Section>
              <SectionTitle>
                <FiKey />
                Authentication
              </SectionTitle>
              <SectionDescription>
                All API requests require authentication using an API key.
              </SectionDescription>

              <Alert $type="info">
                <FiKey className="icon" />
                <div className="content">
                  <div className="title">API Key Required</div>
                  <div className="text">
                    Include your API key in every request using the <InlineCode>X-API-Key</InlineCode> header.
                  </div>
                </div>
              </Alert>

              <SubSection>
                <SubTitle>Header Format</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>HTTP Header</CodeLanguage>
                    <CopyButton 
                      $copied={copied === 'auth'}
                      onClick={() => copyToClipboard('X-API-Key: your_api_key_here', 'auth')}
                    >
                      {copied === 'auth' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                      {copied === 'auth' ? 'Copied!' : 'Copy'}
                    </CopyButton>
                  </CodeHeader>
                  <CodeContent>X-API-Key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</CodeContent>
                </CodeBlock>
              </SubSection>

              <SubSection>
                <SubTitle>Example Request</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>cURL</CodeLanguage>
                    <CopyButton 
                      $copied={copied === 'auth-example'}
                      onClick={() => copyToClipboard(`curl -X POST http://webscrapper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{"url": "https://example.com"}'`, 'auth-example')}
                    >
                      {copied === 'auth-example' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                      {copied === 'auth-example' ? 'Copied!' : 'Copy'}
                    </CopyButton>
                  </CodeHeader>
                  <CodeContent>{`curl -X POST http://webscrapper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{"url": "https://example.com"}'`}</CodeContent>
                </CodeBlock>
              </SubSection>

              <Alert $type="warning">
                <FiShield className="icon" />
                <div className="content">
                  <div className="title">Security Best Practices</div>
                  <div className="text">
                    Never expose your API key in client-side code, public repositories, or logs.
                    Use environment variables to store sensitive credentials.
                  </div>
                </div>
              </Alert>
            </Section>
          )}

          {activeSection === 'scrape' && (
            <Section>
              <SectionTitle>
                <FiGlobe />
                Scrape Endpoint
              </SectionTitle>
              <SectionDescription>
                The main endpoint for scraping and analyzing websites.
              </SectionDescription>

              <EndpointCard>
                <EndpointHeader>
                  <Badge $type="post">POST</Badge>
                  <EndpointPath>/api/scrape</EndpointPath>
                </EndpointHeader>
                <EndpointDescription>
                  Scrape a website and return comprehensive data including content, screenshots, security analysis, and performance metrics.
                </EndpointDescription>
              </EndpointCard>

              <SubSection>
                <SubTitle>Request Body</SubTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Parameter</Th>
                      <Th>Type</Th>
                      <Th>Status</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><InlineCode>url</InlineCode></Td>
                      <Td>string</Td>
                      <Td><Badge $type="required">Required</Badge></Td>
                      <Td>The complete URL to scrape (including https://)</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>screenshot</InlineCode></Td>
                      <Td>boolean</Td>
                      <Td><Badge $type="optional">Optional</Badge></Td>
                      <Td>Whether to capture a screenshot (default: true)</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>waitFor</InlineCode></Td>
                      <Td>number</Td>
                      <Td><Badge $type="optional">Optional</Badge></Td>
                      <Td>Additional wait time in ms after page load (default: 0)</Td>
                    </tr>
                  </tbody>
                </Table>
              </SubSection>

              <SubSection>
                <SubTitle>Request Example</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>JSON</CodeLanguage>
                    <CopyButton 
                      $copied={copied === 'request-body'}
                      onClick={() => copyToClipboard(`{
  "url": "https://example.com"
}`, 'request-body')}
                    >
                      {copied === 'request-body' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                      {copied === 'request-body' ? 'Copied!' : 'Copy'}
                    </CopyButton>
                  </CodeHeader>
                  <CodeContent>{`{
  "url": "https://example.com"
}`}</CodeContent>
                </CodeBlock>
              </SubSection>
            </Section>
          )}

          {activeSection === 'response' && (
            <Section>
              <SectionTitle>
                <FiCode />
                Response Format
              </SectionTitle>
              <SectionDescription>
                Understanding the response structure from the scrape endpoint.
              </SectionDescription>

              <SubSection>
                <SubTitle>Success Response</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>JSON</CodeLanguage>
                    <CopyButton 
                      $copied={copied === 'response'}
                      onClick={() => copyToClipboard(`{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example description",
    "headings": {
      "h1": ["Example Domain"],
      "h2": [],
      "h3": []
    },
    "links": [
      { "text": "More info", "href": "https://example.com/more" }
    ],
    "images": [
      { "src": "https://example.com/logo.png", "alt": "Logo" }
    ],
    "screenshot": "data:image/png;base64,iVBORw0KG...",
    "security_report": {
      "score": 85,
      "https": true,
      "headers": {...}
    },
    "network_requests": [...],
    "performance_metrics": {...},
    "console_logs": []
  }
}`, 'response')}
                    >
                      {copied === 'response' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                      {copied === 'response' ? 'Copied!' : 'Copy'}
                    </CopyButton>
                  </CodeHeader>
                  <CodeContent>{`{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example description",
    "headings": {
      "h1": ["Example Domain"],
      "h2": [],
      "h3": []
    },
    "links": [
      { "text": "More info", "href": "https://example.com/more" }
    ],
    "images": [
      { "src": "https://example.com/logo.png", "alt": "Logo" }
    ],
    "screenshot": "data:image/png;base64,iVBORw0KG...",
    "security_report": {
      "score": 85,
      "https": true,
      "headers": {...}
    },
    "network_requests": [...],
    "performance_metrics": {...},
    "console_logs": []
  }
}`}</CodeContent>
                </CodeBlock>
              </SubSection>

              <SubSection>
                <SubTitle>Response Fields</SubTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Field</Th>
                      <Th>Type</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><InlineCode>title</InlineCode></Td>
                      <Td>string</Td>
                      <Td>Page title from the title tag</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>description</InlineCode></Td>
                      <Td>string</Td>
                      <Td>Meta description content</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>headings</InlineCode></Td>
                      <Td>object</Td>
                      <Td>All H1-H6 headings organized by level</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>links</InlineCode></Td>
                      <Td>array</Td>
                      <Td>All anchor links with text and href</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>images</InlineCode></Td>
                      <Td>array</Td>
                      <Td>All images with src and alt text</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>screenshot</InlineCode></Td>
                      <Td>string</Td>
                      <Td>Base64 encoded PNG screenshot</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>security_report</InlineCode></Td>
                      <Td>object</Td>
                      <Td>Security analysis with score and findings</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>network_requests</InlineCode></Td>
                      <Td>array</Td>
                      <Td>All network requests made during page load</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>performance_metrics</InlineCode></Td>
                      <Td>object</Td>
                      <Td>Page performance timing data</Td>
                    </tr>
                  </tbody>
                </Table>
              </SubSection>
            </Section>
          )}

          {activeSection === 'security' && (
            <Section>
              <SectionTitle>
                <FiShield />
                Security Analysis
              </SectionTitle>
              <SectionDescription>
                Every scrape includes a comprehensive security report.
              </SectionDescription>

              <SubSection>
                <SubTitle>Security Report Structure</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>JSON</CodeLanguage>
                  </CodeHeader>
                  <CodeContent>{`{
  "security_report": {
    "score": 85,
    "https": true,
    "hsts": true,
    "content_security_policy": false,
    "x_frame_options": true,
    "x_content_type_options": true,
    "referrer_policy": true,
    "permissions_policy": false,
    "recommendations": [
      "Add Content-Security-Policy header",
      "Configure Permissions-Policy header"
    ]
  }
}`}</CodeContent>
                </CodeBlock>
              </SubSection>

              <SubSection>
                <SubTitle>Security Headers Checked</SubTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Header</Th>
                      <Th>Purpose</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><InlineCode>Strict-Transport-Security</InlineCode></Td>
                      <Td>Enforces HTTPS connections</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>Content-Security-Policy</InlineCode></Td>
                      <Td>Prevents XSS and injection attacks</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>X-Frame-Options</InlineCode></Td>
                      <Td>Prevents clickjacking</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>X-Content-Type-Options</InlineCode></Td>
                      <Td>Prevents MIME sniffing</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>Referrer-Policy</InlineCode></Td>
                      <Td>Controls referrer information</Td>
                    </tr>
                  </tbody>
                </Table>
              </SubSection>
            </Section>
          )}

          {activeSection === 'rate-limits' && (
            <Section>
              <SectionTitle>
                <FiZap />
                Rate Limits
              </SectionTitle>
              <SectionDescription>
                API rate limits are based on your subscription tier.
              </SectionDescription>

              <Table>
                <thead>
                  <tr>
                    <Th>Tier</Th>
                    <Th>Requests/Month</Th>
                    <Th>Rate Limit</Th>
                    <Th>Concurrent</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td><strong>Free</strong></Td>
                    <Td>1,000</Td>
                    <Td>10 req/min</Td>
                    <Td>1</Td>
                  </tr>
                  <tr>
                    <Td><strong>Pro</strong></Td>
                    <Td>10,000</Td>
                    <Td>60 req/min</Td>
                    <Td>5</Td>
                  </tr>
                  <tr>
                    <Td><strong>Enterprise</strong></Td>
                    <Td>Unlimited</Td>
                    <Td>Custom</Td>
                    <Td>Custom</Td>
                  </tr>
                </tbody>
              </Table>

              <Alert $type="info">
                <FiZap className="icon" />
                <div className="content">
                  <div className="title">Rate Limit Headers</div>
                  <div className="text">
                    Check <InlineCode>X-RateLimit-Remaining</InlineCode> and <InlineCode>X-RateLimit-Reset</InlineCode> 
                    headers in responses to track your usage.
                  </div>
                </div>
              </Alert>
            </Section>
          )}

          {activeSection === 'errors' && (
            <Section>
              <SectionTitle>
                <FiTerminal />
                Error Handling
              </SectionTitle>
              <SectionDescription>
                Understanding and handling API errors properly.
              </SectionDescription>

              <SubSection>
                <SubTitle>HTTP Status Codes</SubTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Code</Th>
                      <Th>Status</Th>
                      <Th>Description</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><InlineCode>200</InlineCode></Td>
                      <Td>OK</Td>
                      <Td>Request successful</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>400</InlineCode></Td>
                      <Td>Bad Request</Td>
                      <Td>Invalid request parameters</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>401</InlineCode></Td>
                      <Td>Unauthorized</Td>
                      <Td>Invalid or missing API key</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>403</InlineCode></Td>
                      <Td>Forbidden</Td>
                      <Td>API key lacks required permissions</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>429</InlineCode></Td>
                      <Td>Too Many Requests</Td>
                      <Td>Rate limit exceeded</Td>
                    </tr>
                    <tr>
                      <Td><InlineCode>500</InlineCode></Td>
                      <Td>Server Error</Td>
                      <Td>Internal server error</Td>
                    </tr>
                  </tbody>
                </Table>
              </SubSection>

              <SubSection>
                <SubTitle>Error Response Format</SubTitle>
                <CodeBlock>
                  <CodeHeader>
                    <CodeLanguage>JSON</CodeLanguage>
                  </CodeHeader>
                  <CodeContent>{`{
  "success": false,
  "error": "Invalid URL provided",
  "code": "INVALID_URL",
  "details": "URL must start with http:// or https://"
}`}</CodeContent>
                </CodeBlock>
              </SubSection>
            </Section>
          )}

          {activeSection === 'examples' && (
            <Section>
              <SectionTitle>
                <FiPlay />
                Code Examples
              </SectionTitle>
              <SectionDescription>
                Ready-to-use code examples in multiple programming languages.
              </SectionDescription>

              <Tabs>
                <Tab $active={codeTab === 'curl'} onClick={() => setCodeTab('curl')}>cURL</Tab>
                <Tab $active={codeTab === 'javascript'} onClick={() => setCodeTab('javascript')}>JavaScript</Tab>
                <Tab $active={codeTab === 'python'} onClick={() => setCodeTab('python')}>Python</Tab>
                <Tab $active={codeTab === 'php'} onClick={() => setCodeTab('php')}>PHP</Tab>
              </Tabs>

              <CodeBlock>
                <CodeHeader>
                  <CodeLanguage>{codeTab}</CodeLanguage>
                  <CopyButton 
                    $copied={copied === 'code-example'}
                    onClick={() => copyToClipboard(codeExamples[codeTab as keyof typeof codeExamples], 'code-example')}
                  >
                    {copied === 'code-example' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                    {copied === 'code-example' ? 'Copied!' : 'Copy'}
                  </CopyButton>
                </CodeHeader>
                <CodeContent>{codeExamples[codeTab as keyof typeof codeExamples]}</CodeContent>
              </CodeBlock>

              <Alert $type="success">
                <FiCheck className="icon" />
                <div className="content">
                  <div className="title">Need More Examples?</div>
                  <div className="text">
                    Check out our GitHub repository for more examples including TypeScript, Go, Ruby, and more.
                  </div>
                </div>
              </Alert>
            </Section>
          )}
        </Content>
      </Layout>
    </DocsContainer>
  );
};

export default ApiDocsPage;
