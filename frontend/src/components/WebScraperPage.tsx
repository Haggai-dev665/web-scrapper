import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiGlobe, FiZap, FiShield, FiCode } from 'react-icons/fi';
import WebScraper from './WebScraper';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ScraperPageContainer = styled.div`
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
  max-width: 700px;
`;

const FeaturesRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FeatureTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${colors.textSecondary};
  
  svg {
    color: ${colors.primary};
    font-size: 0.9rem;
  }
`;

const WebScraperPage: React.FC = () => {
  return (
    <ScraperPageContainer>
      <PageHeader>
        <PageTitle>
          <FiGlobe />
          Web Scraper
        </PageTitle>
        <PageDescription>
          Extract comprehensive data from any website including content, metadata, 
          performance metrics, security analysis, and network requests.
        </PageDescription>
      </PageHeader>
      
      <FeaturesRow>
        <FeatureTag>
          <FiZap />
          Fast Extraction
        </FeatureTag>
        <FeatureTag>
          <FiShield />
          Security Analysis
        </FeatureTag>
        <FeatureTag>
          <FiCode />
          Meta & Schema Data
        </FeatureTag>
      </FeaturesRow>
      
      <WebScraper />
    </ScraperPageContainer>
  );
};

export default WebScraperPage;
