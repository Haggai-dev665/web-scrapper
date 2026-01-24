import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiClock, FiCheck, FiX, FiExternalLink, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { apiService } from '../services/api';
import colors from '../theme/colors';
import Loader from './Loader';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HistoryContainer = styled.div`
  animation: ${fadeInUp} 0.5s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${colors.textSecondary};
  margin: 0;
  font-size: 1rem;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HistoryTable = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 120px;
  padding: 1rem 1.5rem;
  background: ${colors.backgroundSecondary};
  border-bottom: 1px solid ${colors.border};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 1024px) {
    grid-template-columns: 40px 1fr 1fr 120px;
  }
`;

const TableRow = styled.div<{ $success?: boolean }>`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 120px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  transition: all 0.2s ease;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${colors.backgroundSecondary};
  }

  @media (max-width: 1024px) {
    grid-template-columns: 40px 1fr 1fr 120px;
  }
`;

const StatusIcon = styled.div<{ $success?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$success ? colors.success : colors.error}15;
  color: ${props => props.$success ? colors.success : colors.error};
  font-size: 1rem;
`;

const URLCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const URLText = styled.a`
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const URLHost = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
`;

const Cell = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    &.hide-mobile {
      display: none;
    }
  }
`;

const TimeCell = styled(Cell)`
  color: ${colors.textMuted};
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: ${colors.textMuted};
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: ${colors.textSecondary};
  }
  
  p {
    font-size: 0.95rem;
  }
`;

const ScrapingHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiService.getScrapingHistory(50, 0);
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return <Loader text="Loading history..." />;
  }

  return (
    <HistoryContainer>
      <PageHeader>
        <PageTitle>
          <FiClock />
          Scraping History
        </PageTitle>
        <PageDescription>
          View your complete scraping history with detailed results and analytics
        </PageDescription>
      </PageHeader>

      <ControlsBar>
        <div></div>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
          <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </RefreshButton>
      </ControlsBar>

      <HistoryTable>
        <TableHeader>
          <div></div>
          <div>URL</div>
          <div className="hide-mobile">Response Time</div>
          <div className="hide-mobile">Status</div>
          <div className="hide-mobile">Data Size</div>
          <div>Time</div>
        </TableHeader>

        {history.length === 0 ? (
          <EmptyState>
            <h3>No scraping history yet</h3>
            <p>Start scraping websites to see your history here</p>
          </EmptyState>
        ) : (
          history.map((item, index) => {
            const hostname = item.urlScraped ? new URL(item.urlScraped).hostname : '';
            return (
              <TableRow key={index} $success={item.success}>
                <StatusIcon $success={item.success}>
                  {item.success ? <FiCheck /> : <FiX />}
                </StatusIcon>
                <URLCell>
                  <URLText href={item.urlScraped} target="_blank" rel="noopener noreferrer">
                    {hostname}
                    <FiExternalLink size={12} />
                  </URLText>
                  <URLHost>{item.urlScraped}</URLHost>
                </URLCell>
                <Cell className="hide-mobile">{item.responseTimeMs}ms</Cell>
                <Cell className="hide-mobile">{item.success ? 'Success' : 'Failed'}</Cell>
                <Cell className="hide-mobile">-</Cell>
                <TimeCell>{formatTimeAgo(item.timestamp)}</TimeCell>
              </TableRow>
            );
          })
        )}
      </HistoryTable>
    </HistoryContainer>
  );
};

export default ScrapingHistory;
