import React from 'react';
import styled from 'styled-components';
import logoImage from '../assets/logo.png';

const LogoContainer = styled.div<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  height: ${props => props.size || 40}px;
`;

const LogoImage = styled.img<{ size?: number }>`
  height: ${props => props.size || 40}px;
  width: auto;
  object-fit: contain;
`;

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 40
}) => {
  return (
    <LogoContainer size={size}>
      <LogoImage src={logoImage} alt="Web Scrapper" size={size} />
    </LogoContainer>
  );
};

export default Logo;
