import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiActivity, 
  FiKey, 
  FiGlobe, 
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiAlertCircle,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiShield,
  FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Loader from './Loader';
import colors from '../theme/colors';

// Animations
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

// Styled Components
const HomeContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
`;

const WelcomeSection = styled.div`
  background: ${colors.gradientHero};
  padding: 2rem 2.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.5s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: ${colors.primary}20;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: -50px;
    width: 150px;
    height: 150px;
    background: ${colors.accent}15;
    border-radius: 50%;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const WelcomeText = styled.div``;

const WelcomeTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textLight};
  line-height: 1.3;
  
  span {
    background: ${colors.gradientGlow};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 1rem;
  line-height: 1.5;
`;

const QuickAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 15px ${colors.primary}40;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${colors.primary}50;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div<{ $delay?: number }>`
  background: ${colors.surface};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  transition: all 0.2s ease;
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: ${props => (props.$delay || 0) * 0.1}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${colors.shadowLg};
    border-color: ${colors.primary}30;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div<{ $color?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$color || colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || colors.primary};
  font-size: 1.25rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1;
  font-family: 'JetBrains Mono', monospace;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: ${props => props.$positive ? colors.success : colors.error};
  font-weight: 600;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${colors.surface};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${colors.backgroundSecondary};
  padding: 0.25rem;
  border-radius: 8px;
`;

const ChartTab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  background: ${props => props.$active ? colors.surface : 'transparent'};
  color: ${props => props.$active ? colors.textPrimary : colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: ${props => props.$active ? colors.shadow : 'none'};
  
  &:hover {
    color: ${colors.textPrimary};
  }
`;;

// Custom CSS Chart
const ChartContainer = styled.div`
  height: 250px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 0 0.5rem;
`;

const ChartBar = styled.div<{ $height: number; $delay: number }>`
  flex: 1;
  height: ${props => props.$height}%;
  background: ${colors.gradientPrimary};
  border-radius: 6px 6px 0 0;
  position: relative;
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: ${props => props.$delay * 0.05}s;
  animation-fill-mode: both;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 4px;
  
  &:hover {
    filter: brightness(1.1);
    transform: scaleY(1.02);
    transform-origin: bottom;
  }
  
  &::after {
    content: attr(data-value);
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    font-weight: 600;
    color: ${colors.textSecondary};
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.5rem 0;
  border-top: 1px solid ${colors.border};
  margin-top: 0.5rem;
`;

const ChartLabel = styled.span`
  font-size: 0.7rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

// Donut Chart
const DonutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const DonutChart = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
  margin-bottom: 1.5rem;
`;

const DonutSvg = styled.svg`
  transform: rotate(-90deg);
`;

const DonutCircle = styled.circle<{ $offset: number; $color: string; $dasharray: string }>`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 20;
  stroke-dasharray: ${props => props.$dasharray};
  stroke-dashoffset: ${props => props.$offset};
  transition: stroke-dashoffset 1s ease;
`;

const DonutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    font-family: 'JetBrains Mono', monospace;
  }
  
  .label {
    font-size: 0.75rem;
    color: ${colors.textMuted};
    font-weight: 500;
  }
`;

const DonutLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const LegendLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const LegendValue = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
`;

// Activity Section
const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  background: ${colors.surface};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ActivityTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const ViewAllLink = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: inherit;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 320px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 2px;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.backgroundSecondary};
  border-radius: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primary}08;
  }
`;

const ActivityIcon = styled.div<{ $color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.$color || colors.success}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || colors.success};
  font-size: 1rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: 0.85rem;
  color: ${colors.textPrimary};
  font-weight: 500;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${colors.textMuted};
`;

// Quick Actions Section
const QuickActionsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.button<{ $delay?: number }>`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  padding: 1.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
  animation: ${fadeInUp} 0.5s ease-out;
  animation-delay: ${props => (props.$delay || 0) * 0.1}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${colors.shadowLg};
    border-color: ${colors.primary}30;
  }
`;

const ActionIcon = styled.div<{ $gradient?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$gradient || colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const ActionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const ActionDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.textMuted};
  
  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .title {
    font-weight: 600;
    color: ${colors.textSecondary};
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.85rem;
  }
`;

// Loading State
const LoadingCard = styled.div`
  background: ${colors.surface};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

// Component
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
  const [activities, setActivities] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [topDomains, setTopDomains] = useState<{ domain: string; count: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await apiService.getDashboardStats();
      
      setStats({
        totalRequests: dashboardData.total_requests_this_month || 0,
        totalRequestsToday: dashboardData.total_requests_today || 0,
        requestsRemaining: dashboardData.requests_remaining || 0,
        activeKeys: dashboardData.active_api_keys || 0,
        successRate: dashboardData.success_rate || 0,
        avgResponseTime: dashboardData.avg_response_time_ms || 0
      });
      
      // Transform recent activity
      const recentActivities = (dashboardData.recent_activity || []).slice(0, 6).map((activity: any, index: number) => {
        try {
          const hostname = activity.url_scraped ? new URL(activity.url_scraped).hostname : '';
          return {
            id: index + 1,
            type: activity.success ? 'success' : 'error',
            text: activity.url_scraped 
              ? `Scraped ${hostname}`
              : `${activity.endpoint} request`,
            status: activity.success ? 'Completed' : 'Failed',
            time: formatTimeAgo(activity.timestamp),
            icon: activity.success ? FiCheck : FiAlertCircle,
            color: activity.success ? colors.success : colors.error
          };
        } catch {
          return {
            id: index + 1,
            type: activity.success ? 'success' : 'error',
            text: `API request`,
            status: activity.success ? 'Completed' : 'Failed',
            time: formatTimeAgo(activity.timestamp),
            icon: activity.success ? FiCheck : FiAlertCircle,
            color: activity.success ? colors.success : colors.error
          };
        }
      });
      
      setActivities(recentActivities);
      setUsageData(dashboardData.usage_by_day || generateMockChartData());
      
      // Extract and count top domains from recent activity
      const domainCounts: { [domain: string]: number } = {};
      (dashboardData.recent_activity || []).forEach((activity: any) => {
        if (activity.url_scraped) {
          try {
            const hostname = new URL(activity.url_scraped).hostname;
            domainCounts[hostname] = (domainCounts[hostname] || 0) + 1;
          } catch {
            // Invalid URL, skip
          }
        }
      });
      
      // Convert to array and sort by count
      const sortedDomains = Object.entries(domainCounts)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 domains
      
      setTopDomains(sortedDomains);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard data');
      setUsageData(generateMockChartData());
      setLoading(false);
    }
  };

  const generateMockChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      day,
      requests: Math.floor(Math.random() * 100) + 20
    }));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Calculate chart data
  const chartData = useMemo(() => {
    if (usageData.length === 0) {
      return generateMockChartData();
    }
    return usageData;
  }, [usageData]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((d: any) => d.requests || 0), 1);
  }, [chartData]);

  // Donut chart data
  const donutData = useMemo(() => {
    const successful = stats.totalRequests * (stats.successRate / 100);
    const failed = stats.totalRequests - successful;
    return {
      successful: Math.round(successful),
      failed: Math.round(failed),
      total: stats.totalRequests
    };
  }, [stats]);

  const circumference = 2 * Math.PI * 70;
  const successOffset = circumference - (circumference * (donutData.successful / Math.max(donutData.total, 1)));
  const failedOffset = circumference - (circumference * (donutData.failed / Math.max(donutData.total, 1)));

  if (loading) {
    return (
      <HomeContainer>
        <Loader text="Loading dashboard..." subtext="Fetching your analytics" />
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeContent>
          <WelcomeText>
            <WelcomeTitle>
              Welcome back, <span>{user?.first_name || 'Developer'}</span>! 👋
            </WelcomeTitle>
            <WelcomeSubtitle>
              Here's what's happening with your web scraping operations today.
            </WelcomeSubtitle>
          </WelcomeText>
          <QuickAction>
            <FiGlobe />
            Start Scraping
            <FiArrowRight />
          </QuickAction>
        </WelcomeContent>
      </WelcomeSection>

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard $delay={0}>
          <StatHeader>
            <StatTitle>Total Requests</StatTitle>
            <StatIcon $color={colors.primary}>
              <FiActivity />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalRequests.toLocaleString()}</StatValue>
          <StatChange $positive>
            <FiTrendingUp size={14} />
            This month
          </StatChange>
        </StatCard>

        <StatCard $delay={1}>
          <StatHeader>
            <StatTitle>Active API Keys</StatTitle>
            <StatIcon $color={colors.accent}>
              <FiKey />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.activeKeys}</StatValue>
          <StatChange $positive>
            <FiCheck size={14} />
            All healthy
          </StatChange>
        </StatCard>

        <StatCard $delay={2}>
          <StatHeader>
            <StatTitle>Success Rate</StatTitle>
            <StatIcon $color={colors.success}>
              <FiTrendingUp />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.successRate.toFixed(1)}%</StatValue>
          <StatChange $positive={stats.successRate >= 95}>
            {stats.successRate >= 95 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {stats.successRate >= 95 ? 'Excellent' : 'Needs improvement'}
          </StatChange>
        </StatCard>

        <StatCard $delay={3}>
          <StatHeader>
            <StatTitle>Avg Response</StatTitle>
            <StatIcon $color={colors.warning}>
              <FiClock />
            </StatIcon>
          </StatHeader>
          <StatValue>{Math.round(stats.avgResponseTime)}ms</StatValue>
          <StatChange $positive={stats.avgResponseTime < 2000}>
            {stats.avgResponseTime < 2000 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {stats.avgResponseTime < 2000 ? 'Fast' : 'Slow'}
          </StatChange>
        </StatCard>
      </StatsGrid>

      {/* Charts Section */}
      <ChartsSection>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FiBarChart2 />
              Request Volume
            </ChartTitle>
            <ChartTabs>
              <ChartTab $active={chartPeriod === '7d'} onClick={() => setChartPeriod('7d')}>7 Days</ChartTab>
              <ChartTab $active={chartPeriod === '30d'} onClick={() => setChartPeriod('30d')}>30 Days</ChartTab>
              <ChartTab $active={chartPeriod === '90d'} onClick={() => setChartPeriod('90d')}>90 Days</ChartTab>
            </ChartTabs>
          </ChartHeader>
          <ChartContainer>
            {chartData.map((data: any, index: number) => (
              <ChartBar
                key={index}
                $height={((data.requests || 0) / maxValue) * 100}
                $delay={index}
                data-value={data.requests || 0}
              />
            ))}
          </ChartContainer>
          <ChartLabels>
            {chartData.map((data: any, index: number) => (
              <ChartLabel key={index}>{data.day}</ChartLabel>
            ))}
          </ChartLabels>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FiShield />
              Request Status
            </ChartTitle>
          </ChartHeader>
          <DonutContainer>
            <DonutChart>
              <DonutSvg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke={colors.border}
                  strokeWidth="20"
                />
                <DonutCircle
                  cx="90"
                  cy="90"
                  r="70"
                  $color={colors.success}
                  $dasharray={`${circumference}`}
                  $offset={successOffset}
                />
              </DonutSvg>
              <DonutCenter>
                <div className="value">{stats.successRate.toFixed(0)}%</div>
                <div className="label">Success</div>
              </DonutCenter>
            </DonutChart>
            <DonutLegend>
              <LegendItem>
                <LegendLabel>
                  <LegendDot $color={colors.success} />
                  Successful
                </LegendLabel>
                <LegendValue>{donutData.successful.toLocaleString()}</LegendValue>
              </LegendItem>
              <LegendItem>
                <LegendLabel>
                  <LegendDot $color={colors.error} />
                  Failed
                </LegendLabel>
                <LegendValue>{donutData.failed.toLocaleString()}</LegendValue>
              </LegendItem>
            </DonutLegend>
          </DonutContainer>
        </ChartCard>
      </ChartsSection>

      {/* Activity Section */}
      <ActivitySection>
        <ActivityCard>
          <ActivityHeader>
            <ActivityTitle>Recent Activity</ActivityTitle>
            <ViewAllLink>
              View All <FiArrowRight size={12} />
            </ViewAllLink>
          </ActivityHeader>
          <ActivityList>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon $color={activity.color}>
                    <activity.icon />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>{activity.text}</ActivityText>
                    <ActivityMeta>
                      <span>{activity.status}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <FiActivity size={32} />
                <div className="title">No recent activity</div>
                <div className="description">Start scraping to see activity here</div>
              </EmptyState>
            )}
          </ActivityList>
        </ActivityCard>

        <ActivityCard>
          <ActivityHeader>
            <ActivityTitle>Top Scraped Domains</ActivityTitle>
          </ActivityHeader>
          <ActivityList>
            {topDomains.length > 0 ? (
              topDomains.map((domainData, index) => (
                <ActivityItem key={domainData.domain}>
                  <ActivityIcon $color={colors.primary}>
                    <FiGlobe />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>{domainData.domain}</ActivityText>
                    <ActivityMeta>
                      <span>{domainData.count} {domainData.count === 1 ? 'request' : 'requests'}</span>
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <FiGlobe size={32} />
                <div className="title">No domains scraped yet</div>
                <div className="description">Scraped domains will appear here</div>
              </EmptyState>
            )}
          </ActivityList>
        </ActivityCard>
      </ActivitySection>

      {/* Quick Actions */}
      <QuickActionsSection>
        <ActionCard $delay={0}>
          <ActionIcon>
            <FiGlobe />
          </ActionIcon>
          <ActionTitle>Start Scraping</ActionTitle>
          <ActionDescription>
            Launch the web scraper to extract data from any website instantly.
          </ActionDescription>
        </ActionCard>

        <ActionCard $delay={1}>
          <ActionIcon $gradient={`linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`}>
            <FiKey />
          </ActionIcon>
          <ActionTitle>Manage API Keys</ActionTitle>
          <ActionDescription>
            Create and manage API keys for programmatic access.
          </ActionDescription>
        </ActionCard>

        <ActionCard $delay={2}>
          <ActionIcon $gradient={`linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`}>
            <FiZap />
          </ActionIcon>
          <ActionTitle>View Documentation</ActionTitle>
          <ActionDescription>
            Learn how to integrate our API into your applications.
          </ActionDescription>
        </ActionCard>
      </QuickActionsSection>
    </HomeContainer>
  );
};

export default DashboardHome;
