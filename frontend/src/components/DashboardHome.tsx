import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiKey, 
  FiGlobe, 
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
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

const HomeContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: ${colors.shadowLg};
  
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1.125rem;
  line-height: 1.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: ${colors.background};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${colors.shadowLg}, 0 0 0 1px ${colors.primary}20;
    border-color: ${colors.primary}30;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color || colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: ${colors.shadowMd};
  font-size: 1.25rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.positive ? colors.success : colors.error};
  font-weight: 600;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ChartCard = styled.div`
  background: ${colors.background};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
`;

const ChartTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
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

const ActivityFeed = styled.div`
  background: ${colors.background};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
  max-height: 480px;
  overflow-y: auto;
`;

const ActivityTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${colors.success};
    border-radius: 2px;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color || colors.info};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: ${colors.shadow};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ActionCard = styled.button`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  padding: 2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  box-shadow: ${colors.shadowMd};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${colors.shadowLg};
    border-color: ${colors.primary};
  }
`;

const ActionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: ${colors.shadowMd};
  font-size: 1.5rem;
`;

const ActionTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const ActionDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalRequestsToday: 0,
    requestsRemaining: 0,
    activeKeys: 0,
    successRate: 0,
    avgResponseTime: 0
  });
  const [activities, setActivities] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real dashboard data from backend
      const dashboardData = await apiService.getDashboardStats();
      
      setStats({
        totalRequests: dashboardData.total_requests_this_month || 0,
        totalRequestsToday: dashboardData.total_requests_today || 0,
        requestsRemaining: dashboardData.requests_remaining || 0,
        activeKeys: dashboardData.active_api_keys || 0,
        successRate: dashboardData.success_rate || 0,
        avgResponseTime: dashboardData.avg_response_time_ms || 0
      });
      
      // Transform recent activity from backend format
      const recentActivities = (dashboardData.recent_activity || []).map((activity: any, index: number) => {
        try {
          return {
            id: index + 1,
            type: activity.success ? 'scrape' : 'error',
            text: activity.url_scraped 
              ? `${activity.success ? 'Successfully scraped' : 'Failed to scrape'} data from ${new URL(activity.url_scraped).hostname}`
              : `${activity.endpoint} request ${activity.success ? 'completed' : 'failed'}`,
            time: formatTimeAgo(activity.timestamp),
            icon: activity.success ? FiGlobe : FiAlertCircle,
            color: activity.success ? colors.success : colors.error
          };
        } catch (urlError) {
          // Fallback for invalid URLs
          return {
            id: index + 1,
            type: activity.success ? 'scrape' : 'error',
            text: `${activity.endpoint} request ${activity.success ? 'completed' : 'failed'}`,
            time: formatTimeAgo(activity.timestamp),
            icon: activity.success ? FiGlobe : FiAlertCircle,
            color: activity.success ? colors.success : colors.error
          };
        }
      });
      
      setActivities(recentActivities);
      
      // Set usage data for potential charts
      setUsageData(dashboardData.usage_by_day || []);
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard data');
      
      // Fallback to show some basic structure even if API fails
      setStats({
        totalRequests: 0,
        totalRequestsToday: 0,
        requestsRemaining: 0,
        activeKeys: 0,
        successRate: 0,
        avgResponseTime: 0
      });
      setActivities([]);
      setUsageData([]);
      setLoading(false);
    }
  };

  // Helper function to format timestamps
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
      return `${diffInMinutes || 1} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const LoadingCard = styled.div`
    background: ${colors.background};
    padding: 2rem;
    border-radius: 20px;
    box-shadow: ${colors.shadowLg};
    border: 1px solid ${colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: ${colors.textMuted};
    font-weight: 600;
  `;

  if (loading) {
    return (
      <HomeContainer>
        <Loader text="Loading dashboard data..." subtext="Please wait while we fetch your analytics" />
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <LoadingCard>
          <div style={{ textAlign: 'center', color: colors.error }}>
            <FiAlertCircle size={32} style={{ marginBottom: '1rem' }} />
            <div>{error}</div>
            <button 
              onClick={fetchDashboardData}
              style={{ 
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </LoadingCard>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeTitle>Welcome back, {user?.first_name}!</WelcomeTitle>
          <WelcomeSubtitle>
            Here's what's happening with your web scraping operations today.
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Requests</StatTitle>
            <StatIcon color={colors.primary}>
              <FiActivity />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalRequests.toLocaleString()}</StatValue>
          <StatChange positive>
            <FiTrendingUp />
            This month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active API Keys</StatTitle>
            <StatIcon color={colors.info}>
              <FiKey />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.activeKeys}</StatValue>
          <StatChange positive>
            <FiTrendingUp />
            Available keys
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Success Rate</StatTitle>
            <StatIcon color={colors.success}>
              <FiTrendingUp />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.successRate.toFixed(1)}%</StatValue>
          <StatChange positive>
            <FiTrendingUp />
            Overall performance
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Avg Response Time</StatTitle>
            <StatIcon color={colors.warning}>
              <FiClock />
            </StatIcon>
          </StatHeader>
          <StatValue>{Math.round(stats.avgResponseTime)}ms</StatValue>
          <StatChange positive>
            <FiTrendingUp />
            Average speed
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>📊 Request Volume (Last 30 Days)</ChartTitle>
          <div style={{ 
            height: '280px', 
            background: colors.backgroundSecondary, 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: colors.textMuted,
            border: `2px dashed ${colors.border}`,
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <FiActivity size={32} color={colors.primary} />
            <span style={{ fontWeight: 600 }}>Interactive chart coming soon</span>
            <span style={{ fontSize: '0.875rem' }}>Real-time analytics based on your scraping data</span>
          </div>
        </ChartCard>

        <ActivityFeed>
          <ActivityTitle>⚡ Recent Activity</ActivityTitle>
          {activities.length > 0 ? (
            activities.map((activity: any) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon color={activity.color}>
                  <activity.icon />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: colors.textMuted
            }}>
              <FiClock size={32} style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600 }}>No recent activity</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Start using the web scraper to see activity here
              </div>
            </div>
          )}
        </ActivityFeed>
      </ChartsGrid>

      <QuickActions>
        <ActionCard>
          <ActionIcon>
            <FiGlobe />
          </ActionIcon>
          <ActionTitle>Start Scraping</ActionTitle>
          <ActionDescription>
            Launch the web scraper to extract data from any website
          </ActionDescription>
        </ActionCard>

        <ActionCard>
          <ActionIcon>
            <FiKey />
          </ActionIcon>
          <ActionTitle>Manage API Keys</ActionTitle>
          <ActionDescription>
            Create, view, and manage your API keys for external integrations
          </ActionDescription>
        </ActionCard>

        <ActionCard>
          <ActionIcon>
            <FiActivity />
          </ActionIcon>
          <ActionTitle>View Analytics</ActionTitle>
          <ActionDescription>
            Analyze your usage patterns and performance metrics
          </ActionDescription>
        </ActionCard>
      </QuickActions>
    </HomeContainer>
  );
};

export default DashboardHome;