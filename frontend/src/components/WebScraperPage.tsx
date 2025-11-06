import React from 'react';
import styled from 'styled-components';
import WebScraper from './WebScraper';

// Color Palette matching landing page
const colors = {
  raisinBlack: '#1A1423',
  charcoal: '#36454F',
  mutedBlue: '#5A6C7D',
  accent: '#7B68EE',
  lightBlue: '#87CEEB',
  white: '#FFFFFF',
  gray: '#B8B8B8',
  darkGray: '#2A2A2A'
};

const ScraperPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.white};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const PageDescription = styled.p`
  margin: 0;
  color: ${colors.gray};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const WebScraperPage: React.FC = () => {
  return (
    <ScraperPageContainer>
      <PageHeader>
        <PageTitle>Web Scraper</PageTitle>
        <PageDescription>
          Extract comprehensive data from any website including content, metadata, 
          performance metrics, security analysis, and network requests.
        </PageDescription>
      </PageHeader>
      
      <WebScraper />
    </ScraperPageContainer>
  );
};

export default WebScraperPage;