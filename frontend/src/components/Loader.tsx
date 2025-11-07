import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #E2E8F0;
  border-top: 4px solid #6366F1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const InnerSpinner = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border: 3px solid #E2E8F0;
  border-bottom: 3px solid #A5B4FC;
  border-radius: 50%;
  animation: ${spin} 1.5s linear infinite reverse;
`;

const LoadingText = styled.p`
  color: #475569;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSubtext = styled.p`
  color: #94A3B8;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
`;

interface LoaderProps {
  text?: string;
  subtext?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ 
  text = 'Loading...', 
  subtext,
  size = 'medium'
}) => {
  const sizeMap = {
    small: { width: 40, height: 40, border: 3 },
    medium: { width: 60, height: 60, border: 4 },
    large: { width: 80, height: 80, border: 5 }
  };

  const dimensions = sizeMap[size];

  return (
    <LoaderContainer>
      <SpinnerContainer style={{ width: dimensions.width, height: dimensions.height }}>
        <Spinner style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          borderWidth: dimensions.border 
        }} />
        <InnerSpinner style={{ 
          top: dimensions.width * 0.167,
          left: dimensions.width * 0.167,
          width: dimensions.width * 0.667,
          height: dimensions.width * 0.667,
          borderWidth: dimensions.border - 1
        }} />
      </SpinnerContainer>
      <LoadingText>{text}</LoadingText>
      {subtext && <LoadingSubtext>{subtext}</LoadingSubtext>}
    </LoaderContainer>
  );
};

export default Loader;
