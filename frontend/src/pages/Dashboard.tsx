import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardHome from '../components/DashboardHome';
import ApiKeysPage from '../components/ApiKeysPage';
import UsageAnalytics from '../components/UsageAnalytics';
import SettingsPage from '../components/SettingsPage';
import WebScraperPage from '../components/WebScraperPage';
import ApiDocsPage from '../components/ApiDocsPage';
import ScrapingHistory from '../components/ScrapingHistory';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow-x: hidden;
  width: 100%;
`;

const MainContent = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  background: ${colors.backgroundSecondary};
  width: 100%;
  min-width: 0;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${colors.backgroundSecondary};
  width: 100%;
  max-width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 1024px) {
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const PlaceholderPage = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 3rem;
  box-shadow: ${colors.shadowMd};
  text-align: center;
  border: 1px solid ${colors.border};
  
  h2 {
    color: ${colors.textPrimary};
    font-size: 1.75rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    color: ${colors.textSecondary};
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardHome />;
      case 'scraper':
        return <WebScraperPage />;
      case 'history':
        return <ScrapingHistory />;
      case 'api-keys':
        return <ApiKeysPage />;
      case 'analytics':
        return <UsageAnalytics />;
      case 'network':
        return (
          <PlaceholderPage>
            <h2>🌐 Network Analysis</h2>
            <p>View detailed network analysis in the Scraper page results tab after scraping a website.</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Network requests, response times, and resource loading data are displayed in real-time after each scrape operation.</p>
          </PlaceholderPage>
        );
      case 'security':
        return (
          <PlaceholderPage>
            <h2>🔒 Security Reports</h2>
            <p>View comprehensive security analysis in the Scraper page results tab after scraping a website.</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Security headers, HTTPS status, vulnerabilities, and recommendations are analyzed automatically with each scrape.</p>
          </PlaceholderPage>
        );
      case 'documentation':
        return <ApiDocsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />
      <MainContent sidebarOpen={sidebarOpen}>
        <Navbar 
          user={user}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <ContentArea>
          {renderPage()}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;