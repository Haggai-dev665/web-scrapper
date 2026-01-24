import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBell, 
  FiCreditCard,
  FiSettings,
  FiSave,
  FiTrash2,
  FiAlertTriangle,
  FiShield,
  FiCheck,
  FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SettingsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PageDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

const SettingsNav = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${colors.surface};
  padding: 0.375rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid ${colors.border};
  overflow-x: auto;
`;

const NavTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: ${props => props.$active ? colors.primary : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.$active ? colors.textLight : colors.textSecondary};
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$active ? colors.primary : colors.backgroundSecondary};
    color: ${props => props.$active ? colors.textLight : colors.textPrimary};
  }
`;

const SettingsCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  box-shadow: ${colors.shadow};
  border: 1px solid ${colors.border};
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.backgroundSecondary};
`;

const CardTitle = styled.h3`
  margin: 0 0 0.375rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const CardDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  background: ${colors.surface};
  color: ${colors.textPrimary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}15;
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${colors.backgroundSecondary};
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid ${colors.border};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ToggleContent = styled.div``;

const ToggleLabel = styled.div`
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ToggleDescription = styled.div`
  font-size: 0.8rem;
  color: ${colors.textMuted};
`;

const Toggle = styled.label`
  position: relative;
  width: 48px;
  height: 26px;
  display: inline-block;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: ${colors.primary};
    }
    
    &:checked + span:before {
      transform: translateX(22px);
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: ${colors.border};
    transition: 0.3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.border};
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: ${props => props.$variant === 'secondary' ? `1px solid ${colors.border}` : 'none'};
  background: ${props => 
    props.$variant === 'secondary' ? colors.surface : 
    props.$variant === 'danger' ? colors.error : colors.primary
  };
  color: ${props => props.$variant === 'secondary' ? colors.textSecondary : colors.textLight};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => 
      props.$variant === 'secondary' ? colors.backgroundSecondary : 
      props.$variant === 'danger' ? colors.errorDark : colors.primaryDark
    };
    box-shadow: ${colors.shadowMd};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $current?: boolean; $featured?: boolean }>`
  border: 2px solid ${props => 
    props.$current ? colors.primary : 
    props.$featured ? colors.accent : colors.border
  };
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s ease;
  background: ${props => props.$featured ? `${colors.accent}05` : colors.surface};
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${colors.shadowMd};
  }
`;

const PlanBadge = styled.div<{ $type?: 'current' | 'popular' }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.$type === 'current' ? colors.primary : colors.accent};
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlanName = styled.h4`
  margin: 0.5rem 0 0.375rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 0.25rem;
  
  span {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${colors.textMuted};
  }
`;

const PlanDescription = styled.p`
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  margin-bottom: 1rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  
  svg {
    color: ${colors.success};
    flex-shrink: 0;
  }
`;

const PlanButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: ${props => props.$primary ? 'none' : `1px solid ${colors.border}`};
  background: ${props => props.$primary ? colors.primary : colors.surface};
  color: ${props => props.$primary ? colors.textLight : colors.textSecondary};
  
  &:hover {
    background: ${props => props.$primary ? colors.primaryDark : colors.backgroundSecondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DangerZone = styled.div`
  border: 1px solid ${colors.error}30;
  border-radius: 12px;
  padding: 1.5rem;
  background: ${colors.error}05;
`;

const DangerTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${colors.error};
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DangerDescription = styled.p`
  margin: 0 0 1.25rem 0;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    securityNotifications: true,
    marketingEmails: false,
    weeklyReport: true,
  });

  const handleSave = async () => {
    try {
      console.log('Saving settings:', formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      logout();
    }
  };

  const renderProfileTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormGrid>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Enter first name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Enter last name"
              />
            </FormGroup>
          </FormGrid>
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
            />
          </FormGroup>
          <ButtonGroup>
            <Button $variant="secondary">Cancel</Button>
            <Button onClick={handleSave}>
              <FiSave size={16} />
              Save Changes
            </Button>
          </ButtonGroup>
        </CardContent>
      </SettingsCard>
    </>
  );

  const renderSecurityTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Use a strong password with at least 12 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              placeholder="••••••••••••"
            />
          </FormGroup>
          <FormGrid>
            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                placeholder="••••••••••••"
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••••••"
              />
            </FormGroup>
          </FormGrid>
          <ButtonGroup>
            <Button $variant="secondary">Cancel</Button>
            <Button onClick={handleSave}>
              <FiShield size={16} />
              Update Password
            </Button>
          </ButtonGroup>
        </CardContent>
      </SettingsCard>
    </>
  );

  const renderNotificationsTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how and when you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup>
            <ToggleContent>
              <ToggleLabel>Email Notifications</ToggleLabel>
              <ToggleDescription>Receive updates about your scraping activity</ToggleDescription>
            </ToggleContent>
            <Toggle>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
              />
              <span></span>
            </Toggle>
          </ToggleGroup>
          <ToggleGroup>
            <ToggleContent>
              <ToggleLabel>Security Alerts</ToggleLabel>
              <ToggleDescription>Get notified about security-related events</ToggleDescription>
            </ToggleContent>
            <Toggle>
              <input
                type="checkbox"
                checked={formData.securityNotifications}
                onChange={(e) => setFormData({...formData, securityNotifications: e.target.checked})}
              />
              <span></span>
            </Toggle>
          </ToggleGroup>
          <ToggleGroup>
            <ToggleContent>
              <ToggleLabel>Weekly Report</ToggleLabel>
              <ToggleDescription>Receive a weekly summary of your API usage</ToggleDescription>
            </ToggleContent>
            <Toggle>
              <input
                type="checkbox"
                checked={formData.weeklyReport}
                onChange={(e) => setFormData({...formData, weeklyReport: e.target.checked})}
              />
              <span></span>
            </Toggle>
          </ToggleGroup>
          <ToggleGroup>
            <ToggleContent>
              <ToggleLabel>Marketing Emails</ToggleLabel>
              <ToggleDescription>Receive news and promotional offers</ToggleDescription>
            </ToggleContent>
            <Toggle>
              <input
                type="checkbox"
                checked={formData.marketingEmails}
                onChange={(e) => setFormData({...formData, marketingEmails: e.target.checked})}
              />
              <span></span>
            </Toggle>
          </ToggleGroup>
          <ButtonGroup>
            <Button onClick={handleSave}>
              <FiSave size={16} />
              Save Preferences
            </Button>
          </ButtonGroup>
        </CardContent>
      </SettingsCard>
    </>
  );

  const renderBillingTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <PlansGrid>
            <PlanCard>
              <PlanName>Starter</PlanName>
              <PlanPrice>$0<span>/month</span></PlanPrice>
              <PlanDescription>Perfect for trying out the API</PlanDescription>
              <PlanFeatures>
                <PlanFeature><FiCheck size={14} /> 100 requests/month</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Basic analytics</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Community support</PlanFeature>
              </PlanFeatures>
              <PlanButton disabled>Current Plan</PlanButton>
            </PlanCard>
            
            <PlanCard $featured>
              <PlanBadge $type="popular">Most Popular</PlanBadge>
              <PlanName>Pro</PlanName>
              <PlanPrice>$29<span>/month</span></PlanPrice>
              <PlanDescription>Best for growing businesses</PlanDescription>
              <PlanFeatures>
                <PlanFeature><FiCheck size={14} /> 10,000 requests/month</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Advanced analytics</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Priority support</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Custom integrations</PlanFeature>
              </PlanFeatures>
              <PlanButton $primary>Upgrade Now</PlanButton>
            </PlanCard>
            
            <PlanCard>
              <PlanName>Enterprise</PlanName>
              <PlanPrice>$99<span>/month</span></PlanPrice>
              <PlanDescription>For large-scale operations</PlanDescription>
              <PlanFeatures>
                <PlanFeature><FiCheck size={14} /> Unlimited requests</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Real-time analytics</PlanFeature>
                <PlanFeature><FiCheck size={14} /> Dedicated support</PlanFeature>
                <PlanFeature><FiCheck size={14} /> SLA guarantee</PlanFeature>
              </PlanFeatures>
              <PlanButton>Contact Sales</PlanButton>
            </PlanCard>
          </PlansGrid>
        </CardContent>
      </SettingsCard>
      
      <SettingsCard>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your billing information securely.</CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonGroup style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
            <Button $variant="secondary">
              <FiCreditCard size={16} />
              Add Payment Method
            </Button>
            <Button $variant="secondary">
              <FiExternalLink size={16} />
              View Billing History
            </Button>
          </ButtonGroup>
        </CardContent>
      </SettingsCard>
    </>
  );

  const renderDangerTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions. Proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
          <DangerZone>
            <DangerTitle>
              <FiAlertTriangle />
              Delete Account Permanently
            </DangerTitle>
            <DangerDescription>
              Once you delete your account, there is no going back. All your data, 
              API keys, analytics history, and settings will be permanently removed. 
              This action cannot be undone.
            </DangerDescription>
            <Button $variant="danger" onClick={handleDeleteAccount}>
              <FiTrash2 size={16} />
              Delete My Account
            </Button>
          </DangerZone>
        </CardContent>
      </SettingsCard>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'billing':
        return renderBillingTab();
      case 'danger':
        return renderDangerTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>
          <FiSettings />
          Account Settings
        </PageTitle>
        <PageDescription>
          Manage your profile, security, and subscription preferences.
        </PageDescription>
      </PageHeader>

      <SettingsNav>
        <NavTab $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          <FiUser size={16} />
          Profile
        </NavTab>
        <NavTab $active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
          <FiLock size={16} />
          Security
        </NavTab>
        <NavTab $active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
          <FiBell size={16} />
          Notifications
        </NavTab>
        <NavTab $active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>
          <FiCreditCard size={16} />
          Billing
        </NavTab>
        <NavTab $active={activeTab === 'danger'} onClick={() => setActiveTab('danger')}>
          <FiAlertTriangle size={16} />
          Danger
        </NavTab>
      </SettingsNav>

      {renderContent()}
    </SettingsContainer>
  );
};

export default SettingsPage;
