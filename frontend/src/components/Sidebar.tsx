import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiHome, 
  FiGlobe, 
  FiKey, 
  FiBarChart2, 
  FiSettings,
  FiUser,
  FiStar,
  FiActivity,
  FiShield,
  FiClock,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiZap
} from 'react-icons/fi';
import colors from '../theme/colors';

const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '80px'};
  background: ${colors.surface};
  border-right: 1px solid ${colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 2px;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-color: ${colors.border} transparent;
  
  @media (max-width: 1024px) {
    width: ${props => props.isOpen ? '280px' : '0'};
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    box-shadow: ${props => props.isOpen ? '4px 0 30px rgba(0, 0, 0, 0.15)' : 'none'};
  }
`;

const SidebarHeader = styled.div<{ isOpen: boolean }>`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  background: ${colors.surface};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const LogoContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideIn} 0.3s ease-out;
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: ${colors.shadowPrimary};
  flex-shrink: 0;
`;

const Logo = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  
  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0;
    line-height: 1.2;
    
    span {
      background: ${colors.gradientPrimary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .subtitle {
    font-size: 0.7rem;
    color: ${colors.textMuted};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ToggleButton = styled.button`
  background: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.primary}10;
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

const NavSection = styled.div`
  padding: 1rem 0;
`;

const NavSectionTitle = styled.div<{ isOpen: boolean }>`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 1.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled.div<{ active: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  margin: 0 0.75rem;
  padding: 0.75rem ${props => props.isOpen ? '1rem' : '1rem'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  background: ${props => props.active ? colors.primary : 'transparent'};
  color: ${props => props.active ? colors.textLight : colors.textSecondary};
  position: relative;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  
  &:hover {
    background: ${props => props.active ? colors.primaryDark : colors.backgroundSecondary};
    color: ${props => props.active ? colors.textLight : colors.primary};
  }
  
  ${props => props.active && `
    box-shadow: 0 4px 12px ${colors.primary}40;
  `}
  
  .icon {
    font-size: 1.125rem;
    margin-right: ${props => props.isOpen ? '0.75rem' : '0'};
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .label {
    font-weight: 500;
    font-size: 0.875rem;
    display: ${props => props.isOpen ? 'block' : 'none'};
    white-space: nowrap;
  }
  
  .badge {
    margin-left: auto;
    background: ${colors.accent};
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 0.75rem 1.5rem;
`;

const UserSection = styled.div<{ isOpen: boolean }>`
  padding: 1rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.backgroundSecondary};
  margin-top: auto;
`;

const UserInfo = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.isOpen ? '0.75rem' : '0.5rem'};
  border-radius: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${colors.shadowMd};
  }
  
  .avatar {
    width: ${props => props.isOpen ? '38px' : '32px'};
    height: ${props => props.isOpen ? '38px' : '32px'};
    border-radius: 10px;
    background: ${colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: ${props => props.isOpen ? '0.875rem' : '0.75rem'};
    color: white;
    margin-right: ${props => props.isOpen ? '0.75rem' : '0'};
    flex-shrink: 0;
  }
  
  .info {
    flex: 1;
    display: ${props => props.isOpen ? 'block' : 'none'};
    min-width: 0;
    
    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.textPrimary};
      margin-bottom: 0.125rem;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tier {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: ${colors.primary};
      
      .crown {
        font-size: 0.75rem;
        color: ${colors.accent};
      }
    }
  }
  
  .status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.success};
    display: ${props => props.isOpen ? 'block' : 'none'};
    margin-left: auto;
    box-shadow: 0 0 0 2px ${colors.successLight};
  }
`;

const UpgradeCard = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  background: ${colors.gradientHero};
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 1rem 0.75rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: ${colors.primary}20;
    border-radius: 50%;
  }
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 0.75rem;
  }
  
  .title {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${colors.textLight};
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.75rem;
    color: ${colors.textMuted};
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }
  
  .button {
    display: inline-block;
    background: ${colors.primary};
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &:hover {
      background: ${colors.primaryDark};
      transform: translateY(-1px);
    }
  }
`;

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user?: {
    first_name?: string;
    last_name?: string;
    subscription_tier?: string;
  } | null;
}

const mainNavItems = [
  { id: 'home', label: 'Dashboard', icon: FiHome },
  { id: 'scraper', label: 'Web Scraper', icon: FiGlobe },
  { id: 'history', label: 'History', icon: FiClock, badge: 'New' },
];

const analyticsNavItems = [
  { id: 'analytics', label: 'Usage Analytics', icon: FiBarChart2 },
  { id: 'network', label: 'Network Analysis', icon: FiActivity },
  { id: 'security', label: 'Security Reports', icon: FiShield },
];

const developerNavItems = [
  { id: 'api-keys', label: 'API Keys', icon: FiKey },
  { id: 'documentation', label: 'Documentation', icon: FiFileText },
];

const settingsNavItems = [
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen,
  user 
}) => {
  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User' : 'Guest';
  const subscriptionTier = user?.subscription_tier || 'Free';
  
  const renderNavItems = (items: typeof mainNavItems) => (
    <NavList>
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavItem
            key={item.id}
            active={currentPage === item.id}
            isOpen={isOpen}
            onClick={() => setCurrentPage(item.id)}
          >
            <IconComponent className="icon" />
            <span className="label">{item.label}</span>
            {'badge' in item && item.badge && (
              <span className="badge">{item.badge}</span>
            )}
          </NavItem>
        );
      })}
    </NavList>
  );
  
  return (
    <>
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader isOpen={isOpen}>
          <LogoContainer isOpen={isOpen}>
            <LogoIcon>
              <FiZap />
            </LogoIcon>
            <Logo isOpen={isOpen}>
              <div className="title">WebScraper<span>.live</span></div>
              <div className="subtitle">Professional</div>
            </Logo>
          </LogoContainer>
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </ToggleButton>
        </SidebarHeader>
        
        <NavSection>
          <NavSectionTitle isOpen={isOpen}>Main</NavSectionTitle>
          {renderNavItems(mainNavItems)}
        </NavSection>
        
        <NavSection>
          <NavSectionTitle isOpen={isOpen}>Analytics</NavSectionTitle>
          {renderNavItems(analyticsNavItems)}
        </NavSection>
        
        <NavSection>
          <NavSectionTitle isOpen={isOpen}>Developer</NavSectionTitle>
          {renderNavItems(developerNavItems)}
        </NavSection>
        
        <Divider />
        
        {renderNavItems(settingsNavItems)}
        
        <UpgradeCard isOpen={isOpen}>
          <div className="icon">
            <FiZap />
          </div>
          <div className="title">Upgrade to Pro</div>
          <div className="description">
            Get unlimited scraping, priority support, and advanced analytics.
          </div>
          <button className="button">Upgrade Now</button>
        </UpgradeCard>
        
        <UserSection isOpen={isOpen}>
          <UserInfo isOpen={isOpen}>
            <div className="avatar">
              <FiUser />
            </div>
            <div className="info">
              <div className="name">{displayName}</div>
              <div className="tier">
                <FiStar className="crown" />
                {subscriptionTier} Plan
              </div>
            </div>
            <div className="status"></div>
          </UserInfo>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
