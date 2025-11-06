import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import colors from '../theme/colors';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const AuthContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.cream} 0%, ${colors.backgroundSecondary} 50%, ${colors.cream} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: ${colors.white};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px ${colors.shadowLg};
  border: 2px solid ${colors.turquoise}30;
  width: 100%;
  max-width: 450px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  color: ${colors.brown};
  margin: 0;
  font-weight: 700;
`;

const Title = styled.h2`
  text-align: center;
  color: ${colors.brown};
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${colors.textSecondary};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${colors.turquoise};
    box-shadow: 0 0 0 3px ${colors.turquoise}15;
  }
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, ${colors.turquoise}, ${colors.lightTurquoise});
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px ${colors.turquoise}30;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #feb2b2;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const AuthLink = styled(Link)`
  color: ${colors.turquoise};
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BackToHome = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: ${colors.brown};
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid ${colors.brown};
  border-radius: 20px;
  transition: all 0.3s ease;
  background: ${colors.white};
  
  &:hover {
    background: ${colors.backgroundTertiary};
    border-color: ${colors.turquoise};
    color: ${colors.turquoise};
  }
`;

const OAuthSection = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OAuthButton = styled.button<{ provider: 'google' | 'github' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.provider === 'google' ? '#DB4437' : '#333'};
  background: ${colors.white};
  color: ${props => props.provider === 'google' ? '#DB4437' : '#333'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => props.provider === 'google' ? 'rgba(219, 68, 55, 0.2)' : 'rgba(0, 0, 0, 0.15)'};
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: ${colors.textMuted};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${colors.border};
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`;

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
    // TODO: Implement OAuth login
    alert(`${provider} OAuth login coming soon!`);
  };

  return (
    <AuthContainer>
      <BackToHome to="/">← Back to Home</BackToHome>
      
      <AuthCard>
        <Logo>
          <LogoText>⚡ WebScraper.live</LogoText>
        </Logo>
        
        <Title>Welcome Back</Title>
        
        <OAuthSection>
          <OAuthButton provider="google" onClick={() => handleOAuthLogin('google')}>
            <FaGoogle />
            Continue with Google
          </OAuthButton>
          <OAuthButton provider="github" onClick={() => handleOAuthLogin('github')}>
            <FaGithub />
            Continue with GitHub
          </OAuthButton>
        </OAuthSection>

        <Divider>or</Divider>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
            />
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
        
        <LinkContainer>
          Don't have an account? <AuthLink to="/register">Sign up here</AuthLink>
        </LinkContainer>
      </AuthCard>
    </AuthContainer>
  );
};

export default LoginPage;