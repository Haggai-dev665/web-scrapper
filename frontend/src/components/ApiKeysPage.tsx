import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiKey, 
  FiPlus, 
  FiCopy, 
  FiTrash2, 
  FiEye, 
  FiEyeOff,
  FiCalendar,
  FiActivity,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from './Toast';

// Color Palette matching landing page
const colors = {
  raisinBlack: '#1A1423',
  charcoal: '#36454F',
  mutedBlue: '#5A6C7D',
  accent: '#7B68EE',
  lightBlue: '#87CEEB',
  white: '#FFFFFF',
  gray: '#B8B8B8',
  darkGray: '#2A2A2A'
};

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.lightBlue} 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px ${colors.accent}40;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px ${colors.accent}50;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(123, 104, 238, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(123, 104, 238, 0.2);
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
`;

const KeysGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const KeyCard = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

const KeyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const KeyInfo = styled.div`
  flex: 1;
`;

const KeyName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
`;

const KeyDescription = styled.p`
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.9rem;
`;

const KeyValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
`;

const KeyText = styled.code<{ hidden: boolean }>`
  flex: 1;
  color: #374151;
  user-select: ${props => props.hidden ? 'none' : 'all'};
`;

const KeyActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: string }>`
  background: ${props => 
    props.variant === 'danger' ? '#ef4444' :
    props.variant === 'secondary' ? '#6b7280' : '#3b82f6'
  };
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const KeyMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.85rem;
  color: #6b7280;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const UsageBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const UsageProgress = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  transition: width 0.3s ease;
`;

const UsageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UsageItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  
  &:hover {
    color: #374151;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: string }>`
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
`;

interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  created_at: string;
  last_used: string;
  requests_count: number;
  rate_limit?: number;
  status: 'active' | 'inactive';
}

const ApiKeysPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      
      // Fetch real API keys from backend
      const keysData = await apiService.getApiKeys();
      
      // Transform backend data to match our interface
      const transformedKeys: ApiKey[] = keysData.map((key: any) => ({
        id: key.id || key._id,
        name: key.name,
        description: key.description || '',
        key: key.api_key || key.key,
        created_at: key.created_at ? new Date(key.created_at).toLocaleDateString() : 'Unknown',
        last_used: key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never',
        requests_count: key.usage_count || key.requests_count || key.requestsCount || 0,
        rate_limit: key.rate_limit_per_hour || key.rateLimitPerHour || 1000,
        status: key.active || key.is_active || key.isActive ? 'active' : 'inactive'
      }));
      
      setApiKeys(transformedKeys);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      // Show empty state rather than mock data on error
      setApiKeys([]);
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      if (!formData.name.trim()) {
        showToast({
          type: 'warning',
          title: 'Name Required',
          message: 'Please provide a name for the API key'
        });
        return;
      }
      
      // Create API key via backend
      const response = await apiService.createApiKey({
        name: formData.name,
        description: formData.description
      });
      
      // Refresh the API keys list to get the latest data
      await fetchApiKeys();
      
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      
      showToast({
        type: 'success',
        title: 'API Key Created',
        message: `Successfully created "${formData.name}"`
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create API key. Please try again.'
      });
    }
  };

  const handleDeleteKey = async (keyId: string, keyName: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await apiService.deleteApiKey(keyId);
        // Refresh the API keys list
        await fetchApiKeys();
        showToast({
          type: 'success',
          title: 'API Key Deleted',
          message: `Successfully deleted "${keyName}"`
        });
      } catch (error) {
        console.error('Error deleting API key:', error);
        showToast({
          type: 'error',
          title: 'Deletion Failed',
          message: 'Failed to delete API key. Please try again.'
        });
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: 'success',
      title: 'Copied!',
      message: 'API key copied to clipboard'
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  if (loading) {
    return <div>Loading API keys...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>API Key Management</PageTitle>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <FiPlus />
          Create New Key
        </CreateButton>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <StatValue>{apiKeys.length}</StatValue>
          <StatLabel>Total API Keys</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{apiKeys.filter(k => k.status === 'active').length}</StatValue>
          <StatLabel>Active Keys</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{apiKeys.reduce((sum, k) => sum + k.requests_count, 0).toLocaleString()}</StatValue>
          <StatLabel>Total Requests</StatLabel>
        </StatCard>
      </StatsRow>

      <KeysGrid>
        {apiKeys.map((apiKey) => (
          <KeyCard key={apiKey.id}>
            <KeyHeader>
              <KeyInfo>
                <KeyName>{apiKey.name}</KeyName>
                <KeyDescription>{apiKey.description}</KeyDescription>
              </KeyInfo>
            </KeyHeader>

            <KeyValue>
              <KeyText hidden={!visibleKeys.has(apiKey.id)}>
                {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
              </KeyText>
              <KeyActions>
                <ActionButton 
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                >
                  {visibleKeys.has(apiKey.id) ? <FiEyeOff /> : <FiEye />}
                </ActionButton>
                <ActionButton 
                  onClick={() => copyToClipboard(apiKey.key)}
                  title="Copy to clipboard"
                >
                  <FiCopy />
                </ActionButton>
                <ActionButton 
                  variant="danger"
                  onClick={() => handleDeleteKey(apiKey.id, apiKey.name)}
                  title="Delete key"
                >
                  <FiTrash2 />
                </ActionButton>
              </KeyActions>
            </KeyValue>

            <KeyMeta>
              <UsageInfo>
                <UsageItem>
                  <FiActivity />
                  {apiKey.requests_count.toLocaleString()} requests
                </UsageItem>
                <UsageItem>
                  <FiCalendar />
                  Created {apiKey.created_at}
                </UsageItem>
              </UsageInfo>
              <div>Last used: {apiKey.last_used}</div>
            </KeyMeta>
            
            {apiKey.requests_count > 0 && (
              <>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  Usage: {apiKey.requests_count} / {apiKey.rate_limit || 1000} per hour
                </div>
                <UsageBar>
                  <UsageProgress 
                    percentage={Math.min((apiKey.requests_count / (apiKey.rate_limit || 1000)) * 100, 100)} 
                  />
                </UsageBar>
              </>
            )}
          </KeyCard>
        ))}
      </KeysGrid>

      <Modal isOpen={showCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New API Key</ModalTitle>
            <CloseButton onClick={() => setShowCreateModal(false)}>
              ×
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Key Name</Label>
            <Input
              type="text"
              placeholder="e.g., Production API"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              placeholder="Describe what this API key will be used for..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </FormGroup>

          <ModalActions>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!formData.name}>
              Create Key
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default ApiKeysPage;