import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBell, 
  FiCreditCard,
  FiSettings,
  FiSave,
  FiTrash2,
  FiAlertTriangle
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
`;

const PageDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 1.1rem;
`;

const SettingsNav = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const NavTab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: #3b82f6;
  }
`;

const SettingsCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const CardDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

const Button = styled.button<{ variant?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${props => props.variant === 'outline' ? '1px solid #d1d5db' : 'none'};
  background: ${props => 
    props.variant === 'outline' ? 'white' : 
    props.variant === 'danger' ? '#ef4444' : '#3b82f6'
  };
  color: ${props => props.variant === 'outline' ? '#374151' : 'white'};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PlanCard = styled.div<{ current?: boolean }>`
  border: 2px solid ${props => props.current ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
  }
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 1rem;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PlanName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlanFeature = styled.li`
  padding: 0.25rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  
  &::before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const DangerZone = styled.div`
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fef2f2;
`;

const DangerTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DangerDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #7f1d1d;
  font-size: 0.9rem;
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
  });

  const handleSave = async () => {
    try {
      // Simulate API call to save settings
      console.log('Saving settings:', formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      // Handle account deletion
      logout();
    }
  };

  const renderProfileTab = () => (
    <>
      <SettingsCard>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile information and email preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </FormGroup>
          </div>
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={handleSave}>
              <FiSave />
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
          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label>New Password</Label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={handleSave}>
              <FiSave />
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
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which notifications you'd like to receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckboxGroup>
            <Checkbox
              id="emailNotifications"
              checked={formData.emailNotifications}
              onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})}
            />
            <CheckboxLabel htmlFor="emailNotifications">
              Email notifications for scraping activities
            </CheckboxLabel>
          </CheckboxGroup>
          <CheckboxGroup>
            <Checkbox
              id="securityNotifications"
              checked={formData.securityNotifications}
              onChange={(e) => setFormData({...formData, securityNotifications: e.target.checked})}
            />
            <CheckboxLabel htmlFor="securityNotifications">
              Security and account notifications
            </CheckboxLabel>
          </CheckboxGroup>
          <CheckboxGroup>
            <Checkbox
              id="marketingEmails"
              checked={formData.marketingEmails}
              onChange={(e) => setFormData({...formData, marketingEmails: e.target.checked})}
            />
            <CheckboxLabel htmlFor="marketingEmails">
              Marketing and promotional emails
            </CheckboxLabel>
          </CheckboxGroup>
          <ButtonGroup>
            <Button onClick={handleSave}>
              <FiSave />
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
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing information.</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanCard current>
            <PlanBadge>Current Plan</PlanBadge>
            <PlanName>Pro Plan</PlanName>
            <PlanPrice>$29/month</PlanPrice>
            <PlanFeatures>
              <PlanFeature>100,000 requests/month</PlanFeature>
              <PlanFeature>Advanced analytics</PlanFeature>
              <PlanFeature>Priority support</PlanFeature>
              <PlanFeature>Custom integrations</PlanFeature>
            </PlanFeatures>
          </PlanCard>
          <ButtonGroup>
            <Button variant="outline">
              <FiCreditCard />
              Update Payment Method
            </Button>
            <Button variant="outline">
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
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <DangerZone>
            <DangerTitle>
              <FiAlertTriangle />
              Delete Account
            </DangerTitle>
            <DangerDescription>
              Once you delete your account, there is no going back. All your data, API keys, and settings will be permanently removed.
            </DangerDescription>
            <Button variant="danger" onClick={handleDeleteAccount}>
              <FiTrash2 />
              Delete Account
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
        <PageTitle>Account Settings</PageTitle>
        <PageDescription>
          Manage your account preferences, security settings, and subscription.
        </PageDescription>
      </PageHeader>

      <SettingsNav>
        <NavTab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          Profile
        </NavTab>
        <NavTab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
          Security
        </NavTab>
        <NavTab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
          Notifications
        </NavTab>
        <NavTab active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>
          Billing
        </NavTab>
        <NavTab active={activeTab === 'danger'} onClick={() => setActiveTab('danger')}>
          Danger Zone
        </NavTab>
      </SettingsNav>

      {renderContent()}
    </SettingsContainer>
  );
};

export default SettingsPage;