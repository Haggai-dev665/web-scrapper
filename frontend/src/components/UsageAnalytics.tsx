import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiClock, 
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiDatabase,
  FiZap,
  FiPieChart
} from 'react-icons/fi';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AnalyticsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
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
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const RefreshButton = styled.button<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${colors.surface};
  color: ${colors.textSecondary};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  
  svg {
    animation: ${props => props.$loading ? spin : 'none'} 1s linear infinite;
  }
  
  &:hover {
    background: ${colors.backgroundSecondary};
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimeFilter = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${colors.surface};
  padding: 0.25rem;
  border-radius: 10px;
  border: 1px solid ${colors.border};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${props => props.$active ? colors.textLight : colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$active ? colors.primary : colors.backgroundSecondary};
    color: ${props => props.$active ? colors.textLight : colors.textPrimary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${colors.surface};
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid ${colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary}30;
    box-shadow: ${colors.shadowMd};
  }
`;

const StatIcon = styled.div<{ $color?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${props => props.$color || colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || colors.primary};
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$positive ? colors.success : colors.error}15;
  color: ${props => props.$positive ? colors.success : colors.error};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${colors.surface};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${colors.border};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
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

const ChartLegend = styled.div`
  display: flex;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${colors.textMuted};
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.border};
`;

const BarGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 100%;
  max-width: 40px;
  height: ${props => props.$height}%;
  background: ${props => props.$color};
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    opacity: 0.85;
    transform: scaleY(1.02);
    transform-origin: bottom;
  }
  
  &:hover::after {
    content: '${props => Math.round(props.$height)}%';
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    background: ${colors.secondary};
    color: ${colors.textLight};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
  }
`;

const BarLabel = styled.div`
  font-size: 0.7rem;
  color: ${colors.textMuted};
  text-align: center;
`;

const DonutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const DonutChart = styled.svg`
  width: 160px;
  height: 160px;
  transform: rotate(-90deg);
`;

const DonutStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1rem;
`;

const DonutStat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: ${colors.backgroundSecondary};
  border-radius: 8px;
`;

const DonutStatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
`;

const DonutStatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ListCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
`;

const ListTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewAllLink = styled.a`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${colors.primary};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DomainList = styled.div``;

const DomainItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  transition: background 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${colors.backgroundSecondary};
  }
`;

const DomainRank = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${colors.primary}15;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  margin-right: 1rem;
`;

const DomainInfo = styled.div`
  flex: 1;
`;

const DomainName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const DomainMeta = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
  margin-top: 0.125rem;
`;

const DomainCount = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
`;

const ActivityList = styled.div``;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => 
    props.$type === 'success' ? colors.success :
    props.$type === 'error' ? colors.error : colors.primary
  }15;
  color: ${props => 
    props.$type === 'success' ? colors.success :
    props.$type === 'error' ? colors.error : colors.primary
  };
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: ${colors.textPrimary};
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: ${colors.textMuted};
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }
  
  p {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: ${colors.textSecondary};
  }
  
  small {
    font-size: 0.85rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid ${colors.border};
    border-top: 3px solid ${colors.primary};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.textSecondary};
    margin: 0;
    font-weight: 500;
  }
`;

const UsageAnalytics: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsageAnalytics(timeRange);
      setAnalytics(data);
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to load analytics data', type: 'error' });
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    showToast({ title: 'Refreshed', message: 'Analytics data updated', type: 'success' });
  };

  if (loading) {
    return (
      <AnalyticsContainer>
        <LoadingSpinner>
          <div className="spinner" />
          <p>Loading analytics data...</p>
        </LoadingSpinner>
      </AnalyticsContainer>
    );
  }

  const usageData = analytics || {
    totalRequests: 1247,
    successfulRequests: 1189,
    failedRequests: 58,
    avgResponseTime: 342,
    dataProcessed: '2.4 GB',
    topDomains: ['github.com', 'stackoverflow.com', 'reddit.com', 'medium.com', 'dev.to']
  };

  const successRate = usageData.totalRequests > 0 
    ? ((usageData.successfulRequests / usageData.totalRequests) * 100).toFixed(1)
    : 0;
  const failureRate = usageData.totalRequests > 0 
    ? ((usageData.failedRequests / usageData.totalRequests) * 100).toFixed(1)
    : 0;

  // Mock weekly data for bar chart
  const weeklyData = [
    { day: 'Mon', requests: 85 },
    { day: 'Tue', requests: 72 },
    { day: 'Wed', requests: 95 },
    { day: 'Thu', requests: 68 },
    { day: 'Fri', requests: 88 },
    { day: 'Sat', requests: 45 },
    { day: 'Sun', requests: 38 },
  ];

  const maxRequests = Math.max(...weeklyData.map(d => d.requests));

  // Mock recent activity
  const recentActivity = [
    { type: 'success' as const, text: 'Scraped github.com/trending successfully', time: '2 minutes ago' },
    { type: 'success' as const, text: 'Extracted 1,247 data points from reddit.com', time: '15 minutes ago' },
    { type: 'error' as const, text: 'Failed to connect to target.com (timeout)', time: '1 hour ago' },
    { type: 'success' as const, text: 'Batch scraping completed (50 URLs)', time: '3 hours ago' },
    { type: 'info' as const, text: 'API key usage: 42% of monthly limit', time: '5 hours ago' },
  ];

  return (
    <AnalyticsContainer>
      <PageHeader>
        <HeaderContent>
          <PageTitle>
            <FiActivity />
            Usage Analytics
          </PageTitle>
          <PageDescription>
            Monitor your API usage, track scraping performance, and analyze data insights.
          </PageDescription>
        </HeaderContent>
        <HeaderActions>
          <TimeFilter>
            <FilterButton $active={timeRange === '24h'} onClick={() => setTimeRange('24h')}>
              24h
            </FilterButton>
            <FilterButton $active={timeRange === '7d'} onClick={() => setTimeRange('7d')}>
              7d
            </FilterButton>
            <FilterButton $active={timeRange === '30d'} onClick={() => setTimeRange('30d')}>
              30d
            </FilterButton>
          </TimeFilter>
          <RefreshButton onClick={handleRefresh} disabled={refreshing} $loading={refreshing}>
            <FiRefreshCw size={16} />
            Refresh
          </RefreshButton>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon $color={colors.primary}>
            <FiActivity />
          </StatIcon>
          <StatValue>{usageData.totalRequests.toLocaleString()}</StatValue>
          <StatLabel>Total Requests</StatLabel>
          <StatChange $positive>
            <FiTrendingUp size={12} />
            +12.5%
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatIcon $color={colors.success}>
            <FiCheckCircle />
          </StatIcon>
          <StatValue>{usageData.successfulRequests.toLocaleString()}</StatValue>
          <StatLabel>Successful</StatLabel>
          <StatChange $positive>
            {successRate}% rate
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatIcon $color={colors.error}>
            <FiXCircle />
          </StatIcon>
          <StatValue>{usageData.failedRequests.toLocaleString()}</StatValue>
          <StatLabel>Failed</StatLabel>
          <StatChange $positive={Number(failureRate) < 5}>
            {failureRate}% rate
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatIcon $color={colors.accent}>
            <FiZap />
          </StatIcon>
          <StatValue>{usageData.avgResponseTime}ms</StatValue>
          <StatLabel>Avg Response</StatLabel>
          <StatChange $positive>
            <FiTrendingUp size={12} />
            -8.3%
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatIcon $color={colors.warning}>
            <FiDatabase />
          </StatIcon>
          <StatValue>{usageData.dataProcessed}</StatValue>
          <StatLabel>Data Processed</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FiTrendingUp size={18} />
              Weekly Request Volume
            </ChartTitle>
            <ChartLegend>
              <LegendItem>
                <LegendDot $color={colors.primary} />
                Requests
              </LegendItem>
            </ChartLegend>
          </ChartHeader>
          <BarChart>
            {weeklyData.map((item) => (
              <BarGroup key={item.day}>
                <Bar 
                  $height={(item.requests / maxRequests) * 100} 
                  $color={colors.primary}
                />
                <BarLabel>{item.day}</BarLabel>
              </BarGroup>
            ))}
          </BarChart>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <FiPieChart size={18} />
              Success Rate
            </ChartTitle>
          </ChartHeader>
          <DonutContainer>
            <DonutChart viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors.border}
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors.success}
                strokeWidth="12"
                strokeDasharray={`${Number(successRate) * 2.51} 251`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors.error}
                strokeWidth="12"
                strokeDasharray={`${Number(failureRate) * 2.51} 251`}
                strokeDashoffset={`-${Number(successRate) * 2.51}`}
                strokeLinecap="round"
              />
            </DonutChart>
          </DonutContainer>
          <DonutStats>
            <DonutStat>
              <DonutStatLabel>
                <LegendDot $color={colors.success} />
                Success
              </DonutStatLabel>
              <DonutStatValue>{successRate}%</DonutStatValue>
            </DonutStat>
            <DonutStat>
              <DonutStatLabel>
                <LegendDot $color={colors.error} />
                Failed
              </DonutStatLabel>
              <DonutStatValue>{failureRate}%</DonutStatValue>
            </DonutStat>
          </DonutStats>
        </ChartCard>
      </ChartsGrid>

      <BottomGrid>
        <ListCard>
          <ListHeader>
            <ListTitle>
              <FiGlobe size={18} />
              Top Scraped Domains
            </ListTitle>
            <ViewAllLink>View All</ViewAllLink>
          </ListHeader>
          <DomainList>
            {usageData.topDomains.length > 0 ? (
              usageData.topDomains.map((domain: string, index: number) => (
                <DomainItem key={domain}>
                  <DomainRank>{index + 1}</DomainRank>
                  <DomainInfo>
                    <DomainName>{domain}</DomainName>
                    <DomainMeta>Last scraped 2h ago</DomainMeta>
                  </DomainInfo>
                  <DomainCount>{Math.floor(Math.random() * 200 + 50)}</DomainCount>
                </DomainItem>
              ))
            ) : (
              <EmptyState>
                <FiGlobe />
                <p>No domains scraped yet</p>
                <small>Start scraping to see analytics</small>
              </EmptyState>
            )}
          </DomainList>
        </ListCard>

        <ListCard>
          <ListHeader>
            <ListTitle>
              <FiClock size={18} />
              Recent Activity
            </ListTitle>
            <ViewAllLink>View All</ViewAllLink>
          </ListHeader>
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $type={activity.type}>
                  {activity.type === 'success' ? <FiCheckCircle size={16} /> :
                   activity.type === 'error' ? <FiXCircle size={16} /> :
                   <FiActivity size={16} />}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </ListCard>
      </BottomGrid>
    </AnalyticsContainer>
  );
};

export default UsageAnalytics;
