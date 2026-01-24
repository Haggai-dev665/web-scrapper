import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiKey, 
  FiPlus, 
  FiCopy, 
  FiTrash2, 
  FiEye, 
  FiEyeOff,
  FiCalendar,
  FiActivity,
  FiCheck,
  FiX,
  FiCode,
  FiTerminal,
  FiShield,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import colors from '../theme/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div``;

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

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.gradientPrimary};
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 15px ${colors.primary}30;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${colors.primary}40;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${colors.surface};
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color || colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  font-family: 'JetBrains Mono', monospace;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const KeysSection = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 1rem 0;
`;

const KeysList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const KeyCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary}30;
    box-shadow: ${colors.shadowMd};
  }
`;

const KeyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const KeyInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const KeyName = styled.h3`
  margin: 0 0 0.375rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const KeyDescription = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  line-height: 1.4;
`;

const KeyStatus = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$active ? colors.success : colors.error}15;
  color: ${props => props.$active ? colors.success : colors.error};
`;

const KeyValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.backgroundSecondary};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid ${colors.border};
`;

const KeyText = styled.code<{ $hidden?: boolean }>`
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: ${colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: ${props => props.$hidden ? 'none' : 'all'};
`;

const KeyActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'default' | 'danger' }>`
  background: ${props => props.$variant === 'danger' ? colors.error : colors.backgroundSecondary};
  color: ${props => props.$variant === 'danger' ? colors.textLight : colors.textSecondary};
  border: 1px solid ${props => props.$variant === 'danger' ? colors.error : colors.border};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.$variant === 'danger' ? colors.errorDark : colors.primary};
    color: ${colors.textLight};
    border-color: ${props => props.$variant === 'danger' ? colors.errorDark : colors.primary};
  }
`;

const KeyMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: ${colors.textMuted};
  
  svg {
    font-size: 0.9rem;
  }
`;

const ExamplesSection = styled.div`
  @media (max-width: 1100px) {
    margin-top: 1rem;
  }
`;

const ExamplesCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  position: sticky;
  top: 100px;
`;

const ExamplesTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExamplesDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

const CodeTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${colors.backgroundSecondary};
  padding: 0.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const CodeTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: ${props => props.$active ? colors.surface : 'transparent'};
  color: ${props => props.$active ? colors.textPrimary : colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    color: ${colors.textPrimary};
  }
`;

const CodeBlock = styled.div`
  background: ${colors.secondary};
  border-radius: 10px;
  overflow: hidden;
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.secondaryLight};
`;

const CodeLanguage = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CopyButton = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.$copied ? colors.success : 'transparent'};
  border: 1px solid ${props => props.$copied ? colors.success : colors.secondaryLight};
  color: ${props => props.$copied ? colors.textLight : colors.textMuted};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
  
  &:hover {
    background: ${props => props.$copied ? colors.success : colors.secondaryLight};
    color: ${colors.textLight};
  }
`;

const CodeContent = styled.pre`
  padding: 1rem;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  color: ${colors.textLight};
  overflow-x: auto;
  max-height: 300px;
  
  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.secondaryLight};
    border-radius: 3px;
  }
`;

const TipCard = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${colors.primary}10;
  border-radius: 10px;
  border: 1px solid ${colors.primary}20;
`;

const TipTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipText = styled.div`
  font-size: 0.8rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

// Modal styles
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${colors.surface};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.2s ease-out;
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
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: ${colors.textMuted};
  padding: 0.25rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.backgroundSecondary};
    color: ${colors.textPrimary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  background: ${colors.surface};
  color: ${colors.textPrimary};
  resize: vertical;
  min-height: 80px;
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

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: ${props => props.$variant === 'secondary' ? `1px solid ${colors.border}` : 'none'};
  background: ${props => props.$variant === 'secondary' ? colors.surface : colors.primary};
  color: ${props => props.$variant === 'secondary' ? colors.textSecondary : colors.textLight};
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.$variant === 'secondary' ? colors.backgroundSecondary : colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: ${colors.surface};
  border: 2px dashed ${colors.border};
  border-radius: 16px;
  
  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${colors.primary}10;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: ${colors.primary};
    font-size: 1.5rem;
  }
  
  .title {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
    max-width: 300px;
    margin: 0 auto 1.5rem;
    line-height: 1.5;
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
  status: 'active' | 'inactive';
}

const ApiKeysPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [codeTab, setCodeTab] = useState('curl');
  const [copiedCode, setCopiedCode] = useState(false);
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
      const keysData = await apiService.getApiKeys();
      
      const transformedKeys: ApiKey[] = keysData.map((key: any) => ({
        id: key.id || key._id,
        name: key.name,
        description: key.description || '',
        key: key.api_key || key.key,
        created_at: key.created_at ? new Date(key.created_at).toLocaleDateString() : 'Unknown',
        last_used: key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never',
        requests_count: key.usage_count || 0,
        status: key.isActive ? 'active' : 'inactive'
      }));
      
      setApiKeys(transformedKeys);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching API keys:', error);
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
      
      await apiService.createApiKey({
        name: formData.name,
        description: formData.description
      });
      
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

  const copyCodeExample = () => {
    const firstKey = apiKeys[0]?.key || 'your_api_key_here';
    const code = getCodeExample(codeTab, firstKey);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
    if (key.length <= 16) return '•'.repeat(key.length);
    return key.substring(0, 8) + '•'.repeat(16) + key.substring(key.length - 4);
  };

  const getCodeExample = (tab: string, apiKey: string) => {
    switch (tab) {
      case 'curl':
        return `curl -X POST http://webscrapper.live/api/scrape \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiKey}" \\
  -d '{"url": "https://example.com"}'`;
      case 'node':
        return `const axios = require('axios');

const response = await axios.post(
  'http://webscrapper.live/api/scrape',
  { url: 'https://example.com' },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '${apiKey}'
    }
  }
);

console.log(response.data);`;
      case 'python':
        return `import requests

response = requests.post(
    'http://webscrapper.live/api/scrape',
    json={'url': 'https://example.com'},
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': '${apiKey}'
    }
)

print(response.json())`;
      default:
        return '';
    }
  };

  const totalRequests = apiKeys.reduce((sum, k) => sum + k.requests_count, 0);
  const activeCount = apiKeys.filter(k => k.status === 'active').length;
  const firstKey = apiKeys[0]?.key || 'your_api_key_here';

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: colors.textMuted }}>
          Loading API keys...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent>
          <PageTitle>
            <FiKey />
            API Key Management
          </PageTitle>
          <PageDescription>
            Create and manage API keys for programmatic access to the scraping API.
          </PageDescription>
        </HeaderContent>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <FiPlus />
          Create New Key
        </CreateButton>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon $color={colors.primary}>
            <FiKey />
          </StatIcon>
          <StatContent>
            <StatValue>{apiKeys.length}</StatValue>
            <StatLabel>Total Keys</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color={colors.success}>
            <FiCheck />
          </StatIcon>
          <StatContent>
            <StatValue>{activeCount}</StatValue>
            <StatLabel>Active Keys</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color={colors.accent}>
            <FiActivity />
          </StatIcon>
          <StatContent>
            <StatValue>{totalRequests.toLocaleString()}</StatValue>
            <StatLabel>Total Requests</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color={colors.warning}>
            <FiShield />
          </StatIcon>
          <StatContent>
            <StatValue>1,000</StatValue>
            <StatLabel>Monthly Limit</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <KeysSection>
          <SectionTitle>Your API Keys</SectionTitle>
          <KeysList>
            {apiKeys.length === 0 ? (
              <EmptyState>
                <div className="icon">
                  <FiKey />
                </div>
                <div className="title">No API Keys Yet</div>
                <div className="description">
                  Create your first API key to start using the WebScraper API programmatically.
                </div>
                <CreateButton onClick={() => setShowCreateModal(true)}>
                  <FiPlus />
                  Create First Key
                </CreateButton>
              </EmptyState>
            ) : (
              apiKeys.map((apiKey) => (
                <KeyCard key={apiKey.id}>
                  <KeyHeader>
                    <KeyInfo>
                      <KeyName>{apiKey.name}</KeyName>
                      {apiKey.description && (
                        <KeyDescription>{apiKey.description}</KeyDescription>
                      )}
                    </KeyInfo>
                    <KeyStatus $active={apiKey.status === 'active'}>
                      {apiKey.status === 'active' ? <FiCheck size={12} /> : <FiX size={12} />}
                      {apiKey.status === 'active' ? 'Active' : 'Inactive'}
                    </KeyStatus>
                  </KeyHeader>

                  <KeyValue>
                    <KeyText $hidden={!visibleKeys.has(apiKey.id)}>
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </KeyText>
                    <KeyActions>
                      <ActionButton 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                      >
                        {visibleKeys.has(apiKey.id) ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </ActionButton>
                      <ActionButton 
                        onClick={() => copyToClipboard(apiKey.key)}
                        title="Copy to clipboard"
                      >
                        <FiCopy size={16} />
                      </ActionButton>
                      <ActionButton 
                        $variant="danger"
                        onClick={() => handleDeleteKey(apiKey.id, apiKey.name)}
                        title="Delete key"
                      >
                        <FiTrash2 size={16} />
                      </ActionButton>
                    </KeyActions>
                  </KeyValue>

                  <KeyMeta>
                    <MetaItem>
                      <FiActivity />
                      {apiKey.requests_count.toLocaleString()} requests
                    </MetaItem>
                    <MetaItem>
                      <FiCalendar />
                      Created {apiKey.created_at}
                    </MetaItem>
                    <MetaItem>
                      <FiClock />
                      Last used: {apiKey.last_used}
                    </MetaItem>
                  </KeyMeta>
                </KeyCard>
              ))
            )}
          </KeysList>
        </KeysSection>

        <ExamplesSection>
          <ExamplesCard>
            <ExamplesTitle>
              <FiCode />
              Quick Start Code
            </ExamplesTitle>
            <ExamplesDescription>
              Copy and paste these code snippets to start using your API key immediately.
            </ExamplesDescription>

            <CodeTabs>
              <CodeTab $active={codeTab === 'curl'} onClick={() => setCodeTab('curl')}>
                cURL
              </CodeTab>
              <CodeTab $active={codeTab === 'node'} onClick={() => setCodeTab('node')}>
                Node.js
              </CodeTab>
              <CodeTab $active={codeTab === 'python'} onClick={() => setCodeTab('python')}>
                Python
              </CodeTab>
            </CodeTabs>

            <CodeBlock>
              <CodeHeader>
                <CodeLanguage>{codeTab}</CodeLanguage>
                <CopyButton $copied={copiedCode} onClick={copyCodeExample}>
                  {copiedCode ? <FiCheck size={10} /> : <FiCopy size={10} />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </CopyButton>
              </CodeHeader>
              <CodeContent>
                {getCodeExample(codeTab, firstKey)}
              </CodeContent>
            </CodeBlock>

            <TipCard>
              <TipTitle>
                <FiAlertCircle size={14} />
                Pro Tip
              </TipTitle>
              <TipText>
                Never expose your API key in client-side code. Use environment variables 
                and server-side requests to keep your key secure.
              </TipText>
            </TipCard>
          </ExamplesCard>
        </ExamplesSection>
      </ContentGrid>

      {/* Create Modal */}
      <ModalOverlay $isOpen={showCreateModal} onClick={() => setShowCreateModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Create New API Key</ModalTitle>
            <CloseButton onClick={() => setShowCreateModal(false)}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Key Name *</Label>
            <Input
              type="text"
              placeholder="e.g., Production API, Development Key"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>Description (Optional)</Label>
            <TextArea
              placeholder="What will this key be used for?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </FormGroup>

          <ModalActions>
            <Button $variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!formData.name.trim()}>
              Create Key
            </Button>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
};

export default ApiKeysPage;
