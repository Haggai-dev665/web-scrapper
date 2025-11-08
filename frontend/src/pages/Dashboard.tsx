import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardHome from '../components/DashboardHome';
import ApiKeysPage from '../components/ApiKeysPage';
import UsageAnalytics from '../components/UsageAnalytics';
import SettingsPage from '../components/SettingsPage';
import WebScraperPage from '../components/WebScraperPage';
import ApiDocsPage from '../components/ApiDocsPage';
import colors from '../theme/colors';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.cream};
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
  
  @media (max-width: 1024px) {
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const PlaceholderPage = styled.div`
  background: ${colors.white};
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 15px ${colors.shadow};
  text-align: center;
  
  h2 {
    color: ${colors.brown};
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.textSecondary};
    font-size: 1.1rem;
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
        return (
          <PlaceholderPage>
            <h2>📋 Scraping History</h2>
            <p>View your complete scraping history with detailed results and analytics.</p>
          </PlaceholderPage>
        );
      case 'api-keys':
        return <ApiKeysPage />;
      case 'analytics':
        return <UsageAnalytics />;
      case 'network':
        return (
          <PlaceholderPage>
            <h2>🌐 Network Analysis</h2>
            <p>Analyze network requests, performance metrics, and resource loading for scraped websites.</p>
          </PlaceholderPage>
        );
      case 'security':
        return (
          <PlaceholderPage>
            <h2>🔒 Security Reports</h2>
            <p>Comprehensive security analysis including HTTPS status, headers, vulnerabilities, and recommendations.</p>
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