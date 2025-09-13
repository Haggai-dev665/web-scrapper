import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Types
interface ScrapedData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  links: LinkInfo[];
  images: ImageInfo[];
  meta_tags: Record<string, string>;
  screenshot?: string;
  word_count: number;
  response_time_ms: number;
}

interface LinkInfo {
  text: string;
  href: string;
  is_external: boolean;
}

interface ImageInfo {
  alt: string;
  src: string;
  width?: string;
  height?: string;
}

interface ScrapeResponse {
  success: boolean;
  data?: ScrapedData;
  error?: string;
}

// Styled Components
const ScraperContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const InputSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e1e1e;
  font-size: 0.9rem;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1e1e1e;
    box-shadow: 0 0 0 3px rgba(30, 30, 30, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ScrapeButton = styled.button`
  padding: 0.75rem 2rem;
  background: #1e1e1e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  
  &:hover:not(:disabled) {
    background: #2d2d2d;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ResultsContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  color: #991b1b;
  margin-top: 1rem;
`;

const SuccessHeader = styled.div`
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
`;

const SiteTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #1e1e1e;
  font-size: 1.5rem;
`;

const SiteURL = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const MetricCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1e1e1e;
  font-size: 1.2rem;
  border-bottom: 2px solid #1e1e1e;
  padding-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 1rem 0;
`;

const ListContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
`;

const ListItem = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Link = styled.a`
  color: #1e1e1e;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExternalBadge = styled.span`
  background: #1e1e1e;
  color: #ffffff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

const WebScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<ScrapeResponse>('http://localhost:8080/api/scrape', {
        url: url.trim()
      });

      if (response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        setError(response.data.error || 'Failed to scrape website');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleScrape();
    }
  };

  return (
    <ScraperContainer>
      <InputSection>
        <InputGroup>
          <InputWrapper>
            <Label htmlFor="url-input">Website URL</Label>
            <URLInput
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com"
              disabled={loading}
            />
          </InputWrapper>
          <ScrapeButton onClick={handleScrape} disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? 'Scraping...' : 'Scrape & Analyze'}
          </ScrapeButton>
        </InputGroup>
      </InputSection>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {result && (
        <ResultsContainer>
          <SuccessHeader>
            <SiteTitle>{result.title}</SiteTitle>
            <SiteURL>{result.url}</SiteURL>
          </SuccessHeader>

          <MetricsRow>
            <MetricCard>
              <MetricValue>{result.word_count.toLocaleString()}</MetricValue>
              <MetricLabel>Words</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.links.length}</MetricValue>
              <MetricLabel>Links</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.images.length}</MetricValue>
              <MetricLabel>Images</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.response_time_ms}ms</MetricValue>
              <MetricLabel>Response Time</MetricLabel>
            </MetricCard>
          </MetricsRow>

          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{result.description}</Description>
          </Section>

          {result.headings.length > 0 && (
            <Section>
              <SectionTitle>Headings ({result.headings.length})</SectionTitle>
              <ListContainer>
                {result.headings.map((heading, index) => (
                  <ListItem key={index}>{heading}</ListItem>
                ))}
              </ListContainer>
            </Section>
          )}

          {result.links.length > 0 && (
            <Section>
              <SectionTitle>Links ({result.links.length})</SectionTitle>
              <ListContainer>
                {result.links.slice(0, 50).map((link, index) => (
                  <ListItem key={index}>
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.text || link.href}
                    </Link>
                    {link.is_external && <ExternalBadge>External</ExternalBadge>}
                  </ListItem>
                ))}
                {result.links.length > 50 && (
                  <ListItem style={{ fontStyle: 'italic', color: '#6b7280' }}>
                    ... and {result.links.length - 50} more links
                  </ListItem>
                )}
              </ListContainer>
            </Section>
          )}

          {result.images.length > 0 && (
            <Section>
              <SectionTitle>Images ({result.images.length})</SectionTitle>
              <ListContainer>
                {result.images.slice(0, 20).map((image, index) => (
                  <ListItem key={index}>
                    <Link href={image.src} target="_blank" rel="noopener noreferrer">
                      {image.alt || 'Image'} - {image.src}
                    </Link>
                  </ListItem>
                ))}
                {result.images.length > 20 && (
                  <ListItem style={{ fontStyle: 'italic', color: '#6b7280' }}>
                    ... and {result.images.length - 20} more images
                  </ListItem>
                )}
              </ListContainer>
            </Section>
          )}
        </ResultsContainer>
      )}
    </ScraperContainer>
  );
};

export default WebScraper;