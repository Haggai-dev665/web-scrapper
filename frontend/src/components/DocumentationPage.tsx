import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useToast } from './Toast';

const DocumentationContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  
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

const Section = styled.section`
  background: ${colors.background};
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
`;

const SectionTitle = styled.h2`
  color: ${colors.textPrimary};
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${colors.primary};
    border-radius: 2px;
  }
`;

const CodeBlock = styled.div`
  position: relative;
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Code = styled.pre`
  margin: 0;
  color: #e2e8f0;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
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

const EndpointCard = styled.div`
  background: ${colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  border-left: 4px solid ${colors.primary};
`;

const EndpointMethod = styled.span<{ method: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: 0.75rem;
  background: ${props => {
    switch (props.method) {
      case 'GET': return '#10B981';
      case 'POST': return '#3B82F6';
      case 'PUT': return '#F59E0B';
      case 'DELETE': return '#EF4444';
      default: return colors.textMuted;
    }
  }};
  color: white;
`;

const EndpointPath = styled.code`
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 1rem;
  color: ${colors.textPrimary};
  font-weight: 500;
`;

const EndpointDescription = styled.p`
  margin: 1rem 0 0 0;
  color: ${colors.textSecondary};
  line-height: 1.6;
`;

const ParameterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  background: ${colors.backgroundTertiary};
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 0.875rem;
  border-bottom: 2px solid ${colors.border};
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.border};
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const InlineCode = styled.code`
  background: ${colors.backgroundTertiary};
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  color: ${colors.primary};
`;

const DocumentationPage: React.FC = () => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    showToast({
      type: 'success',
      title: 'Copied!',
      message: 'Code copied to clipboard'
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlExample = `curl -X POST https://api.webscraper.com/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"url": "https://example.com"}'`;

  const javascriptExample = `const response = await fetch('https://api.webscraper.com/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const data = await response.json();
console.log(data);`;

  const pythonExample = `import requests

response = requests.post(
    'https://api.webscraper.com/api/scrape',
    headers={'x-api-key': 'YOUR_API_KEY'},
    json={'url': 'https://example.com'}
)

data = response.json()
print(data)`;

  return (
    <DocumentationContainer>
      <PageHeader>
        <PageTitle>📚 API Documentation</PageTitle>
        <PageDescription>
          Complete guide to integrating and using the Web Scraper API
        </PageDescription>
      </PageHeader>

      <Section>
        <SectionTitle>Authentication</SectionTitle>
        <p style={{ color: colors.textSecondary, lineHeight: 1.6 }}>
          All API requests require authentication using an API key. Include your API key in the{' '}
          <InlineCode>x-api-key</InlineCode> header with every request.
        </p>
        
        <CodeBlock>
          <CopyButton onClick={() => copyToClipboard(curlExample, 'curl')}>
            {copiedCode === 'curl' ? <FiCheck /> : <FiCopy />}
            {copiedCode === 'curl' ? 'Copied' : 'Copy'}
          </CopyButton>
          <Code>{curlExample}</Code>
        </CodeBlock>
      </Section>

      <Section>
        <SectionTitle>Endpoints</SectionTitle>
        
        <EndpointCard>
          <div>
            <EndpointMethod method="POST">POST</EndpointMethod>
            <EndpointPath>/api/scrape</EndpointPath>
          </div>
          <EndpointDescription>
            Scrape data from a website URL. Returns structured data including HTML content, metadata, and extracted information.
          </EndpointDescription>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: colors.textPrimary }}>
            Request Body
          </h4>
          <ParameterTable>
            <thead>
              <tr>
                <TableHeader>Parameter</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Required</TableHeader>
                <TableHeader>Description</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell><InlineCode>url</InlineCode></TableCell>
                <TableCell>string</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>The URL of the website to scrape</TableCell>
              </tr>
            </tbody>
          </ParameterTable>
        </EndpointCard>

        <EndpointCard>
          <div>
            <EndpointMethod method="GET">GET</EndpointMethod>
            <EndpointPath>/api/analytics/usage</EndpointPath>
          </div>
          <EndpointDescription>
            Get usage analytics for your account including request counts, success rates, and performance metrics.
          </EndpointDescription>
        </EndpointCard>

        <EndpointCard>
          <div>
            <EndpointMethod method="GET">GET</EndpointMethod>
            <EndpointPath>/api/keys</EndpointPath>
          </div>
          <EndpointDescription>
            List all API keys associated with your account.
          </EndpointDescription>
        </EndpointCard>
      </Section>

      <Section>
        <SectionTitle>Code Examples</SectionTitle>
        
        <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: colors.textPrimary }}>
          JavaScript / Node.js
        </h3>
        <CodeBlock>
          <CopyButton onClick={() => copyToClipboard(javascriptExample, 'js')}>
            {copiedCode === 'js' ? <FiCheck /> : <FiCopy />}
            {copiedCode === 'js' ? 'Copied' : 'Copy'}
          </CopyButton>
          <Code>{javascriptExample}</Code>
        </CodeBlock>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: colors.textPrimary }}>
          Python
        </h3>
        <CodeBlock>
          <CopyButton onClick={() => copyToClipboard(pythonExample, 'python')}>
            {copiedCode === 'python' ? <FiCheck /> : <FiCopy />}
            {copiedCode === 'python' ? 'Copied' : 'Copy'}
          </CopyButton>
          <Code>{pythonExample}</Code>
        </CodeBlock>
      </Section>

      <Section>
        <SectionTitle>Rate Limits</SectionTitle>
        <p style={{ color: colors.textSecondary, lineHeight: 1.6, marginBottom: '1rem' }}>
          API requests are rate-limited based on your subscription tier:
        </p>
        <ParameterTable>
          <thead>
            <tr>
              <TableHeader>Tier</TableHeader>
              <TableHeader>Requests per Hour</TableHeader>
              <TableHeader>Monthly Limit</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>Free</TableCell>
              <TableCell>100</TableCell>
              <TableCell>1,000</TableCell>
            </tr>
            <tr>
              <TableCell>Pro</TableCell>
              <TableCell>1,000</TableCell>
              <TableCell>50,000</TableCell>
            </tr>
            <tr>
              <TableCell>Enterprise</TableCell>
              <TableCell>10,000</TableCell>
              <TableCell>Unlimited</TableCell>
            </tr>
          </tbody>
        </ParameterTable>
      </Section>

      <Section>
        <SectionTitle>Response Format</SectionTitle>
        <p style={{ color: colors.textSecondary, lineHeight: 1.6 }}>
          All successful API responses return JSON with the following structure:
        </p>
        <CodeBlock>
          <Code>{`{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "html": "<!DOCTYPE html>...",
    "metadata": {
      "description": "...",
      "keywords": "..."
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}`}</Code>
        </CodeBlock>
      </Section>
    </DocumentationContainer>
  );
};

export default DocumentationPage;
