import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import colors from '../theme/colors';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Logo from '../components/Logo';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${colors.background};
`;

const LeftPanel = styled.div`
  flex: 1;
  background: ${colors.gradientHero};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, ${colors.primary}20 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${colors.accent}15 0%, transparent 50%);
    pointer-events: none;
  }
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(${colors.secondaryLight}15 1px, transparent 1px),
    linear-gradient(90deg, ${colors.secondaryLight}15 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
`;

const FloatingElement = styled.div<{ top: string; left: string; delay: number }>`
  position: absolute;
  width: 60px;
  height: 60px;
  background: ${colors.primary}30;
  border-radius: 16px;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} ${props => 3 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay * 0.5}s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${colors.primary}40;
`;

const BrandingContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 450px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
`;

const BrandTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textLight};
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const BrandDescription = styled.p`
  font-size: 1.1rem;
  color: ${colors.textMuted};
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${colors.textMuted};
  font-size: 0.95rem;

  .icon {
    width: 24px;
    height: 24px;
    background: ${colors.primary}30;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.primaryLight};
    font-size: 0.75rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  background: ${colors.surface};
  min-height: 100vh;
  
  @media (min-width: 769px) {
    padding: 2rem;
  }
  
  @media (max-width: 968px) {
    min-height: 100vh;
    justify-content: flex-start;
    padding-top: 2rem;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeInUp} 0.5s ease-out;
  
  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary};
  }
`;

const MobileLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  @media (min-width: 969px) {
    display: none;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
  
  @media (min-width: 769px) {
    font-size: 1.75rem;
  }
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
`;

const OAuthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const OAuthButton = styled.button<{ provider: 'google' | 'github' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.textPrimary};

  &:hover {
    background: ${colors.backgroundSecondary};
    border-color: ${colors.borderDark};
  }

  svg {
    font-size: 1.1rem;
    color: ${props => props.provider === 'google' ? '#DB4437' : '#333'};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: ${colors.textMuted};
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${colors.border};
  }

  span {
    padding: 0 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  font-size: 1rem;
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

const ForgotPassword = styled(Link)`
  font-size: 0.875rem;
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 500;
  text-align: right;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${colors.gradientPrimary};
  color: ${colors.textLight};
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${colors.shadowPrimary};
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${colors.shadowPrimary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: ${colors.errorLight};
  color: ${colors.errorDark};
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  border: 1px solid ${colors.error}30;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: ${colors.textSecondary};
  font-size: 0.95rem;

  a {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Component
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    alert(`${provider} OAuth login coming soon!`);
  };

  return (
    <PageContainer>
      <LeftPanel>
        <GridPattern />
        <FloatingElement top="15%" left="10%" delay={0}>⚡</FloatingElement>
        <FloatingElement top="70%" left="15%" delay={1}>🛡️</FloatingElement>
        <FloatingElement top="25%" left="75%" delay={2}>📊</FloatingElement>
        <FloatingElement top="65%" left="80%" delay={3}>🌐</FloatingElement>

        <BrandingContent>
          <LogoWrapper>
            <Logo size={80} />
          </LogoWrapper>
          <BrandTitle>Extract Web Data with Enterprise-Grade Power</BrandTitle>
          <BrandDescription>
            Join thousands of developers who trust our platform for reliable, 
            secure, and lightning-fast web scraping.
          </BrandDescription>
          <FeatureList>
            <FeatureItem>
              <span className="icon">✓</span>
              Real-time security analysis & vulnerability scanning
            </FeatureItem>
            <FeatureItem>
              <span className="icon">✓</span>
              Performance metrics & Core Web Vitals monitoring
            </FeatureItem>
            <FeatureItem>
              <span className="icon">✓</span>
              Comprehensive API with detailed documentation
            </FeatureItem>
            <FeatureItem>
              <span className="icon">✓</span>
              99.9% uptime SLA with global infrastructure
            </FeatureItem>
          </FeatureList>
        </BrandingContent>
      </LeftPanel>

      <RightPanel>
        <FormContainer>
          <MobileLogoWrapper>
            <Logo size={60} />
          </MobileLogoWrapper>
          
          <BackLink to="/">
            ← Back to home
          </BackLink>

          <FormHeader>
            <FormTitle>Welcome back</FormTitle>
            <FormSubtitle>Sign in to your account to continue</FormSubtitle>
          </FormHeader>

          <OAuthSection>
            <OAuthButton provider="google" onClick={() => handleOAuthLogin('google')}>
              <FaGoogle />
              Google
            </OAuthButton>
            <OAuthButton provider="github" onClick={() => handleOAuthLogin('github')}>
              <FaGithub />
              GitHub
            </OAuthButton>
          </OAuthSection>

          <Divider>
            <span>or continue with email</span>
          </Divider>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </InputGroup>

            <InputGroup>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label htmlFor="password">Password</Label>
                <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </SubmitButton>
          </Form>

          <SignupLink>
            Don't have an account? <Link to="/register">Create one</Link>
          </SignupLink>
        </FormContainer>
      </RightPanel>
    </PageContainer>
  );
};

export default LoginPage;
