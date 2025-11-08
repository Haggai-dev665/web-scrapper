import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import Loader from './Loader';

// Modern Color Palette
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

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

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

interface SecurityReport {
  isHttps?: boolean;  // camelCase from backend
  is_https?: boolean;  // snake_case legacy
  mixedContent?: boolean;
  mixed_content?: boolean;
  missingSecurityHeaders?: string[];
  missing_security_headers?: string[];
  insecureCookies?: boolean;
  insecure_cookies?: boolean;
  csp?: string;
  notes?: string[];
}

interface PerformanceMetrics {
  total_load_time_ms?: number;
  dom_ready_time_ms?: number;
  first_paint_ms?: number;
  firstPaint?: number;  // camelCase
  largest_contentful_paint_ms?: number;
  cumulative_layout_shift?: number;
  total_requests?: number;
  totalResources?: number;
  total_size_kb?: number;
  // Add more camelCase fields from backend
  domContentLoaded?: number;
  loadComplete?: number;
  dnsLookup?: number;
  tcpConnection?: number;
}

interface ScrapedData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  links: LinkInfo[];
  images: ImageInfo[];
  meta_tags?: Record<string, string>;
  metaTags?: Record<string, string>;  // camelCase
  screenshot?: string;
  word_count?: number;
  wordCount?: number;  // camelCase
  response_time_ms?: number;
  responseTimeMs?: number;  // camelCase
  text_content?: string;
  textContent?: string;  // camelCase
  word_frequency?: Record<string, number>;
  wordFrequency?: Record<string, number>;  // camelCase
  reading_time_minutes?: number;
  readingTimeMinutes?: number;  // camelCase
  readability_score?: number;
  readabilityScore?: number;  // camelCase
  language?: string;
  social_media_links?: LinkInfo[];
  socialMediaLinks?: LinkInfo[];  // camelCase
  page_size_kb?: number;
  pageSizeKb?: number;  // camelCase
  network_requests?: NetworkRequest[];
  networkRequests?: NetworkRequest[];  // camelCase
  network_resources?: any[];
  networkResources?: any[];  // camelCase - IMPORTANT!
  console_logs?: any[];
  consoleLogs?: any[];  // camelCase - IMPORTANT!
  security_analysis?: SecurityAnalysis;
  security_report?: SecurityReport;
  securityReport?: SecurityReport;  // camelCase - IMPORTANT!
  performance_metrics?: PerformanceMetrics;
  performanceMetrics?: any;  // camelCase
  cookies?: any[];
  response_headers?: Record<string, string>;
  responseHeaders?: Record<string, string>;  // camelCase
  rendered_html?: string;
  renderedHtml?: string;  // camelCase
  // NEW FIELDS from advanced scraper
  forms?: any[];
  scripts?: any[];
  stylesheets?: any[];
  iframes?: any[];
  technologies?: string[];
  crawledLinks?: any[];
  localStorage?: Record<string, string>;
  sessionStorage?: Record<string, string>;
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
  padding: 0;
  background: ${colors.backgroundSecondary};
  min-height: calc(100vh - 140px);
  color: ${colors.textPrimary};
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
  }
  
  p {
    font-size: 1rem;
    color: ${colors.textSecondary};
    margin: 0;
    line-height: 1.5;
  }
`;

const InputSection = styled.div`
  background: ${colors.background};
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${colors.shadowLg};
  margin-bottom: 2rem;
  border: 1px solid ${colors.border};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.info} 50%, ${colors.success} 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 1.5rem 0;
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

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid ${colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.background};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    background-color: ${colors.backgroundTertiary};
    cursor: not-allowed;
    opacity: 0.6;
    border-color: ${colors.borderLight};
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const APIKeySelect = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid ${colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.background};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    background-color: ${colors.backgroundTertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ScrapeButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  box-shadow: ${colors.shadowMd};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${colors.shadowLg};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0px);
  }
  
  &:disabled {
    background: ${colors.textMuted};
    cursor: not-allowed;
    transform: none;
    box-shadow: ${colors.shadow};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ResultsContainer = styled.div`
  background: ${colors.background};
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.success} 0%, ${colors.info} 50%, ${colors.primary} 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  color: ${colors.error};
  font-weight: 500;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SuccessHeader = styled.div`
  border-bottom: 2px solid ${colors.border};
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.backgroundTertiary} 100%);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const SiteTitle = styled.h2`
  margin: 0 0 0.75rem 0;
  color: ${colors.textPrimary};
  font-size: 1.5rem;
  font-weight: 700;
`;

const SiteURL = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 0.875rem;
  word-break: break-all;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${scaleIn} 0.5s ease-out;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: ${colors.shadowLg};
    border-color: ${colors.primary};
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Section = styled.div<{ delay?: number }>`
  margin: 2rem 0;
  animation: ${slideInLeft} 0.6s ease-out;
  animation-delay: ${props => props.delay || 0}s;
  animation-fill-mode: both;
`;

const ResultSectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: ${colors.textPrimary};
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: ${colors.primary};
    border-radius: 2px;
  }
`;

const Description = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
`;

const ListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${colors.backgroundSecondary};
`;

const ListItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Link = styled.a`
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: ${colors.primaryDark};
  }
`;

const ExternalBadge = styled.span`
  background: ${colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  margin-left: 0.5rem;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid ${colors.border};
  margin-bottom: 2rem;
  background: ${colors.backgroundSecondary};
  border-radius: 12px 12px 0 0;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.875rem 1.5rem;
  border: none;
  background: ${props => props.active ? colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : colors.textSecondary};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? colors.primaryDark : colors.backgroundTertiary};
    color: ${props => props.active ? 'white' : colors.textPrimary};
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
  background: linear-gradient(135deg, ${colors.primary}, ${colors.info});
  color: white;
  padding: ${props => Math.max(4, props.size * 2)}px ${props => Math.max(8, props.size * 4)}px;
  border-radius: 20px;
  font-size: ${props => Math.max(0.7, props.size)}rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${colors.shadowMd};
`;

const CardTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: ${colors.textPrimary};
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
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: ${colors.shadow};
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.2s ease;
  box-shadow: ${colors.shadowMd};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${colors.shadowLg};
    background: linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary});
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
  const { showToast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [loadingKeys, setLoadingKeys] = useState(true);

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

  // Fetch API keys on component mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoadingKeys(true);
        const keys = await apiService.getApiKeys();
        setApiKeys(keys);
        // Auto-select the first active key if available
        const activeKey = keys.find((key: any) => key.is_active);
        if (activeKey) {
          setSelectedApiKey(activeKey.key);
        }
      } catch (err: any) {
        showToast(err.response?.data?.error || 'Failed to load API keys', 'error');
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchApiKeys();
  }, [showToast]);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      showToast('Please enter a valid URL', 'error');
      return;
    }

    if (!selectedApiKey) {
      setError('Please select an API key');
      showToast('Please select an API key', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.scrapeWebsite(url.trim(), selectedApiKey);

      if (response.success && response.data) {
        setResult(response.data);
        showToast('Website scraped successfully!', 'success');
      } else {
        const errorMsg = response.error || 'Failed to scrape website';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Network error occurred';
      setError(errorMsg);
      showToast(errorMsg, 'error');
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
      <PageHeader>
        <h1>Web Scraper & Analyzer</h1>
        <p>Extract comprehensive data from any website including content, metadata, performance metrics, security analysis, and network requests.</p>
      </PageHeader>
      
      <InputSection>
        <SectionTitle>🔍 Website Analysis</SectionTitle>
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
          <ButtonGroup>
            <InputWrapper>
              <Label htmlFor="api-key-select">API Key</Label>
              {loadingKeys ? (
                <APIKeySelect disabled>
                  <option>Loading API keys...</option>
                </APIKeySelect>
              ) : (
                <APIKeySelect
                  id="api-key-select"
                  value={selectedApiKey}
                  onChange={(e) => setSelectedApiKey(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select an API key</option>
                  {apiKeys.map((key: any) => (
                    <option key={key.id} value={key.key}>
                      {key.name} {key.is_active ? '' : '(Inactive)'}
                    </option>
                  ))}
                </APIKeySelect>
              )}
            </InputWrapper>
            <ScrapeButton onClick={handleScrape} disabled={loading || !selectedApiKey}>
              {loading && <LoadingSpinner />}
              {loading ? 'Analyzing...' : '🚀 Start Analysis'}
            </ScrapeButton>
          </ButtonGroup>
        </InputGroup>
      </InputSection>

      {loading && (
        <ResultsContainer>
          <Loader 
            text="Analyzing website..." 
            subtext="Extracting data, capturing screenshots, and running security analysis"
            size="large"
          />
        </ResultsContainer>
      )}

      {error && !loading && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {result && !loading && (
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
              <Tab active={activeTab === 'screenshot'} onClick={() => setActiveTab('screenshot')}>
                📸 Screenshot
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
                📋 Console ({result.console_logs?.length || result.consoleLogs?.length || 0})
              </Tab>
              {(result.crawledLinks && result.crawledLinks.length > 0) && (
              <Tab active={activeTab === 'crawled'} onClick={() => setActiveTab('crawled')}>
                🔍 Crawled Pages ({result.crawledLinks.length})
              </Tab>
              )}
            </TabList>
          </TabContainer>

          {activeTab === 'overview' && (
            <>
              <Section>
                <SectionTitle>Page Description</SectionTitle>
                <Description>{result.description || 'No description available'}</Description>
              </Section>

              {result.screenshot && (
                <Section>
                  <SectionTitle>Page Preview</SectionTitle>
                  <div style={{ 
                    border: `2px solid ${colors.border}`, 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    background: colors.backgroundSecondary
                  }}>
                    <img 
                      src={result.screenshot} 
                      alt="Page screenshot" 
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: colors.textMuted }}>
                    Full-page screenshot captured at {new Date().toLocaleTimeString()}
                  </div>
                </Section>
              )}

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

          {activeTab === 'screenshot' && result.screenshot && (
            <Section>
              <SectionTitle>Full-Page Screenshot</SectionTitle>
              <Description>
                This is a complete screenshot of the entire webpage, including content below the fold.
                Captured on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </Description>
              <div style={{ 
                border: `2px solid ${colors.border}`, 
                borderRadius: '16px', 
                overflow: 'hidden',
                background: colors.backgroundSecondary,
                boxShadow: colors.shadowLg,
                marginTop: '1rem'
              }}>
                <img 
                  src={result.screenshot} 
                  alt="Full page screenshot" 
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: colors.backgroundSecondary, 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                  <strong>Screenshot Details:</strong><br/>
                  Format: PNG • Type: Full-page capture • Viewport: 1920x1080
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = result.screenshot!;
                    link.download = `screenshot-${new URL(result.url).hostname}-${new Date().toISOString().split('T')[0]}.png`;
                    link.click();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  💾 Download Screenshot
                </button>
              </div>
            </Section>
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

          {activeTab === 'crawled' && result.crawledLinks && result.crawledLinks.length > 0 && (
            <Section>
              <SectionTitle>🔍 Crawled Internal Pages</SectionTitle>
              <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                Automatically discovered and analyzed {result.crawledLinks.length} internal page(s)
              </div>
              
              <div style={{ display: 'grid', gap: '2rem' }}>
                {result.crawledLinks.map((link: any, index: number) => {
                  const hasScreenshot = link.screenshot && link.screenshot.startsWith('data:image');
                  
                  return (
                    <div key={index} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      backgroundColor: '#ffffff'
                    }}>
                      {/* Header */}
                      <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: '#1e1e1e', fontSize: '1.1rem', flex: 1 }}>
                            {link.title || 'Untitled Page'}
                          </h4>
                          {link.status && (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              backgroundColor: link.status === 200 ? '#dcfce7' : '#fee2e2',
                              color: link.status === 200 ? '#166534' : '#991b1b'
                            }}>
                              {link.status} {link.statusText || ''}
                            </span>
                          )}
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
                          color: '#4f46e5',
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          wordBreak: 'break-all'
                        }}>
                          {link.url}
                        </a>
                      </div>

                      {/* Metrics */}
                      <MetricsRow style={{ marginBottom: '1rem' }}>
                        {link.wordCount && (
                          <MetricCard>
                            <MetricValue>{link.wordCount}</MetricValue>
                            <MetricLabel>Words</MetricLabel>
                          </MetricCard>
                        )}
                        {link.loadTimeMs && (
                          <MetricCard>
                            <MetricValue>{link.loadTimeMs}ms</MetricValue>
                            <MetricLabel>Load Time</MetricLabel>
                          </MetricCard>
                        )}
                        {link.contentType && (
                          <MetricCard>
                            <MetricValue style={{ fontSize: '0.8rem' }}>{link.contentType.split(';')[0]}</MetricValue>
                            <MetricLabel>Content Type</MetricLabel>
                          </MetricCard>
                        )}
                        {link.isHttps !== undefined && (
                          <MetricCard>
                            <MetricValue>{link.isHttps ? '🔒' : '⚠️'}</MetricValue>
                            <MetricLabel>{link.isHttps ? 'HTTPS' : 'HTTP'}</MetricLabel>
                          </MetricCard>
                        )}
                      </MetricsRow>

                      {/* Description */}
                      {link.description && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: '#1e1e1e', display: 'block', marginBottom: '0.5rem' }}>Description:</strong>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            {link.description}
                          </p>
                        </div>
                      )}

                      {/* H1 Tags */}
                      {link.h1Tags && link.h1Tags.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: '#1e1e1e', display: 'block', marginBottom: '0.5rem' }}>
                            H1 Headings ({link.h1Tags.length}):
                          </strong>
                          <ListContainer>
                            {link.h1Tags.map((h1: string, h1Index: number) => (
                              <ListItem key={h1Index} style={{ fontSize: '0.9rem' }}>{h1}</ListItem>
                            ))}
                          </ListContainer>
                        </div>
                      )}

                      {/* Screenshot */}
                      {hasScreenshot && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong style={{ color: '#1e1e1e', display: 'block', marginBottom: '0.75rem' }}>
                            📸 Page Screenshot:
                          </strong>
                          <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            maxHeight: '400px',
                            overflowY: 'auto'
                          }}>
                            <img 
                              src={link.screenshot} 
                              alt={`Screenshot of ${link.title}`}
                              style={{ width: '100%', display: 'block' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Error */}
                      {link.error && (
                        <div style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          color: '#991b1b',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Error:</strong> {link.error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

          {activeTab === 'network' && (result.network_requests || result.networkResources || result.network_resources) && (() => {
            // Support both snake_case and camelCase
            const networkData = result.networkResources || result.network_resources || result.network_requests || [];
            
            return (
            <Section>
              <SectionTitle>🌐 Network Requests Analysis</SectionTitle>
              {networkData.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <MetricsRow>
                      <MetricCard>
                        <MetricValue>{networkData.length}</MetricValue>
                        <MetricLabel>Total Requests</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>
                          {(networkData.reduce((sum: number, req: any) => sum + (req.transferSize || req.size_bytes || 0), 0) / 1024).toFixed(1)}KB
                        </MetricValue>
                        <MetricLabel>Total Size</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{networkData.filter((req: any) => (req.status || 0) >= 400).length}</MetricValue>
                        <MetricLabel>Failed Requests</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{networkData.filter((req: any) => req.from_cache || req.cached).length}</MetricValue>
                        <MetricLabel>From Cache</MetricLabel>
                      </MetricCard>
                    </MetricsRow>
                  </div>
                  <ListContainer>
                    {networkData.map((request: any, index: number) => {
                      const url = request.url || request.name || '';
                      const method = request.method || 'GET';
                      const status = request.status || 0;
                      const statusText = request.statusText || request.status_text || '';
                      const resourceType = request.resource_type || request.initiatorType || 'other';
                      const contentType = request.content_type || request.mimeType || '';
                      const sizeBytes = request.size_bytes || request.transferSize || 0;
                      const timeMs = request.response_time_ms || request.durationMs || 0;
                      const fromCache = request.from_cache ?? request.cached ?? false;
                      const headers = request.headers || request.responseHeaders || {};
                      
                      return (
                      <ListItem key={index} style={{ borderLeft: `3px solid ${status >= 400 ? '#ef4444' : status >= 300 ? '#f59e0b' : '#10b981'}`, padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#1e1e1e', flex: 1, marginRight: '1rem', wordBreak: 'break-all' }}>
                            {method} {url}
                          </strong>
                          {status > 0 && (
                          <span style={{ 
                            color: status >= 400 ? '#ef4444' : status >= 300 ? '#f59e0b' : '#10b981',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            minWidth: '60px',
                            textAlign: 'right'
                          }}>
                            {status} {statusText}
                          </span>
                          )}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <div><strong>Type:</strong> {resourceType}</div>
                            <div><strong>Content-Type:</strong> {contentType}</div>
                            <div><strong>Size:</strong> {(sizeBytes / 1024).toFixed(2)}KB</div>
                            <div><strong>Time:</strong> {timeMs}ms</div>
                            <div><strong>Cached:</strong> {fromCache ? '✅ Yes' : '❌ No'}</div>
                            {request.remote_address || request.remoteAddress ? (
                              <div><strong>IP:</strong> {request.remoteAddress || request.remote_address}</div>
                            ) : null}
                          </div>
                          {headers && Object.keys(headers).length > 0 && (
                            <details style={{ marginTop: '0.75rem' }}>
                              <summary style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: '600' }}>
                                📋 Headers ({Object.keys(headers).length})
                              </summary>
                              <div style={{ 
                                marginTop: '0.5rem', 
                                paddingLeft: '1rem',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                maxHeight: '200px',
                                overflowY: 'auto'
                              }}>
                                {Object.entries(headers).map(([key, value]) => (
                                  <div key={key} style={{ marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                                    <strong style={{ color: '#475569' }}>{key}:</strong> 
                                    <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </ListItem>
                      );
                    })}
                  </ListContainer>
                </div>
              ) : (
                <Description>No network requests captured</Description>
              )}
            </Section>
            );
          })()}

          {activeTab === 'security' && (result.security_analysis || result.security_report || result.securityReport) && (
            <Section delay={0.1}>
              <ResultSectionTitle>🔒 Security Analysis</ResultSectionTitle>
              <div style={{ marginBottom: '1.5rem' }}>
                {/* Handle both SecurityAnalysis and SecurityReport formats - support both snake_case and camelCase */}
                {(() => {
                  const security = result.securityReport || result.security_report;
                  if (!security) return null;
                  
                  const isHttps = security.isHttps ?? security.is_https ?? false;
                  const insecureCookies = security.insecureCookies ?? security.insecure_cookies ?? false;
                  const mixedContent = security.mixedContent ?? security.mixed_content ?? false;
                  const missingHeaders = security.missingSecurityHeaders || security.missing_security_headers || [];
                  const csp = security.csp;
                  const notes = security.notes || [];
                  
                  return (
                  <>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      padding: '0.75rem 1.25rem', 
                      borderRadius: '12px',
                      backgroundColor: isHttps && !insecureCookies && !mixedContent ? '#dcfce7' : 
                                      isHttps ? '#fef3c7' : '#fee2e2',
                      color: isHttps && !insecureCookies && !mixedContent ? '#166534' : 
                             isHttps ? '#92400e' : '#991b1b',
                      fontWeight: '600',
                      marginBottom: '1.5rem',
                      fontSize: '1rem'
                    }}>
                      {isHttps && !insecureCookies && !mixedContent ? '🟢 Good Security' : 
                       isHttps ? '🟡 Moderate Security' : '🔴 Poor Security'} 
                    </div>

                    <MetricsRow>
                      <MetricCard>
                        <MetricValue>{isHttps ? '✅' : '❌'}</MetricValue>
                        <MetricLabel>HTTPS</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{!insecureCookies ? '✅' : '❌'}</MetricValue>
                        <MetricLabel>Secure Cookies</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{!mixedContent ? '✅' : '❌'}</MetricValue>
                        <MetricLabel>No Mixed Content</MetricLabel>
                      </MetricCard>
                      <MetricCard>
                        <MetricValue>{missingHeaders.length === 0 ? '✅' : '⚠️'}</MetricValue>
                        <MetricLabel>Security Headers</MetricLabel>
                      </MetricCard>
                    </MetricsRow>

                    {missingHeaders.length > 0 && (
                      <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: colors.textPrimary }}>Missing Security Headers ({missingHeaders.length})</h4>
                        <ListContainer>
                          {missingHeaders.map((header: string, index: number) => (
                            <ListItem key={index}>
                              <span style={{ color: colors.warning }}>⚠️</span> {header}
                            </ListItem>
                          ))}
                        </ListContainer>
                      </div>
                    )}

                    {csp && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: colors.textPrimary }}>Content Security Policy</h4>
                        <ListContainer>
                          <ListItem style={{ wordBreak: 'break-all' }}>
                            {csp}
                          </ListItem>
                        </ListContainer>
                      </div>
                    )}

                    {notes.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: colors.textPrimary }}>Security Notes ({notes.length})</h4>
                        <ListContainer>
                          {notes.map((note: string, index: number) => (
                            <ListItem key={index}>
                              <span style={{ color: colors.info }}>ℹ️</span> {note}
                            </ListItem>
                          ))}
                        </ListContainer>
                      </div>
                    )}
                  </>
                  );
                })()}

                {/* Fallback to old format if security_analysis exists */}
                {result.security_analysis && !result.security_report && !result.securityReport && (
                  <>
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
                  </>
                )}
              </div>

              {result.security_analysis?.recommendations && result.security_analysis.recommendations.length > 0 && (
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

          {activeTab === 'performance' && (result.performance_metrics || result.performanceMetrics) && (() => {
            // Support both snake_case and camelCase
            const perf = result.performanceMetrics || result.performance_metrics || {};
            
            // Extract values with fallbacks
            const totalLoadTime = perf.loadComplete || perf.total_load_time_ms || 0;
            const domReady = perf.domContentLoaded || perf.dom_ready_time_ms || 0;
            const firstPaint = perf.firstPaint || perf.first_paint_ms || 0;
            const firstContentfulPaint = perf.firstContentfulPaint || perf.largest_contentful_paint_ms || 0;
            const cls = perf.cumulative_layout_shift || 0;
            const totalRequests = perf.totalResources || perf.total_requests || 0;
            const totalSize = (perf.transferSize || perf.total_size_kb || 0) / 1024;
            const dnsLookup = perf.dnsLookup || perf.dns_lookup_ms || 0;
            const tcpConnection = perf.tcpConnection || perf.tcp_connection_ms || 0;
            const tlsNegotiation = perf.tlsNegotiation || 0;
            const requestTime = perf.requestTime || 0;
            const responseTime = perf.responseTime || 0;
            
            return (
            <Section>
              <SectionTitle>⚡ Performance Metrics</SectionTitle>
              <MetricsRow>
                <MetricCard>
                  <MetricValue>{totalLoadTime ? `${totalLoadTime.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>Total Load Time</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{domReady ? `${domReady.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>DOM Ready</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{firstPaint ? `${firstPaint.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>First Paint</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{firstContentfulPaint ? `${firstContentfulPaint.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>First Contentful Paint</MetricLabel>
                </MetricCard>
              </MetricsRow>
              <MetricsRow>
                <MetricCard>
                  <MetricValue>{dnsLookup ? `${dnsLookup.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>DNS Lookup</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{tcpConnection ? `${tcpConnection.toFixed(0)}ms` : 'N/A'}</MetricValue>
                  <MetricLabel>TCP Connection</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{totalRequests}</MetricValue>
                  <MetricLabel>Total Requests</MetricLabel>
                </MetricCard>
                <MetricCard>
                  <MetricValue>{totalSize ? `${totalSize.toFixed(1)}KB` : 'N/A'}</MetricValue>
                  <MetricLabel>Total Size</MetricLabel>
                </MetricCard>
              </MetricsRow>
              
              {(tlsNegotiation > 0 || requestTime > 0 || responseTime > 0) && (
              <MetricsRow>
                {tlsNegotiation > 0 && (
                <MetricCard>
                  <MetricValue>{tlsNegotiation.toFixed(0)}ms</MetricValue>
                  <MetricLabel>TLS Negotiation</MetricLabel>
                </MetricCard>
                )}
                {requestTime > 0 && (
                <MetricCard>
                  <MetricValue>{requestTime.toFixed(0)}ms</MetricValue>
                  <MetricLabel>Request Time</MetricLabel>
                </MetricCard>
                )}
                {responseTime > 0 && (
                <MetricCard>
                  <MetricValue>{responseTime.toFixed(0)}ms</MetricValue>
                  <MetricLabel>Response Time</MetricLabel>
                </MetricCard>
                )}
                <MetricCard>
                  <MetricValue>
                    {firstPaint < 1000 ? '🟢' : firstPaint < 2500 ? '🟡' : '🔴'}
                  </MetricValue>
                  <MetricLabel>Performance</MetricLabel>
                </MetricCard>
              </MetricsRow>
              )}
              
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>Performance Insights</h4>
                <ListContainer>
                  {totalLoadTime > 0 && (
                  <ListItem>
                    <strong>Load Time Assessment:</strong> {
                      totalLoadTime < 2000 ? '🟢 Excellent - Very fast loading' :
                      totalLoadTime < 4000 ? '🟡 Good - Acceptable loading speed' :
                      totalLoadTime < 8000 ? '🟠 Average - Could be improved' :
                      '🔴 Poor - Significant optimization needed'
                    }
                  </ListItem>
                  )}
                  {totalRequests > 0 && (
                  <ListItem>
                    <strong>Request Efficiency:</strong> {
                      totalRequests < 50 ? '🟢 Excellent - Minimal requests' :
                      totalRequests < 100 ? '🟡 Good - Reasonable request count' :
                      '🔴 Poor - Too many requests, consider optimization'
                    }
                  </ListItem>
                  )}
                  {firstPaint > 0 && (
                  <ListItem>
                    <strong>First Paint:</strong> {
                      firstPaint < 1000 ? '🟢 Excellent - Under 1 second' :
                      firstPaint < 2500 ? '🟡 Good - Under 2.5 seconds' :
                      '🔴 Poor - Over 2.5 seconds'
                    }
                  </ListItem>
                  )}
                </ListContainer>
              </div>
            </Section>
            );
          })()}

          {activeTab === 'console' && result.console_logs && (
            <Section>
              <SectionTitle>Console Messages</SectionTitle>
              {result.console_logs.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Captured {result.console_logs.length} console message(s) during page load
                  </div>
                  <ListContainer>
                    {result.console_logs.map((log: any, index: number) => {
                      const logText = typeof log === 'string' ? log : log.message;
                      const logLevel = typeof log === 'string' ? 'log' : log.level;
                      const isError = logLevel === 'error' || logText.toLowerCase().includes('error');
                      const isWarning = logLevel === 'warning' || logLevel === 'warn' || logText.toLowerCase().includes('warning');
                      
                      return (
                        <ListItem key={index} style={{ 
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          backgroundColor: '#f8fafc',
                          borderLeft: `3px solid ${isError ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}`,
                          padding: '0.75rem 1rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 'bold',
                              color: isError ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981',
                              textTransform: 'uppercase',
                              minWidth: '60px'
                            }}>
                              {logLevel}
                            </span>
                            <span style={{ flex: 1, fontSize: '0.85rem', color: '#1e293b' }}>{logText}</span>
                          </div>
                        </ListItem>
                      );
                    })}
                  </ListContainer>
                </div>
              ) : (
                <Description>No console messages captured</Description>
              )}
              
              {result.cookies && Object.keys(result.cookies).length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>🍪 Cookies ({Object.keys(result.cookies).length})</h4>
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
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e1e1e' }}>📋 Response Headers ({Object.keys(result.response_headers).length})</h4>
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