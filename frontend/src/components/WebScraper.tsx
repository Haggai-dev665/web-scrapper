import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Types
interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  response_time_ms: number;
  size_bytes: number;
  content_type: string;
  headers: Record<string, string>;
}

interface SecurityAnalysis {
  https: boolean;
  security_headers: Record<string, string>;
  mixed_content: boolean;
  insecure_forms: boolean;
  third_party_requests: string[];
  cookies_secure: boolean;
  risk_level: string;
  recommendations: string[];
}

interface PerformanceMetrics {
  total_load_time_ms: number;
  dom_ready_time_ms: number;
  first_paint_ms: number;
  largest_contentful_paint_ms: number;
  cumulative_layout_shift: number;
  total_requests: number;
  total_size_kb: number;
}

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
  text_content: string;
  word_frequency: Record<string, number>;
  reading_time_minutes: number;
  readability_score: number;
  language: string;
  social_media_links: LinkInfo[];
  page_size_kb: number;
  network_requests: NetworkRequest[];
  security_analysis: SecurityAnalysis;
  performance_metrics: PerformanceMetrics;
  console_logs: string[];
  cookies: Record<string, string>;
  response_headers: Record<string, string>;
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0px);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #059669);
  }
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

const TabContainer = styled.div`
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#1e1e1e' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid ${props => props.active ? '#1e1e1e' : 'transparent'};
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? '#1e1e1e' : '#f3f4f6'};
    color: ${props => props.active ? '#ffffff' : '#1e1e1e'};
  }
`;

const WordCloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const WordBubble = styled.span<{ size: number }>`
  display: inline-block;
  background: linear-gradient(135deg, #1e1e1e, #2d2d2d);
  color: white;
  padding: ${props => Math.max(4, props.size * 2)}px ${props => Math.max(8, props.size * 4)}px;
  border-radius: 20px;
  font-size: ${props => Math.max(0.7, props.size)}rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProgressBar = styled.div<{ percentage: number; color: string }>`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.percentage}%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const Card = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #1e1e1e;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const ImageCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }
`;

const StatusIndicator = styled.div<{ status: 'good' | 'medium' | 'poor' }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${props => {
    switch (props.status) {
      case 'good': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const WebScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getReadabilityStatus = (score: number): 'good' | 'medium' | 'poor' => {
    if (score >= 60) return 'good';
    if (score >= 30) return 'medium';
    return 'poor';
  };

  const getReadabilityLabel = (score: number): string => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const exportResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `scrape-${new URL(result.url).hostname}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getTopWords = (wordFreq: Record<string, number>, count: number = 20) => {
    return Object.entries(wordFreq)
      .filter(([word]) => word.length > 3) // Filter out short words
      .sort(([,a], [,b]) => b - a)
      .slice(0, count);
  };

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <SiteTitle>{result.title}</SiteTitle>
                <SiteURL>{result.url}</SiteURL>
              </div>
              <ExportButton onClick={exportResults}>
                📊 Export Data
              </ExportButton>
            </div>
          </SuccessHeader>

          <MetricsRow>
            <MetricCard>
              <MetricValue>{result.word_count?.toLocaleString() || 0}</MetricValue>
              <MetricLabel>Words</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.reading_time_minutes?.toFixed(1) || 0}min</MetricValue>
              <MetricLabel>Reading Time</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>
                <StatusIndicator status={getReadabilityStatus(result.readability_score || 0)} />
                {result.readability_score?.toFixed(0) || 0}
              </MetricValue>
              <MetricLabel>{getReadabilityLabel(result.readability_score || 0)}</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.links?.length || 0}</MetricValue>
              <MetricLabel>Links</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.images?.length || 0}</MetricValue>
              <MetricLabel>Images</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{result.page_size_kb?.toFixed(1) || 0}KB</MetricValue>
              <MetricLabel>Page Size</MetricLabel>
            </MetricCard>
          </MetricsRow>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                📊 Overview
              </Tab>
              <Tab active={activeTab === 'content'} onClick={() => setActiveTab('content')}>
                📝 Content Analysis
              </Tab>
              <Tab active={activeTab === 'links'} onClick={() => setActiveTab('links')}>
                🔗 Links ({result.links?.length || 0})
              </Tab>
              <Tab active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
                🖼️ Media ({result.images?.length || 0})
              </Tab>
              <Tab active={activeTab === 'seo'} onClick={() => setActiveTab('seo')}>
                🎯 SEO & Meta
              </Tab>
              <Tab active={activeTab === 'network'} onClick={() => setActiveTab('network')}>
                🌐 Network ({result.network_requests?.length || 0})
              </Tab>
              <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
                🔒 Security Analysis
              </Tab>
              <Tab active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
                ⚡ Performance
              </Tab>
              <Tab active={activeTab === 'console'} onClick={() => setActiveTab('console')}>
                📋 Console ({result.console_logs?.length || 0})
              </Tab>
            </TabList>
          </TabContainer>

          {activeTab === 'overview' && (
            <>
              <Section>
                <SectionTitle>Page Description</SectionTitle>
                <Description>{result.description || 'No description available'}</Description>
              </Section>

              {result.word_frequency && (
                <Section>
                  <SectionTitle>Top Keywords</SectionTitle>
                  <WordCloudContainer>
                    {getTopWords(result.word_frequency, 15).map(([word, count], index) => (
                      <WordBubble 
                        key={word} 
                        size={Math.min(1.5, 0.8 + (count / Math.max(...Object.values(result.word_frequency))) * 0.7)}
                        title={`${word}: ${count} occurrences`}
                      >
                        {word} ({count})
                      </WordBubble>
                    ))}
                  </WordCloudContainer>
                </Section>
              )}

              <GridContainer>
                <Card>
                  <CardTitle>📊 Content Metrics</CardTitle>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Language:</strong> {result.language || 'Unknown'}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Response Time:</strong> {result.response_time_ms}ms
                  </div>
                  <div>
                    <strong>Readability Score:</strong>
                    <ProgressBar 
                      percentage={result.readability_score || 0} 
                      color={getReadabilityStatus(result.readability_score || 0) === 'good' ? '#10b981' : 
                             getReadabilityStatus(result.readability_score || 0) === 'medium' ? '#f59e0b' : '#ef4444'}
                    />
                    {getReadabilityLabel(result.readability_score || 0)} ({result.readability_score?.toFixed(1) || 0})
                  </div>
                </Card>

                <Card>
                  <CardTitle>🔗 Link Analysis</CardTitle>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Total Links:</strong> {result.links?.length || 0}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>External Links:</strong> {result.links?.filter(l => l.is_external).length || 0}
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Internal Links:</strong> {result.links?.filter(l => !l.is_external).length || 0}
                  </div>
                  <div>
                    <strong>Social Media:</strong> {result.social_media_links?.length || 0}
                  </div>
                </Card>
              </GridContainer>
            </>
          )}

          {activeTab === 'content' && (
            <>
              {result.headings && result.headings.length > 0 && (
                <Section>
                  <SectionTitle>Page Structure ({result.headings.length})</SectionTitle>
                  <ListContainer>
                    {result.headings.map((heading, index) => (
                      <ListItem key={index}>{heading}</ListItem>
                    ))}
                  </ListContainer>
                </Section>
              )}

              {result.word_frequency && (
                <Section>
                  <SectionTitle>Word Frequency Analysis</SectionTitle>
                  <ListContainer>
                    {getTopWords(result.word_frequency, 50).map(([word, count]) => (
                      <ListItem key={word} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{word}</span>
                        <span style={{ fontWeight: 'bold', color: '#1e1e1e' }}>{count}</span>
                      </ListItem>
                    ))}
                  </ListContainer>
                </Section>
              )}
            </>
          )}

          {activeTab === 'links' && result.links && result.links.length > 0 && (
            <Section>
              <SectionTitle>All Links ({result.links.length})</SectionTitle>
              <ListContainer>
                {result.links.map((link, index) => (
                  <ListItem key={index}>
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.text || link.href}
                    </Link>
                    {link.is_external && <ExternalBadge>External</ExternalBadge>}
                  </ListItem>
                ))}
              </ListContainer>
            </Section>
          )}

          {activeTab === 'media' && result.images && result.images.length > 0 && (
            <Section>
              <SectionTitle>Images & Media ({result.images.length})</SectionTitle>
              <ImageGrid>
                {result.images.slice(0, 12).map((image, index) => (
                  <ImageCard key={index}>
                    <ImagePreview 
                      src={image.src} 
                      alt={image.alt || 'Image'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', wordBreak: 'break-all' }}>
                      <strong>Alt:</strong> {image.alt || 'No alt text'}
                    </div>
                    {(image.width || image.height) && (
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                        {image.width}×{image.height}
                      </div>
                    )}
                  </ImageCard>
                ))}
              </ImageGrid>
              {result.images.length > 12 && (
                <div style={{ fontStyle: 'italic', color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>
                  ... and {result.images.length - 12} more images
                </div>
              )}
            </Section>
          )}

          {activeTab === 'seo' && (
            <Section>
              <SectionTitle>SEO & Meta Information</SectionTitle>
              {result.meta_tags && Object.keys(result.meta_tags).length > 0 ? (
                <ListContainer>
                  {Object.entries(result.meta_tags).map(([name, content]) => (
                    <ListItem key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong style={{ color: '#1e1e1e' }}>{name}</strong>
                      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{content}</span>
                    </ListItem>
                  ))}
                </ListContainer>
              ) : (
                <Description>No meta tags found</Description>
              )}
            </Section>
          )}

          {activeTab === 'network' && result.network_requests && (
            <Section>
              <SectionTitle>Network Requests Analysis</SectionTitle>
              {result.network_requests.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <MetricsRow>
                      <MetricCard>
                        <MetricValue>{result.network_requests.length}</MetricValue>
                        <MetricLabel>Total Requests</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{(result.network_requests.reduce((sum, req) => sum + req.size_bytes, 0) / 1024).toFixed(1)}KB</MetricValue>
                        <MetricLabel>Total Size</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{result.network_requests.filter(req => req.status >= 400).length}</MetricValue>
                        <MetricLabel>Failed Requests</MetricLabel>
                      </MetricCard>
                    </MetricsRow>
                  </div>
                  <ListContainer>
                    {result.network_requests.map((request, index) => (
                      <ListItem key={index} style={{ borderLeft: `3px solid ${request.status >= 400 ? '#ef4444' : request.status >= 300 ? '#f59e0b' : '#10b981'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#1e1e1e', flex: 1, marginRight: '1rem' }}>{request.method} {request.url}</strong>
                          <span style={{ 
                            color: request.status >= 400 ? '#ef4444' : request.status >= 300 ? '#f59e0b' : '#10b981',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {request.status}
                          </span>
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                          <div>Type: {request.content_type}</div>
                          <div>Size: {(request.size_bytes / 1024).toFixed(2)}KB</div>
                          <div>Time: {request.response_time_ms}ms</div>
                          {Object.keys(request.headers).length > 0 && (
                            <details style={{ marginTop: '0.5rem' }}>
                              <summary style={{ cursor: 'pointer', color: '#4f46e5' }}>Headers ({Object.keys(request.headers).length})</summary>
                              <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                                {Object.entries(request.headers).map(([key, value]) => (
                                  <div key={key} style={{ marginBottom: '0.25rem' }}>
                                    <strong>{key}:</strong> {value}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              ) : (
                <Description>No network requests captured</Description>
              )}
            </Section>
          )}

          {activeTab === 'security' && result.security_analysis && (
            <Section>
              <SectionTitle>Security Analysis</SectionTitle>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px',
                  backgroundColor: result.security_analysis.risk_level === 'low' ? '#dcfce7' : 
                                  result.security_analysis.risk_level === 'medium' ? '#fef3c7' : '#fee2e2',
                  color: result.security_analysis.risk_level === 'low' ? '#166534' : 
                         result.security_analysis.risk_level === 'medium' ? '#92400e' : '#991b1b',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  {result.security_analysis.risk_level === 'low' ? '🟢' : 
                   result.security_analysis.risk_level === 'medium' ? '🟡' : '🔴'} 
                  Risk Level: {result.security_analysis.risk_level.toUpperCase()}
                </div>

                <MetricsRow>
                  <MetricCard>
                    <MetricValue>{result.security_analysis.https ? '✅' : '❌'}</MetricValue>
                    <MetricLabel>HTTPS</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{result.security_analysis.cookies_secure ? '✅' : '❌'}</MetricValue>
                    <MetricLabel>Secure Cookies</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{result.security_analysis.mixed_content ? '❌' : '✅'}</MetricValue>
                    <MetricLabel>No Mixed Content</MetricLabel>
                  </MetricCard>
                  <MetricCard>
                    <MetricValue>{result.security_analysis.insecure_forms ? '❌' : '✅'}</MetricValue>
                    <MetricLabel>Secure Forms</MetricLabel>
                  </MetricCard>
                </MetricsRow>
              </div>

              {result.security_analysis.security_headers && Object.keys(result.security_analysis.security_headers).length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Security Headers</h4>
                  <ListContainer>
                    {Object.entries(result.security_analysis.security_headers).map(([header, value]) => (
                      <ListItem key={header} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ color: '#1e1e1e' }}>{header}</strong>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{value}</span>
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              )}

              {result.security_analysis.third_party_requests && result.security_analysis.third_party_requests.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Third-Party Requests ({result.security_analysis.third_party_requests.length})</h4>
                  <ListContainer>
                    {result.security_analysis.third_party_requests.map((domain, index) => (
                      <ListItem key={index}>
                        <span style={{ color: '#f59e0b' }}>⚠️</span> {domain}
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              )}

              {result.security_analysis.recommendations && result.security_analysis.recommendations.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Security Recommendations</h4>
                  <ListContainer>
                    {result.security_analysis.recommendations.map((rec, index) => (
                      <ListItem key={index} style={{ color: '#dc2626' }}>
                        <span style={{ color: '#dc2626' }}>🔧</span> {rec}
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              )}
            </Section>
          )}

          {activeTab === 'performance' && result.performance_metrics && (
            <Section>
              <SectionTitle>Performance Metrics</SectionTitle>
              <MetricsRow>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.total_load_time_ms}ms</MetricValue>
                  <MetricLabel>Total Load Time</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.dom_ready_time_ms}ms</MetricValue>
                  <MetricLabel>DOM Ready</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.first_paint_ms}ms</MetricValue>
                  <MetricLabel>First Paint</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.largest_contentful_paint_ms}ms</MetricValue>
                  <MetricLabel>LCP</MetricLabel>
                </MetricCard>
              </MetricsRow>
              <MetricsRow>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.cumulative_layout_shift.toFixed(3)}</MetricValue>
                  <MetricLabel>CLS Score</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.total_requests}</MetricValue>
                  <MetricLabel>Total Requests</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{result.performance_metrics.total_size_kb.toFixed(1)}KB</MetricValue>
                  <MetricLabel>Total Size</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>
                    {result.performance_metrics.first_paint_ms < 1000 ? '🟢' : 
                     result.performance_metrics.first_paint_ms < 2500 ? '🟡' : '🔴'}
                  </MetricValue>
                  <MetricLabel>Performance</MetricLabel>
                </MetricCard>
              </MetricsRow>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Performance Insights</h4>
                <ListContainer>
                  <ListItem>
                    <strong>Load Time Assessment:</strong> {
                      result.performance_metrics.total_load_time_ms < 2000 ? 'Excellent - Very fast loading' :
                      result.performance_metrics.total_load_time_ms < 4000 ? 'Good - Acceptable loading speed' :
                      result.performance_metrics.total_load_time_ms < 8000 ? 'Average - Could be improved' :
                      'Poor - Significant optimization needed'
                    }
                  </ListItem>
                  <ListItem>
                    <strong>CLS Assessment:</strong> {
                      result.performance_metrics.cumulative_layout_shift < 0.1 ? 'Excellent - Minimal layout shifts' :
                      result.performance_metrics.cumulative_layout_shift < 0.25 ? 'Good - Some layout shifts' :
                      'Poor - Significant layout instability'
                    }
                  </ListItem>
                  <ListItem>
                    <strong>Request Efficiency:</strong> {
                      result.performance_metrics.total_requests < 50 ? 'Excellent - Minimal requests' :
                      result.performance_metrics.total_requests < 100 ? 'Good - Reasonable request count' :
                      'Poor - Too many requests, consider optimization'
                    }
                  </ListItem>
                </ListContainer>
              </div>
            </Section>
          )}

          {activeTab === 'console' && result.console_logs && (
            <Section>
              <SectionTitle>Console Messages</SectionTitle>
              {result.console_logs.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Captured {result.console_logs.length} console message(s) during page load
                  </div>
                  <ListContainer>
                    {result.console_logs.map((log, index) => (
                      <ListItem key={index} style={{ 
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                        backgroundColor: '#f8fafc',
                        borderLeft: `3px solid ${log.includes('Error') || log.includes('error') ? '#ef4444' : 
                                                 log.includes('Warning') || log.includes('warn') ? '#f59e0b' : '#10b981'}`
                      }}>
                        {log}
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              ) : (
                <Description>No console messages captured</Description>
              )}
              
              {result.cookies && Object.keys(result.cookies).length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Cookies ({Object.keys(result.cookies).length})</h4>
                  <ListContainer>
                    {Object.entries(result.cookies).map(([name, value]) => (
                      <ListItem key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ color: '#1e1e1e' }}>{name}</strong>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem', wordBreak: 'break-all' }}>{value}</span>
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              )}

              {result.response_headers && Object.keys(result.response_headers).length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Response Headers</h4>
                  <ListContainer>
                    {Object.entries(result.response_headers).map(([header, value]) => (
                      <ListItem key={header} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ color: '#1e1e1e' }}>{header}</strong>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{value}</span>
                      </ListItem>
                    ))}
                  </ListContainer>
                </div>
              )}
            </Section>
          )}
        </ResultsContainer>
      )}
    </ScraperContainer>
  );
};

export default WebScraper;