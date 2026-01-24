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
  FiChevronDown,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import colors from '../theme/colors';

const NavbarContainer = styled.header`
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  
  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
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
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: 10px;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${colors.backgroundSecondary};
    color: ${colors.primary};
  }
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LogoMobile = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 1024px) {
    display: flex;
  }
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }
  
  .text {
    font-weight: 700;
    font-size: 1rem;
    color: ${colors.textPrimary};
    
    span {
      background: ${colors.gradientPrimary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 480px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${colors.backgroundSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${colors.textPrimary};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}15;
    background: ${colors.surface};
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

const SearchShortcut = styled.div`
  position: absolute;
  right: 0.75rem;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: 10px;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.backgroundSecondary};
    color: ${colors.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  width: 8px;
  height: 8px;
  background: ${colors.error};
  border: 2px solid ${colors.surface};
  border-radius: 50%;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  padding: 0.375rem 0.75rem 0.375rem 0.375rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${colors.shadowMd};
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
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
  font-size: 0.7rem;
  color: ${colors.primary};
  font-weight: 500;
`;

const ChevronIcon = styled(FiChevronDown)<{ $isOpen: boolean }>`
  color: ${colors.textMuted};
  font-size: 0.875rem;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${colors.surface};
  border-radius: 12px;
  box-shadow: ${colors.shadowXl};
  border: 1px solid ${colors.border};
  min-width: 240px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-0.5rem'});
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.backgroundSecondary};
  
  .name {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 0.25rem;
  }
  
  .email {
    font-size: 0.8rem;
    color: ${colors.textMuted};
  }
  
  .tier {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.5rem;
    background: ${colors.primary}15;
    color: ${colors.primary};
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.textSecondary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-family: inherit;
  
  &:hover {
    background: ${colors.backgroundSecondary};
    color: ${colors.textPrimary};
  }
  
  &.danger {
    color: ${colors.error};
    
    &:hover {
      background: ${colors.errorLight};
      color: ${colors.errorDark};
    }
  }
  
  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 0.5rem 0;
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

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FiMenu />
        </MenuButton>
        
        <LogoMobile>
          <div className="icon">
            <FiZap />
          </div>
          <div className="text">WebScraper<span>.live</span></div>
        </LogoMobile>
      </LeftSection>
      
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search documentation, APIs, or analytics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchShortcut>⌘K</SearchShortcut>
      </SearchContainer>
      
      <RightSection>
        <IconButton aria-label="Notifications">
          <FiBell />
          <NotificationBadge />
        </IconButton>
        
        <IconButton aria-label="Help">
          <FiHelpCircle />
        </IconButton>
        
        <UserMenu>
          <UserButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            <UserAvatar>
              {getInitials(user?.first_name, user?.last_name, user?.email)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.first_name} {user?.last_name}</UserName>
              <UserRole>{user?.subscription_tier || 'Free'} Plan</UserRole>
            </UserInfo>
            <ChevronIcon $isOpen={dropdownOpen} />
          </UserButton>
          
          <DropdownMenu $isOpen={dropdownOpen}>
            <DropdownHeader>
              <div className="name">{user?.first_name} {user?.last_name}</div>
              <div className="email">{user?.email}</div>
              <div className="tier">
                <FiZap size={10} />
                {user?.subscription_tier || 'Free'} Plan
              </div>
            </DropdownHeader>
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiUser />
              Profile Settings
            </DropdownItem>
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiSettings />
              Account Settings
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={() => setDropdownOpen(false)}>
              <FiHelpCircle />
              Help & Support
            </DropdownItem>
            <DropdownDivider />
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
