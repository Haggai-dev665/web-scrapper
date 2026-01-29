import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import colors from '../theme/colors';
import { 
  FiSearch, FiLoader, FiDownload, FiExternalLink, FiChevronDown, 
  FiChevronRight, FiAlertCircle, FiCheckCircle, FiGlobe, FiLock,
  FiImage, FiLink, FiActivity, FiShield, FiZap, FiTerminal, FiFileText
} from 'react-icons/fi';

// ============ ANIMATIONS ============
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const progressPulse = keyframes`
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 95%; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// ============ TYPES ============
interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  response_time_ms: number;
  size_bytes: number;
  content_type: string;
  headers: Record<string, string>;
}

interface SecurityReport {
  is_https: boolean;
  mixed_content: boolean;
  missing_security_headers: string[];
  insecure_cookies: boolean;
  csp?: string;
  notes: string[];
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
  network_requests?: NetworkRequest[];
  network_resources?: any[];
  console_logs?: any[];
  security_analysis?: SecurityAnalysis;
  security_report?: SecurityReport;
  performance_metrics?: PerformanceMetrics;
  cookies?: Record<string, string>;
  response_headers: Record<string, string>;
  rendered_html?: string;
}

// ============ STYLED COMPONENTS ============

// Container
const Container = styled.div`
  max-width: 100%;
  min-height: calc(100vh - 140px);
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
`;

// Input Section
const InputCard = styled.div`
  background: ${colors.background};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${colors.border};
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 10px;
  font-size: 1rem;
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.background};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &:disabled {
    background-color: ${colors.backgroundTertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const APIKeySelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 10px;
  font-size: 0.9375rem;
  background: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  transition: all 0.2s ease;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background-color: ${colors.background};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &:disabled {
    background-color: ${colors.backgroundTertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  @media (min-width: 768px) {
    width: 220px;
  }
`;

const ScrapeButton = styled.button<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, ${colors.primary} 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${colors.textMuted};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  svg {
    ${props => props.$loading && css`animation: ${spin} 1s linear infinite;`}
  }
  
  @media (max-width: 767px) {
    width: 100%;
    padding: 1rem;
  }
`;

// Loading States
const LoadingContainer = styled.div`
  background: ${colors.background};
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${colors.border};
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${colors.border};
  border-top-color: ${colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`;

const LoadingTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 0.5rem;
`;

const LoadingSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin: 0 0 1.5rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: ${colors.border};
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${colors.primary}, ${colors.info});
  border-radius: 2px;
  animation: ${progressPulse} 2.5s ease-in-out infinite;
`;

const LoadingSteps = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const LoadingStep = styled.span<{ $active?: boolean; $complete?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${props => props.$complete ? 'rgba(16, 185, 129, 0.1)' : props.$active ? 'rgba(99, 102, 241, 0.1)' : colors.backgroundSecondary};
  border: 1px solid ${props => props.$complete ? 'rgba(16, 185, 129, 0.3)' : props.$active ? 'rgba(99, 102, 241, 0.3)' : colors.border};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.$complete ? colors.success : props.$active ? colors.primary : colors.textSecondary};
  
  svg {
    font-size: 0.875rem;
    ${props => props.$active && !props.$complete && css`animation: ${pulse} 1.5s ease-in-out infinite;`}
  }
`;

// Skeleton Loaders
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, ${colors.border} 25%, ${colors.backgroundSecondary} 50%, ${colors.border} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 8px;
`;

const SkeletonText = styled(SkeletonBase)<{ $width?: string; $height?: string }>`
  height: ${props => props.$height || '1rem'};
  width: ${props => props.$width || '100%'};
  margin-bottom: 0.5rem;
`;

const SkeletonCard = styled(SkeletonBase)`
  height: 120px;
  border-radius: 12px;
`;

// Error Message
const ErrorContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    color: ${colors.error};
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const ErrorText = styled.div`
  flex: 1;
  
  strong {
    display: block;
    color: ${colors.error};
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  span {
    color: ${colors.textSecondary};
    font-size: 0.875rem;
  }
`;

// Results Container
const ResultsCard = styled.div`
  background: ${colors.background};
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${colors.border};
  overflow: hidden;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const ResultsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.background} 100%);
  border-bottom: 1px solid ${colors.border};
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SiteInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const SiteTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 640px) {
    font-size: 1.375rem;
  }
`;

const SiteURL = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${colors.primary};
    border-color: ${colors.primary};
    color: white;
  }
  
  svg {
    font-size: 1rem;
  }
`;

// Metrics Grid
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: ${colors.backgroundSecondary};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const MetricItem = styled.div<{ $delay?: number }>`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  animation: ${scaleIn} 0.3s ease-out;
  animation-delay: ${props => (props.$delay || 0) * 0.05}s;
  animation-fill-mode: both;
  
  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  }
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 0.25rem;
  
  @media (min-width: 640px) {
    font-size: 1.75rem;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Tab Navigation
const TabsContainer = styled.div`
  border-bottom: 1px solid ${colors.border};
  background: ${colors.background};
`;

const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  padding: 0 1rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (min-width: 1024px) {
    padding: 0 1.5rem;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  color: ${props => props.$active ? colors.primary : colors.textSecondary};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 2px solid ${props => props.$active ? colors.primary : 'transparent'};
  margin-bottom: -1px;
  
  &:hover {
    color: ${colors.primary};
    background: rgba(99, 102, 241, 0.05);
  }
  
  svg {
    font-size: 1rem;
  }
  
  span.count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 0.375rem;
    background: ${props => props.$active ? colors.primary : colors.backgroundSecondary};
    color: ${props => props.$active ? 'white' : colors.textSecondary};
    border-radius: 10px;
    font-size: 0.6875rem;
    font-weight: 600;
  }
`;

// Tab Content
const TabContent = styled.div`
  padding: 1.5rem;
  animation: ${fadeIn} 0.25s ease-out;
`;

// Accordion (Mobile-first tabs alternative)
const AccordionContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccordionHeader = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${props => props.$expanded ? colors.backgroundSecondary : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.backgroundSecondary};
  }
`;

const AccordionTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  
  svg {
    color: ${colors.primary};
  }
`;

const AccordionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: ${colors.primary};
  color: white;
  border-radius: 10px;
  font-size: 0.6875rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const AccordionChevron = styled.span<{ $expanded: boolean }>`
  color: ${colors.textSecondary};
  transition: transform 0.2s ease;
  transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0)'};
  
  svg {
    font-size: 1.25rem;
  }
`;

const AccordionContent = styled.div<{ $expanded: boolean }>`
  max-height: ${props => props.$expanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${props => props.$expanded ? '0 1.25rem 1.25rem' : '0 1.25rem'};
`;

// Desktop Tabs Container
const DesktopTabsWrapper = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

// Content Sections
const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 1rem;
  
  svg {
    color: ${colors.primary};
  }
`;

const ContentCard = styled.div`
  background: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  background: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 3px;
  }
`;

const ListItem = styled.div`
  padding: 0.875rem 1rem;
  border-bottom: 1px solid ${colors.border};
  font-size: 0.875rem;
  color: ${colors.textPrimary};
  transition: background 0.15s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${colors.background};
  }
`;

const LinkItem = styled.a`
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 500;
  word-break: break-word;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Badge = styled.span<{ $variant?: 'primary' | 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  ${props => {
    switch (props.$variant) {
      case 'success':
        return css`background: rgba(16, 185, 129, 0.1); color: ${colors.success};`;
      case 'warning':
        return css`background: rgba(245, 158, 11, 0.1); color: ${colors.warning};`;
      case 'error':
        return css`background: rgba(239, 68, 68, 0.1); color: ${colors.error};`;
      default:
        return css`background: rgba(99, 102, 241, 0.1); color: ${colors.primary};`;
    }
  }}
`;

// Word Cloud
const WordCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const WordBubble = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  padding: ${props => `${4 + props.$size * 2}px ${8 + props.$size * 3}px`};
  background: linear-gradient(135deg, ${colors.primary}, ${colors.info});
  color: white;
  border-radius: 20px;
  font-size: ${props => `${0.7 + props.$size * 0.15}rem`};
  font-weight: 600;
  cursor: default;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Progress Bar
const ProgressBar = styled.div<{ $percentage: number; $color: string }>`
  width: 100%;
  height: 6px;
  background: ${colors.border};
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$percentage}%;
    height: 100%;
    background: ${props => props.$color};
    border-radius: 3px;
    transition: width 0.5s ease;
  }
`;

// Grid Layout
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// Image Grid
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ImageCard = styled.div`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  background: ${colors.backgroundSecondary};
`;

const ImageInfo = styled.div`
  padding: 0.625rem;
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Security Status
const SecurityStatus = styled.div<{ $status: 'good' | 'medium' | 'poor' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
  
  ${props => {
    switch (props.$status) {
      case 'good':
        return css`background: rgba(16, 185, 129, 0.1); color: ${colors.success};`;
      case 'medium':
        return css`background: rgba(245, 158, 11, 0.1); color: ${colors.warning};`;
      case 'poor':
        return css`background: rgba(239, 68, 68, 0.1); color: ${colors.error};`;
    }
  }}
`;

const CheckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CheckItem = styled.div<{ $passed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 1rem;
  background: ${props => props.$passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid ${props => props.$passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  border-radius: 10px;
  text-align: center;
  
  .icon {
    font-size: 1.5rem;
  }
  
  .label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.textSecondary};
  }
`;

// Console Log Item
const ConsoleLogItem = styled.div<{ $level: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.border};
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 0.8125rem;
  background: ${props => {
    if (props.$level === 'error') return 'rgba(239, 68, 68, 0.05)';
    if (props.$level === 'warning' || props.$level === 'warn') return 'rgba(245, 158, 11, 0.05)';
    return 'transparent';
  }};
  
  &:last-child {
    border-bottom: none;
  }
  
  .level {
    font-weight: 700;
    color: ${props => {
      if (props.$level === 'error') return colors.error;
      if (props.$level === 'warning' || props.$level === 'warn') return colors.warning;
      return colors.success;
    }};
    text-transform: uppercase;
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
    background: ${props => {
      if (props.$level === 'error') return 'rgba(239, 68, 68, 0.1)';
      if (props.$level === 'warning' || props.$level === 'warn') return 'rgba(245, 158, 11, 0.1)';
      return 'rgba(16, 185, 129, 0.1)';
    }};
    border-radius: 4px;
    flex-shrink: 0;
  }
  
  .message {
    color: ${colors.textPrimary};
    word-break: break-word;
    flex: 1;
  }
`;

// ============ COMPONENT ============
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
  const [loadingStep, setLoadingStep] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['overview']));
  const tabsRef = useRef<HTMLDivElement>(null);

  // Loading steps for progress indication
  const loadingSteps = [
    { label: 'Connecting', icon: FiGlobe },
    { label: 'Fetching', icon: FiActivity },
    { label: 'Analyzing', icon: FiSearch },
    { label: 'Security', icon: FiShield },
    { label: 'Complete', icon: FiCheckCircle },
  ];

  // Simulate loading step progression
  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const intervals = [800, 1500, 2500, 4000];
      const timers: NodeJS.Timeout[] = [];
      
      intervals.forEach((delay, index) => {
        const timer = setTimeout(() => {
          setLoadingStep(index + 1);
        }, delay);
        timers.push(timer);
      });
      
      return () => timers.forEach(clearTimeout);
    }
  }, [loading]);

  // Fetch API keys on mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoadingKeys(true);
        const keys = await apiService.getApiKeys();
        setApiKeys(keys);
        const activeKey = keys.find((key: any) => key.isActive);
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
        setLoadingStep(4);
        showToast('Website analyzed successfully!', 'success');
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

  const exportResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `scrape-${new URL(result.url).hostname}-${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
  };

  const toggleAccordion = (section: string) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

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

  const getTopWords = (wordFreq: Record<string, number>, count: number = 20) => {
    return Object.entries(wordFreq)
      .filter(([word]) => word.length > 3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count);
  };

  const getSecurityStatus = (): 'good' | 'medium' | 'poor' => {
    if (result?.security_report) {
      const { is_https, insecure_cookies, mixed_content } = result.security_report;
      if (is_https && !insecure_cookies && !mixed_content) return 'good';
      if (is_https) return 'medium';
      return 'poor';
    }
    if (result?.security_analysis) {
      if (result.security_analysis.risk_level === 'low') return 'good';
      if (result.security_analysis.risk_level === 'medium') return 'medium';
      return 'poor';
    }
    return 'medium';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGlobe },
    { id: 'content', label: 'Content', icon: FiFileText },
    { id: 'links', label: 'Links', icon: FiLink, count: result?.links?.length },
    { id: 'media', label: 'Media', icon: FiImage, count: result?.images?.length },
    { id: 'seo', label: 'SEO & Meta', icon: FiSearch },
    { id: 'network', label: 'Network', icon: FiActivity, count: result?.network_requests?.length },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'performance', label: 'Performance', icon: FiZap },
    { id: 'console', label: 'Console', icon: FiTerminal, count: result?.console_logs?.length },
  ];

  const renderTabContent = (tabId: string) => {
    if (!result) return null;

    switch (tabId) {
      case 'overview':
        return (
          <>
            {result.description && (
              <ContentCard>
                <SectionTitle><FiFileText /> Page Description</SectionTitle>
                <p style={{ margin: 0, color: colors.textSecondary, lineHeight: 1.6 }}>
                  {result.description}
                </p>
              </ContentCard>
            )}
            
            {result.word_frequency && Object.keys(result.word_frequency).length > 0 && (
              <ContentCard>
                <SectionTitle><FiActivity /> Top Keywords</SectionTitle>
                <WordCloud>
                  {getTopWords(result.word_frequency, 12).map(([word, count]) => (
                    <WordBubble
                      key={word}
                      $size={Math.min(1.5, 0.5 + (count / Math.max(...Object.values(result.word_frequency))) * 1)}
                      title={`${word}: ${count} occurrences`}
                    >
                      {word} ({count})
                    </WordBubble>
                  ))}
                </WordCloud>
              </ContentCard>
            )}
            
            <CardGrid>
              <ContentCard>
                <SectionTitle><FiActivity /> Content Metrics</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Language</span>
                    <strong>{result.language || 'Unknown'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Response Time</span>
                    <strong>{result.response_time_ms}ms</strong>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: colors.textSecondary }}>Readability</span>
                      <strong>{getReadabilityLabel(result.readability_score || 0)}</strong>
                    </div>
                    <ProgressBar
                      $percentage={result.readability_score || 0}
                      $color={getReadabilityStatus(result.readability_score || 0) === 'good' ? colors.success :
                             getReadabilityStatus(result.readability_score || 0) === 'medium' ? colors.warning : colors.error}
                    />
                  </div>
                </div>
              </ContentCard>
              
              <ContentCard>
                <SectionTitle><FiLink /> Link Analysis</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Total Links</span>
                    <strong>{result.links?.length || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>External</span>
                    <strong>{result.links?.filter(l => l.is_external).length || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Internal</span>
                    <strong>{result.links?.filter(l => !l.is_external).length || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.textSecondary }}>Social Media</span>
                    <strong>{result.social_media_links?.length || 0}</strong>
                  </div>
                </div>
              </ContentCard>
            </CardGrid>
          </>
        );

      case 'content':
        return (
          <>
            {result.headings && result.headings.length > 0 && (
              <>
                <SectionTitle><FiFileText /> Page Structure ({result.headings.length} headings)</SectionTitle>
                <ListContainer>
                  {result.headings.map((heading, index) => (
                    <ListItem key={index}>{heading}</ListItem>
                  ))}
                </ListContainer>
              </>
            )}
            
            {result.word_frequency && (
              <div style={{ marginTop: '1.5rem' }}>
                <SectionTitle><FiActivity /> Word Frequency</SectionTitle>
                <ListContainer>
                  {getTopWords(result.word_frequency, 30).map(([word, count]) => (
                    <ListItem key={word} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{word}</span>
                      <strong style={{ color: colors.primary }}>{count}</strong>
                    </ListItem>
                  ))}
                </ListContainer>
              </div>
            )}
          </>
        );

      case 'links':
        return result.links && result.links.length > 0 ? (
          <>
            <SectionTitle><FiLink /> All Links ({result.links.length})</SectionTitle>
            <ListContainer>
              {result.links.map((link, index) => (
                <ListItem key={index}>
                  <LinkItem href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.text || link.href}
                    <FiExternalLink style={{ marginLeft: '0.375rem', fontSize: '0.75rem', verticalAlign: 'middle' }} />
                  </LinkItem>
                  {link.is_external && <Badge $variant="primary">External</Badge>}
                </ListItem>
              ))}
            </ListContainer>
          </>
        ) : (
          <p style={{ color: colors.textSecondary }}>No links found on this page.</p>
        );

      case 'media':
        return result.images && result.images.length > 0 ? (
          <>
            <SectionTitle><FiImage /> Images ({result.images.length})</SectionTitle>
            <ImageGrid>
              {result.images.slice(0, 16).map((image, index) => (
                <ImageCard key={index}>
                  <ImagePreview
                    src={image.src}
                    alt={image.alt || 'Image'}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <ImageInfo>
                    {image.alt || 'No alt text'}
                    {image.width && image.height && (
                      <span style={{ display: 'block', opacity: 0.7 }}>{image.width}×{image.height}</span>
                    )}
                  </ImageInfo>
                </ImageCard>
              ))}
            </ImageGrid>
            {result.images.length > 16 && (
              <p style={{ textAlign: 'center', color: colors.textSecondary, marginTop: '1rem', fontStyle: 'italic' }}>
                +{result.images.length - 16} more images
              </p>
            )}
          </>
        ) : (
          <p style={{ color: colors.textSecondary }}>No images found on this page.</p>
        );

      case 'seo':
        return (
          <>
            <SectionTitle><FiSearch /> SEO & Meta Information</SectionTitle>
            {result.meta_tags && Object.keys(result.meta_tags).length > 0 ? (
              <ListContainer>
                {Object.entries(result.meta_tags).map(([name, content]) => (
                  <ListItem key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <strong style={{ color: colors.textPrimary }}>{name}</strong>
                    <span style={{ color: colors.textSecondary, fontSize: '0.8125rem', wordBreak: 'break-word' }}>{content}</span>
                  </ListItem>
                ))}
              </ListContainer>
            ) : (
              <p style={{ color: colors.textSecondary }}>No meta tags found.</p>
            )}
          </>
        );

      case 'network':
        return result.network_requests && result.network_requests.length > 0 ? (
          <>
            <MetricsGrid style={{ padding: 0, marginBottom: '1.5rem', background: 'transparent' }}>
              <MetricItem>
                <MetricValue>{result.network_requests.length}</MetricValue>
                <MetricLabel>Total Requests</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{(result.network_requests.reduce((sum, req) => sum + req.size_bytes, 0) / 1024).toFixed(1)}KB</MetricValue>
                <MetricLabel>Total Size</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue style={{ color: result.network_requests.filter(req => req.status >= 400).length > 0 ? colors.error : colors.success }}>
                  {result.network_requests.filter(req => req.status >= 400).length}
                </MetricValue>
                <MetricLabel>Failed</MetricLabel>
              </MetricItem>
            </MetricsGrid>
            
            <SectionTitle><FiActivity /> Request Details</SectionTitle>
            <ListContainer>
              {result.network_requests.map((request, index) => (
                <ListItem key={index} style={{ borderLeft: `3px solid ${request.status >= 400 ? colors.error : request.status >= 300 ? colors.warning : colors.success}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <strong style={{ flex: 1, marginRight: '1rem', wordBreak: 'break-all' }}>{request.method} {request.url}</strong>
                    <Badge $variant={request.status >= 400 ? 'error' : request.status >= 300 ? 'warning' : 'success'}>
                      {request.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: colors.textSecondary, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Type: {request.content_type}</span>
                    <span>Size: {(request.size_bytes / 1024).toFixed(2)}KB</span>
                    <span>Time: {request.response_time_ms}ms</span>
                  </div>
                </ListItem>
              ))}
            </ListContainer>
          </>
        ) : (
          <p style={{ color: colors.textSecondary }}>No network requests captured.</p>
        );

      case 'security':
        const securityData = result.security_report || result.security_analysis;
        if (!securityData) {
          return <p style={{ color: colors.textSecondary }}>No security data available.</p>;
        }
        
        const isHttps = result.security_report?.is_https ?? result.security_analysis?.https;
        const secureCookies = result.security_report ? !result.security_report.insecure_cookies : result.security_analysis?.cookies_secure;
        const noMixedContent = result.security_report ? !result.security_report.mixed_content : !result.security_analysis?.mixed_content;
        
        return (
          <>
            <SecurityStatus $status={getSecurityStatus()}>
              {getSecurityStatus() === 'good' ? '🟢 Good Security' : 
               getSecurityStatus() === 'medium' ? '🟡 Moderate Security' : '🔴 Poor Security'}
            </SecurityStatus>
            
            <CheckGrid>
              <CheckItem $passed={!!isHttps}>
                <span className="icon">{isHttps ? '✅' : '❌'}</span>
                <span className="label">HTTPS</span>
              </CheckItem>
              <CheckItem $passed={!!secureCookies}>
                <span className="icon">{secureCookies ? '✅' : '❌'}</span>
                <span className="label">Secure Cookies</span>
              </CheckItem>
              <CheckItem $passed={!!noMixedContent}>
                <span className="icon">{noMixedContent ? '✅' : '❌'}</span>
                <span className="label">No Mixed Content</span>
              </CheckItem>
              <CheckItem $passed={result.security_analysis ? !result.security_analysis.insecure_forms : true}>
                <span className="icon">{result.security_analysis?.insecure_forms ? '❌' : '✅'}</span>
                <span className="label">Secure Forms</span>
              </CheckItem>
            </CheckGrid>
            
            {result.security_report?.missing_security_headers && result.security_report.missing_security_headers.length > 0 && (
              <ContentCard>
                <SectionTitle><FiAlertCircle /> Missing Headers ({result.security_report.missing_security_headers.length})</SectionTitle>
                <ListContainer style={{ maxHeight: '200px' }}>
                  {result.security_report.missing_security_headers.map((header, index) => (
                    <ListItem key={index}>
                      <Badge $variant="warning">⚠️</Badge> {header}
                    </ListItem>
                  ))}
                </ListContainer>
              </ContentCard>
            )}
            
            {result.security_analysis?.recommendations && result.security_analysis.recommendations.length > 0 && (
              <ContentCard>
                <SectionTitle><FiCheckCircle /> Recommendations</SectionTitle>
                <ListContainer style={{ maxHeight: '200px' }}>
                  {result.security_analysis.recommendations.map((rec, index) => (
                    <ListItem key={index}>🔧 {rec}</ListItem>
                  ))}
                </ListContainer>
              </ContentCard>
            )}
          </>
        );

      case 'performance':
        if (!result.performance_metrics) {
          return <p style={{ color: colors.textSecondary }}>No performance data available.</p>;
        }
        
        const perf = result.performance_metrics;
        return (
          <>
            <MetricsGrid style={{ padding: 0, marginBottom: '1.5rem', background: 'transparent' }}>
              <MetricItem>
                <MetricValue>{perf.total_load_time_ms}ms</MetricValue>
                <MetricLabel>Load Time</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{perf.dom_ready_time_ms}ms</MetricValue>
                <MetricLabel>DOM Ready</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{perf.first_paint_ms}ms</MetricValue>
                <MetricLabel>First Paint</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{perf.largest_contentful_paint_ms}ms</MetricValue>
                <MetricLabel>LCP</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>{perf.cumulative_layout_shift.toFixed(3)}</MetricValue>
                <MetricLabel>CLS</MetricLabel>
              </MetricItem>
              <MetricItem>
                <MetricValue>
                  {perf.first_paint_ms < 1000 ? '🟢' : perf.first_paint_ms < 2500 ? '🟡' : '🔴'}
                </MetricValue>
                <MetricLabel>Score</MetricLabel>
              </MetricItem>
            </MetricsGrid>
            
            <ContentCard>
              <SectionTitle><FiZap /> Performance Insights</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <strong>Load Time: </strong>
                  <span style={{ color: colors.textSecondary }}>
                    {perf.total_load_time_ms < 2000 ? 'Excellent - Very fast' :
                     perf.total_load_time_ms < 4000 ? 'Good - Acceptable speed' :
                     perf.total_load_time_ms < 8000 ? 'Average - Could improve' : 'Poor - Needs optimization'}
                  </span>
                </div>
                <div>
                  <strong>Layout Stability: </strong>
                  <span style={{ color: colors.textSecondary }}>
                    {perf.cumulative_layout_shift < 0.1 ? 'Excellent - Minimal shifts' :
                     perf.cumulative_layout_shift < 0.25 ? 'Good - Some shifts' : 'Poor - Unstable layout'}
                  </span>
                </div>
                <div>
                  <strong>Request Count: </strong>
                  <span style={{ color: colors.textSecondary }}>
                    {perf.total_requests} requests ({perf.total_size_kb.toFixed(1)}KB total)
                  </span>
                </div>
              </div>
            </ContentCard>
          </>
        );

      case 'console':
        return (
          <>
            {result.console_logs && result.console_logs.length > 0 ? (
              <>
                <SectionTitle><FiTerminal /> Console Messages ({result.console_logs.length})</SectionTitle>
                <ListContainer>
                  {result.console_logs.map((log, index) => {
                    const logMessage = typeof log === 'string' ? log : log.message;
                    const logLevel = typeof log === 'object' && log.level ? log.level : 'log';
                    
                    return (
                      <ConsoleLogItem key={index} $level={logLevel}>
                        <span className="level">{logLevel}</span>
                        <span className="message">{logMessage}</span>
                      </ConsoleLogItem>
                    );
                  })}
                </ListContainer>
              </>
            ) : (
              <p style={{ color: colors.textSecondary }}>No console messages captured.</p>
            )}
            
            {result.cookies && Object.keys(result.cookies).length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <SectionTitle><FiLock /> Cookies ({Object.keys(result.cookies).length})</SectionTitle>
                <ListContainer style={{ maxHeight: '200px' }}>
                  {Object.entries(result.cookies).map(([name, value]) => (
                    <ListItem key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>{name}</strong>
                      <span style={{ color: colors.textSecondary, fontSize: '0.8125rem', wordBreak: 'break-all' }}>{value}</span>
                    </ListItem>
                  ))}
                </ListContainer>
              </div>
            )}
            
            {result.response_headers && Object.keys(result.response_headers).length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <SectionTitle><FiActivity /> Response Headers</SectionTitle>
                <ListContainer style={{ maxHeight: '200px' }}>
                  {Object.entries(result.response_headers).map(([header, value]) => (
                    <ListItem key={header} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>{header}</strong>
                      <span style={{ color: colors.textSecondary, fontSize: '0.8125rem' }}>{value}</span>
                    </ListItem>
                  ))}
                </ListContainer>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Input Section */}
      <InputCard>
        <InputRow>
          <InputGroup style={{ flex: 2 }}>
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
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="api-key-select">API Key</Label>
            <APIKeySelect
              id="api-key-select"
              value={selectedApiKey}
              onChange={(e) => setSelectedApiKey(e.target.value)}
              disabled={loading || loadingKeys}
            >
              {loadingKeys ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Select API key</option>
                  {apiKeys.map((key: any) => (
                    <option key={key.id} value={key.key}>
                      {key.name} {key.isActive ? '' : '(Inactive)'}
                    </option>
                  ))}
                </>
              )}
            </APIKeySelect>
          </InputGroup>
          
          <ScrapeButton 
            onClick={handleScrape} 
            disabled={loading || !selectedApiKey}
            $loading={loading}
          >
            {loading ? <FiLoader /> : <FiSearch />}
            {loading ? 'Analyzing...' : 'Analyze'}
          </ScrapeButton>
        </InputRow>
      </InputCard>

      {/* Loading State */}
      {loading && (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingTitle>Analyzing Website</LoadingTitle>
          <LoadingSubtitle>Extracting data, running security checks, and measuring performance...</LoadingSubtitle>
          <ProgressBarContainer>
            <ProgressBarFill />
          </ProgressBarContainer>
          <LoadingSteps>
            {loadingSteps.map((step, index) => (
              <LoadingStep 
                key={step.label} 
                $active={loadingStep === index}
                $complete={loadingStep > index}
              >
                {loadingStep > index ? <FiCheckCircle /> : <step.icon />}
                {step.label}
              </LoadingStep>
            ))}
          </LoadingSteps>
        </LoadingContainer>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorContainer>
          <FiAlertCircle />
          <ErrorText>
            <strong>Analysis Failed</strong>
            <span>{error}</span>
          </ErrorText>
        </ErrorContainer>
      )}

      {/* Results */}
      {result && !loading && (
        <ResultsCard>
          {/* Header */}
          <ResultsHeader>
            <SiteInfo>
              <SiteTitle>{result.title || 'Untitled Page'}</SiteTitle>
              <SiteURL>{result.url}</SiteURL>
            </SiteInfo>
            <ExportButton onClick={exportResults}>
              <FiDownload />
              Export JSON
            </ExportButton>
          </ResultsHeader>

          {/* Metrics */}
          <MetricsGrid>
            <MetricItem $delay={0}>
              <MetricValue>{result.word_count?.toLocaleString() || 0}</MetricValue>
              <MetricLabel>Words</MetricLabel>
            </MetricItem>
            <MetricItem $delay={1}>
              <MetricValue>{result.reading_time_minutes?.toFixed(1) || 0}m</MetricValue>
              <MetricLabel>Read Time</MetricLabel>
            </MetricItem>
            <MetricItem $delay={2}>
              <MetricValue>{result.readability_score?.toFixed(0) || 0}</MetricValue>
              <MetricLabel>Readability</MetricLabel>
            </MetricItem>
            <MetricItem $delay={3}>
              <MetricValue>{result.links?.length || 0}</MetricValue>
              <MetricLabel>Links</MetricLabel>
            </MetricItem>
            <MetricItem $delay={4}>
              <MetricValue>{result.images?.length || 0}</MetricValue>
              <MetricLabel>Images</MetricLabel>
            </MetricItem>
            <MetricItem $delay={5}>
              <MetricValue>{result.page_size_kb?.toFixed(0) || 0}KB</MetricValue>
              <MetricLabel>Size</MetricLabel>
            </MetricItem>
          </MetricsGrid>

          {/* Desktop Tabs */}
          <DesktopTabsWrapper>
            <TabsContainer>
              <TabsList ref={tabsRef}>
                {tabs.map(tab => (
                  <TabButton
                    key={tab.id}
                    $active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="count">{tab.count}</span>
                    )}
                  </TabButton>
                ))}
              </TabsList>
            </TabsContainer>
            
            <TabContent>
              {renderTabContent(activeTab)}
            </TabContent>
          </DesktopTabsWrapper>

          {/* Mobile Accordion */}
          <AccordionContainer>
            {tabs.map(tab => (
              <AccordionItem key={tab.id}>
                <AccordionHeader
                  $expanded={expandedAccordions.has(tab.id)}
                  onClick={() => toggleAccordion(tab.id)}
                >
                  <AccordionTitle>
                    <tab.icon />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <AccordionBadge>{tab.count}</AccordionBadge>
                    )}
                  </AccordionTitle>
                  <AccordionChevron $expanded={expandedAccordions.has(tab.id)}>
                    <FiChevronDown />
                  </AccordionChevron>
                </AccordionHeader>
                <AccordionContent $expanded={expandedAccordions.has(tab.id)}>
                  {expandedAccordions.has(tab.id) && renderTabContent(tab.id)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionContainer>
        </ResultsCard>
      )}
    </Container>
  );
};

export default WebScraper;
