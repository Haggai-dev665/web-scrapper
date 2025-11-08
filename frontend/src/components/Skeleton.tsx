import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1em'};
  margin: 0.25em 0;
`;

export const SkeletonCircle = styled(SkeletonBase)<{ size?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`;

export const SkeletonRectangle = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100px'};
`;

const CardContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SkeletonCard: React.FC = () => {
  return (
    <CardContainer>
      <CardHeader>
        <SkeletonCircle size="48px" />
        <div style={{ flex: 1 }}>
          <SkeletonText width="60%" height="1.2em" />
          <SkeletonText width="40%" height="0.9em" />
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonText width="100%" />
        <SkeletonText width="90%" />
        <SkeletonText width="85%" />
      </CardContent>
    </CardContainer>
  );
};

const TableContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <TableContainer>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <SkeletonCircle size="32px" />
          <div style={{ flex: 1 }}>
            <SkeletonText width="70%" height="1em" />
            <SkeletonText width="50%" height="0.8em" />
          </div>
          <SkeletonText width="100px" height="1em" />
        </TableRow>
      ))}
    </TableContainer>
  );
};

const GridContainer = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCardSkeleton = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const SkeletonStatsGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <GridContainer columns={count}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <SkeletonText width="60%" height="0.8em" />
            <SkeletonCircle size="40px" />
          </div>
          <SkeletonText width="50%" height="2em" />
          <SkeletonText width="70%" height="0.8em" />
        </StatCardSkeleton>
      ))}
    </GridContainer>
  );
};

export default {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Rectangle: SkeletonRectangle,
  Card: SkeletonCard,
  Table: SkeletonTable,
  StatsGrid: SkeletonStatsGrid,
};
