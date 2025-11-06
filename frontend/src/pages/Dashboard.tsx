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

// Modern Color Palette
const colors = {
  // Primary colors
  primary: '#6366F1',        // Indigo
  primaryDark: '#4F46E5',    // Dark Indigo
  primaryLight: '#A5B4FC',   // Light Indigo
  
  // Backgrounds
  background: '#FFFFFF',      // Pure white
  backgroundSecondary: '#F8FAFC', // Light gray
  backgroundTertiary: '#F1F5F9',  // Lighter gray
  
  // Text colors
  textPrimary: '#0F172A',    // Dark slate
  textSecondary: '#475569',  // Medium slate
  textMuted: '#94A3B8',      // Light slate
  
  // Accent colors
  success: '#10B981',        // Emerald
  warning: '#F59E0B',        // Amber
  error: '#EF4444',          // Red
  info: '#3B82F6',           // Blue
  
  // Border and dividers
  border: '#E2E8F0',         // Light border
  borderLight: '#F1F5F9',    // Very light border
  
  // Shadows and overlays
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  background: ${colors.backgroundSecondary};

  @media (max-width: 1024px) {
    margin-left: ${props => props.sidebarOpen ? '280px' : '0'};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  background: ${colors.backgroundSecondary};
  
  @media (max-width: 1024px) {
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
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
      case 'api-keys':
        return <ApiKeysPage />;
      case 'analytics':
        return <UsageAnalytics />;
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