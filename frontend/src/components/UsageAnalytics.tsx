import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiClock, 
  FiGlobe,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';
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

const AnalyticsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 1.2;
`;

const PageDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 1.125rem;
  line-height: 1.5;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${colors.shadowMd};
  
  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${colors.shadowLg};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TimeFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MetricTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricSubtext = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
  margin-top: 0.5rem;
`;

const MetricChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: ${props => props.positive ? colors.success : colors.error};
  font-weight: 500;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const ChartPlaceholder = styled.div`
  height: 250px;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

const RecentActivity = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ActivityTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9fafb;
  border-left: 3px solid ${props => props.color || '#3b82f6'};
`;

const ActivityIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#3b82f6'};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.9rem;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const TableSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f9fafb;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f9fafb;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => 
    props.status === 'success' ? '#dcfce7' :
    props.status === 'error' ? '#fee2e2' :
    props.status === 'warning' ? '#fef3c7' : '#f3f4f6'
  };
  color: ${props => 
    props.status === 'success' ? '#166534' :
    props.status === 'error' ? '#991b1b' :
    props.status === 'warning' ? '#92400e' : '#374151'
  };
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${colors.border};
    border-top: 3px solid ${colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.textSecondary};
    margin: 0;
    font-weight: 500;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${colors.border};
  background: ${props => props.active ? colors.primary : colors.background};
  color: ${props => props.active ? 'white' : colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${colors.primary};
    color: ${props => props.active ? 'white' : colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.textMuted};
  
  p {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  
  small {
    font-size: 0.875rem;
  }
`;

const DomainItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DomainRank = styled.div`
  color: ${colors.primary};
  font-weight: 600;
  margin-right: 1rem;
  min-width: 30px;
`;

const DomainName = styled.div`
  color: ${colors.textPrimary};
  font-weight: 500;
`;

const DomainsList = styled.div`
  margin-top: 1rem;
`;

const UsageAnalytics: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <AnalyticsContainer>
        <Loader text="Loading analytics data..." subtext="Gathering your usage statistics" />
      </AnalyticsContainer>
    );
  }

  const usageData = analytics || {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    dataProcessed: '0 B',
    topDomains: []
  };

  return (
    <AnalyticsContainer>
      <PageHeader>
        <h1>📊 Usage Analytics</h1>
        <p>Monitor your API usage, scraping performance, and data insights</p>
        <TimeRangeSelector>
          <TimeButton 
            active={timeRange === '24h'} 
            onClick={() => setTimeRange('24h')}
          >
            24 Hours
          </TimeButton>
          <TimeButton 
            active={timeRange === '7d'} 
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </TimeButton>
          <TimeButton 
            active={timeRange === '30d'} 
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </TimeButton>
        </TimeRangeSelector>
      </PageHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricIcon className="requests">📡</MetricIcon>
          <MetricValue>{usageData.totalRequests.toLocaleString()}</MetricValue>
          <MetricLabel>Total Requests</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricIcon className="success">✅</MetricIcon>
          <MetricValue>{usageData.successfulRequests.toLocaleString()}</MetricValue>
          <MetricLabel>Successful</MetricLabel>
          <MetricSubtext>
            {usageData.totalRequests > 0 ? 
              ((usageData.successfulRequests / usageData.totalRequests) * 100).toFixed(1) : 0}% success rate
          </MetricSubtext>
        </MetricCard>
        
        <MetricCard>
          <MetricIcon className="failed">❌</MetricIcon>
          <MetricValue>{usageData.failedRequests.toLocaleString()}</MetricValue>
          <MetricLabel>Failed</MetricLabel>
          <MetricSubtext>
            {usageData.totalRequests > 0 ? 
              ((usageData.failedRequests / usageData.totalRequests) * 100).toFixed(1) : 0}% failure rate
          </MetricSubtext>
        </MetricCard>
        
        <MetricCard>
          <MetricIcon className="time">⚡</MetricIcon>
          <MetricValue>{usageData.avgResponseTime}ms</MetricValue>
          <MetricLabel>Avg Response Time</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricIcon className="data">💾</MetricIcon>
          <MetricValue>{usageData.dataProcessed}</MetricValue>
          <MetricLabel>Data Processed</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartTitle>📈 Request Volume Over Time</ChartTitle>
          <ChartPlaceholder>
            <div className="chart-content">
              <p>Real-time chart visualization coming soon</p>
              <small>Connect to analytics backend for live data</small>
            </div>
          </ChartPlaceholder>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>🎯 Top Scraped Domains</ChartTitle>
          <DomainsList>
            {usageData.topDomains.length > 0 ? (
              usageData.topDomains.map((domain: string, index: number) => (
                <DomainItem key={domain}>
                  <DomainRank>#{index + 1}</DomainRank>
                  <DomainName>{domain}</DomainName>
                </DomainItem>
              ))
            ) : (
              <EmptyState>
                <p>No domains scraped yet</p>
                <small>Start scraping websites to see analytics</small>
              </EmptyState>
            )}
          </DomainsList>
        </ChartCard>
      </ChartsSection>
    </AnalyticsContainer>
  );
};

export default UsageAnalytics;