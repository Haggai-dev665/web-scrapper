import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoSvg = styled.svg<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
`;

const LogoText = styled.span<{ size?: number; color?: string }>`
  font-size: ${props => (props.size || 40) * 0.6}px;
  font-weight: 700;
  color: ${props => props.color || '#6366F1'};
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const LogoHighlight = styled.span`
  color: #10B981;
`;

interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  iconColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  showText = true, 
  textColor = '#6366F1',
  iconColor = '#6366F1'
}) => {
  return (
    <LogoContainer size={size}>
      <LogoIcon size={size}>
        <LogoSvg size={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Spider web background */}
          <circle cx="50" cy="50" r="45" stroke={iconColor} strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx="50" cy="50" r="35" stroke={iconColor} strokeWidth="2" fill="none" opacity="0.3" />
          <circle cx="50" cy="50" r="25" stroke={iconColor} strokeWidth="2" fill="none" opacity="0.4" />
          
          {/* Web lines */}
          <line x1="50" y1="5" x2="50" y2="95" stroke={iconColor} strokeWidth="2" opacity="0.3" />
          <line x1="5" y1="50" x2="95" y2="50" stroke={iconColor} strokeWidth="2" opacity="0.3" />
          <line x1="15" y1="15" x2="85" y2="85" stroke={iconColor} strokeWidth="2" opacity="0.3" />
          <line x1="85" y1="15" x2="15" y2="85" stroke={iconColor} strokeWidth="2" opacity="0.3" />
          
          {/* Center spider/scraper icon */}
          <circle cx="50" cy="50" r="12" fill={iconColor} />
          <circle cx="50" cy="50" r="8" fill="white" />
          
          {/* Spider legs - 8 legs */}
          <path d="M 50 38 L 50 28 L 45 23" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 50 38 L 50 28 L 55 23" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 38 50 L 28 50 L 23 45" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 38 50 L 28 50 L 23 55" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 62 50 L 72 50 L 77 45" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 62 50 L 72 50 L 77 55" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 50 62 L 50 72 L 45 77" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 50 62 L 50 72 L 55 77" stroke={iconColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Data extraction visual effect - small dots */}
          <circle cx="35" cy="35" r="2" fill="#10B981" opacity="0.8" />
          <circle cx="65" cy="35" r="2" fill="#10B981" opacity="0.8" />
          <circle cx="35" cy="65" r="2" fill="#10B981" opacity="0.8" />
          <circle cx="65" cy="65" r="2" fill="#10B981" opacity="0.8" />
        </LogoSvg>
      </LogoIcon>
      {showText && (
        <LogoText size={size} color={textColor}>
          Web<LogoHighlight>Scrapper</LogoHighlight>
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;
