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

const PlanHighlight = styled.div`
  background: ${colors.secondaryLight};
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${colors.primary}30;
  text-align: left;
`;

const PlanTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.primaryLight};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🎁';
  }
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.textMuted};
  font-size: 0.9rem;

  &::before {
    content: '✓';
    color: ${colors.success};
    font-weight: 700;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${colors.surface};
  overflow-y: auto;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 460px;
  animation: ${fadeInUp} 0.5s ease-out;
  padding: 1rem 0;
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

const FormHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
`;

const OAuthSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const OAuthButton = styled.button<{ provider: 'google' | 'github' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.textPrimary};
  font-family: inherit;

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
  margin: 1.25rem 0;
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
  gap: 1rem;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
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

const PasswordStrength = styled.div<{ strength: number }>`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;

  .bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: ${colors.border};
    transition: background 0.3s ease;

    &.active {
      background: ${props => 
        props.strength <= 1 ? colors.error :
        props.strength === 2 ? colors.warning :
        colors.success
      };
    }
  }
`;

const PasswordHint = styled.span<{ strength: number }>`
  font-size: 0.75rem;
  color: ${props => 
    props.strength <= 1 ? colors.error :
    props.strength === 2 ? colors.warning :
    colors.success
  };
  margin-top: 0.25rem;
`;

const TermsCheck = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: ${colors.primary};
    cursor: pointer;
  }

  label {
    font-size: 0.875rem;
    color: ${colors.textSecondary};
    line-height: 1.5;

    a {
      color: ${colors.primary};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
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
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  border: 1px solid ${colors.error}30;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
  }
`;

const SuccessMessage = styled.div`
  background: ${colors.successLight};
  color: ${colors.successDark};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  border: 1px solid ${colors.success}30;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '✅';
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
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

// Helper function for password strength
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordLabel = (strength: number): string => {
  switch (strength) {
    case 0: return '';
    case 1: return 'Weak password';
    case 2: return 'Fair password';
    case 3: return 'Good password';
    case 4: return 'Strong password';
    default: return '';
  }
};

// Component
const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, firstName, lastName);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = (provider: 'google' | 'github') => {
    alert(`${provider} OAuth signup coming soon!`);
  };

  return (
    <PageContainer>
      <LeftPanel>
        <GridPattern />
        <FloatingElement top="10%" left="8%" delay={0}>🚀</FloatingElement>
        <FloatingElement top="75%" left="12%" delay={1}>🔐</FloatingElement>
        <FloatingElement top="20%" left="78%" delay={2}>📈</FloatingElement>
        <FloatingElement top="60%" left="85%" delay={3}>⚡</FloatingElement>

        <BrandingContent>
          <LogoWrapper>
            <Logo size={80} />
          </LogoWrapper>
          <BrandTitle>Start Your Web Scraping Journey Today</BrandTitle>
          <BrandDescription>
            Create your free account and get instant access to our powerful 
            web scraping platform with security analysis included.
          </BrandDescription>
          
          <PlanHighlight>
            <PlanTitle>Free Plan Includes</PlanTitle>
            <PlanFeatures>
              <PlanFeature>1,000 requests per month</PlanFeature>
              <PlanFeature>Full security analysis</PlanFeature>
              <PlanFeature>Performance metrics</PlanFeature>
              <PlanFeature>Network monitoring</PlanFeature>
              <PlanFeature>API access with documentation</PlanFeature>
            </PlanFeatures>
          </PlanHighlight>
        </BrandingContent>
      </LeftPanel>

      <RightPanel>
        <FormContainer>
          <BackLink to="/">
            ← Back to home
          </BackLink>

          <FormHeader>
            <FormTitle>Create your account</FormTitle>
            <FormSubtitle>Get started with your free account today</FormSubtitle>
          </FormHeader>

          <OAuthSection>
            <OAuthButton provider="google" onClick={() => handleOAuthSignup('google')}>
              <FaGoogle />
              Google
            </OAuthButton>
            <OAuthButton provider="github" onClick={() => handleOAuthSignup('github')}>
              <FaGithub />
              GitHub
            </OAuthButton>
          </OAuthSection>

          <Divider>
            <span>or register with email</span>
          </Divider>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            <InputRow>
              <InputGroup>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </InputGroup>
            </InputRow>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              {password && (
                <>
                  <PasswordStrength strength={passwordStrength}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`bar ${i <= passwordStrength ? 'active' : ''}`} />
                    ))}
                  </PasswordStrength>
                  <PasswordHint strength={passwordStrength}>
                    {getPasswordLabel(passwordStrength)}
                  </PasswordHint>
                </>
              )}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </InputGroup>

            <TermsCheck>
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </label>
            </TermsCheck>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </SubmitButton>
          </Form>

          <LoginLink>
            Already have an account? <Link to="/login">Sign in</Link>
          </LoginLink>
        </FormContainer>
      </RightPanel>
    </PageContainer>
  );
};

export default RegisterPage;
