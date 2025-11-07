import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiMenu, 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiHelpCircle,
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

// Modern Color Palette (same as others)
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

const NavbarContainer = styled.header`
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
  padding: 1rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${colors.shadow};
  backdrop-filter: blur(8px);
  
  @media (max-width: 1024px) {
    padding: 1rem 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${colors.backgroundTertiary};
    color: ${colors.textPrimary};
  }
  
  @media (max-width: 1024px) {
    display: block;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${colors.backgroundSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: ${colors.background};
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  color: ${colors.textMuted};
  font-size: 1rem;
  pointer-events: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 10px;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${colors.backgroundTertiary};
    color: ${colors.textPrimary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 8px;
  height: 8px;
  background: ${colors.error};
  border: 2px solid ${colors.background};
  border-radius: 50%;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: 1px solid ${colors.border};
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${colors.background};
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${colors.shadowMd};
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: ${colors.shadow};
`;

const UserInfo = styled.div`
  text-align: left;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  line-height: 1.2;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const ChevronIcon = styled(FiChevronDown)`
  color: ${colors.textMuted};
  font-size: 0.875rem;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${UserButton}:hover & {
    color: ${colors.primary};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${colors.background};
  border-radius: 12px;
  box-shadow: ${colors.shadowLg};
  border: 1px solid ${colors.border};
  min-width: 220px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-0.5rem'});
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 1rem 1rem 0.5rem;
  border-bottom: 1px solid ${colors.border};
  margin-bottom: 0.5rem;
  
  .name {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 0.25rem;
  }
  
  .email {
    font-size: 0.75rem;
    color: ${colors.textMuted};
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  
  &:hover {
    background-color: ${colors.backgroundTertiary};
    color: ${colors.textPrimary};
  }
  
  &.danger {
    color: ${colors.error};
    
    &:hover {
      background-color: rgba(239, 68, 68, 0.1);
      color: ${colors.error};
    }
  }
  
  svg {
    font-size: 1rem;
  }
`;

interface NavbarProps {
  user: any;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, toggleSidebar }) => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <FiMenu />
        </MenuButton>
        
        <Logo size={32} showText={true} />
      </LeftSection>
      
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search APIs, documentation, or analytics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <RightSection>
        <NotificationButton>
          <FiBell />
          <NotificationBadge />
        </NotificationButton>
        
        <UserMenu>
          <UserButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            <UserAvatar>
              {getInitials(user.email)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user.first_name} {user.last_name}</UserName>
              <UserRole>{user.subscription_tier} Plan</UserRole>
            </UserInfo>
            <ChevronIcon />
          </UserButton>
          
          <DropdownMenu isOpen={dropdownOpen}>
            <DropdownHeader>
              <div className="name">{user.first_name} {user.last_name}</div>
              <div className="email">{user.email}</div>
            </DropdownHeader>
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiUser />
              Profile Settings
            </DropdownItem>
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiSettings />
              Account Settings
            </DropdownItem>
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiHelpCircle />
              Help & Support
            </DropdownItem>
            <DropdownItem className="danger" onClick={handleLogout}>
              <FiLogOut />
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;