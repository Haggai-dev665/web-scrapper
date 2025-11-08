import React from 'react';
import styled from 'styled-components';
import { 
  FiHome, 
  FiGlobe, 
  FiKey, 
  FiBarChart2, 
  FiSettings,
  FiMenu,
  FiX,
  FiUser,
  FiStar,
  FiActivity,
  FiShield,
  FiClock,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import colors from '../theme/colors';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  background: ${colors.white};
  border-right: 2px solid ${colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 0 4px 15px ${colors.shadow};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
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
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-color: ${colors.border} transparent;
  
  @media (max-width: 1024px) {
    width: ${props => props.isOpen ? '280px' : '0'};
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    box-shadow: ${props => props.isOpen ? '4px 0 15px rgba(0, 0, 0, 0.1)' : 'none'};
  }
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '280px' : '0'};
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    box-shadow: ${props => props.isOpen ? '4px 0 15px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const SidebarHeader = styled.div<{ isOpen: boolean }>`
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  background: ${colors.background};
`;

const LogoContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${colors.turquoise} 0%, ${colors.darkTurquoise} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  box-shadow: 0 4px 12px ${colors.shadow};
`;

const Logo = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  
  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${colors.brown};
    margin: 0;
    line-height: 1.2;
  }
  
  .subtitle {
    font-size: 0.75rem;
    color: ${colors.textMuted};
    font-weight: 500;
    margin: 0;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.textSecondary};
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${colors.backgroundTertiary};
    color: ${colors.textPrimary};
  }
`;

const NavList = styled.nav`
  padding: 1.5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled.div<{ active: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  padding: 0.875rem ${props => props.isOpen ? '1rem' : '1.25rem'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  background-color: ${props => props.active ? colors.turquoise : 'transparent'};
  color: ${props => props.active ? 'white' : colors.textSecondary};
  position: relative;
  
  &:hover {
    background-color: ${props => props.active ? colors.darkTurquoise : colors.backgroundTertiary};
    color: ${props => props.active ? 'white' : colors.brown};
    transform: translateY(-1px);
    box-shadow: ${props => props.active ? `0 4px 12px ${colors.turquoise}40` : colors.shadow};
  }
  
  .icon {
    font-size: 1.125rem;
    margin-right: ${props => props.isOpen ? '0.875rem' : '0'};
    min-width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .label {
    font-weight: 600;
    font-size: 0.875rem;
    display: ${props => props.isOpen ? 'block' : 'none'};
    white-space: nowrap;
  }
  
  .badge {
    margin-left: auto;
    background: ${colors.warning};
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const UserSection = styled.div<{ isOpen: boolean }>`
  padding: 1.5rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.backgroundSecondary};
  margin-top: auto;
`;

const UserInfo = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.isOpen ? '0.75rem' : '0.5rem'};
  border-radius: 12px;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${colors.shadowMd};
  }
  
  .avatar {
    width: ${props => props.isOpen ? '40px' : '32px'};
    height: ${props => props.isOpen ? '40px' : '32px'};
    border-radius: 10px;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: ${props => props.isOpen ? '1rem' : '0.875rem'};
    color: white;
    margin-right: ${props => props.isOpen ? '0.875rem' : '0'};
    box-shadow: ${colors.shadow};
  }
  
  .info {
    flex: 1;
    display: ${props => props.isOpen ? 'block' : 'none'};
    
    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.textPrimary};
      margin-bottom: 0.125rem;
      line-height: 1.2;
    }
    
    .tier {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: ${colors.warning};
      
      .crown {
        font-size: 0.875rem;
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

const navItems = [
  { id: 'home', label: 'Dashboard', icon: FiHome },
  { id: 'scraper', label: 'Web Scraper', icon: FiGlobe },
  { id: 'history', label: 'History', icon: FiClock },
  { id: 'api-keys', label: 'API Keys', icon: FiKey },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'network', label: 'Network Analysis', icon: FiActivity },
  { id: 'security', label: 'Security Reports', icon: FiShield },
  { id: 'documentation', label: 'Docs', icon: FiFileText },
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
  
  return (
    <>
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader isOpen={isOpen}>
          <LogoContainer isOpen={isOpen}>
            <LogoIcon>
              <FiGlobe />
            </LogoIcon>
            <Logo isOpen={isOpen}>
              <div className="title">WebScraper</div>
              <div className="subtitle">Professional</div>
            </Logo>
          </LogoContainer>
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </ToggleButton>
        </SidebarHeader>
        
        <NavList>
          {navItems.map((item) => {
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
              </NavItem>
            );
          })}
        </NavList>
        
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