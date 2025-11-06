import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Color Palette
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

// Animations
const glow = keyframes`
  0% { text-shadow: 0 0 20px ${colors.accent}; }
  50% { text-shadow: 0 0 30px ${colors.accent}, 0 0 40px ${colors.lightBlue}; }
  100% { text-shadow: 0 0 20px ${colors.accent}; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px ${colors.accent}40; }
  50% { box-shadow: 0 0 40px ${colors.accent}60, 0 0 60px ${colors.lightBlue}40; }
  100% { box-shadow: 0 0 20px ${colors.accent}40; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.raisinBlack} 0%, ${colors.charcoal} 30%, ${colors.raisinBlack} 70%, ${colors.darkGray} 100%);
  position: relative;
  overflow: hidden;
  color: ${colors.white};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, ${colors.mutedBlue}25 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${colors.accent}20 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, ${colors.lightBlue}15 0%, transparent 50%);
    pointer-events: none;
    animation: ${float} 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      ${colors.accent}03 50%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  
  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
    top: 10%;
    left: 10%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 8s ease-in-out infinite reverse;
    bottom: 20%;
    right: 15%;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${colors.white};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${glow} 3s ease-in-out infinite;
  text-shadow: 0 0 15px ${colors.accent};
  
  &:hover {
    animation-duration: 1s;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${colors.gray};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${colors.accent}, ${colors.lightBlue});
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${colors.white};
    text-shadow: 0 0 15px ${colors.accent};
    
    &::after {
      width: 100%;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LoginButton = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${colors.mutedBlue};
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: rgba(90, 108, 125, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${colors.mutedBlue}40;
    border-color: ${colors.accent};
    box-shadow: 0 0 20px ${colors.accent}40;
    text-shadow: 0 0 10px ${colors.accent};
  }
`;

const SignupButton = styled(Link)`
  background: linear-gradient(45deg, ${colors.accent}, ${colors.lightBlue});
  color: ${colors.white};
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid ${colors.accent}60;
  animation: ${pulseGlow} 4s ease-in-out infinite;
  
  &:hover {
    background: linear-gradient(45deg, ${colors.lightBlue}, ${colors.accent});
    transform: translateY(-2px);
    animation-duration: 1s;
    text-shadow: 0 0 15px ${colors.white};
  }
`;

const HeroSection = styled.section`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 6rem 2rem;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, ${colors.white}, ${colors.lightBlue}, ${colors.accent});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glow} 4s ease-in-out infinite;
  text-shadow: 0 0 30px ${colors.accent}60;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  margin-bottom: 3rem;
  color: ${colors.gray};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  text-shadow: 0 0 10px ${colors.mutedBlue}40;
  animation: ${fadeInUp} 1s ease-out 0.5s both;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(45deg, ${colors.accent}, ${colors.lightBlue});
  color: ${colors.white};
  text-decoration: none;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 2px solid ${colors.accent}60;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  text-shadow: 0 0 10px ${colors.white}60;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    background: linear-gradient(45deg, ${colors.lightBlue}, ${colors.accent});
    animation-duration: 0.5s;
    text-shadow: 0 0 20px ${colors.white};
  }
`;

const SecondaryButton = styled(Link)`
  background: ${colors.charcoal}80;
  color: ${colors.white};
  text-decoration: none;
  padding: 1.2rem 3rem;
  border: 2px solid ${colors.mutedBlue};
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  
  &:hover {
    background: ${colors.mutedBlue}60;
    border-color: ${colors.accent};
    transform: translateY(-5px);
    box-shadow: 0 0 25px ${colors.accent}40;
    text-shadow: 0 0 15px ${colors.accent};
  }
`;

const FeaturesSection = styled.section`
  position: relative;
  z-index: 10;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: linear-gradient(145deg, ${colors.charcoal}40, ${colors.raisinBlack}60);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  text-align: center;
  border: 1px solid ${colors.mutedBlue}40;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, ${colors.accent}10, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-15px) rotateY(5deg);
    background: linear-gradient(145deg, ${colors.mutedBlue}30, ${colors.charcoal}50);
    border-color: ${colors.accent}60;
    box-shadow: 0 25px 60px ${colors.raisinBlack}80, 0 0 30px ${colors.accent}30;
    
    &::before {
      opacity: 1;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 15px ${colors.accent}60);
  animation: ${float} 6s ease-in-out infinite;
  
  &:hover {
    animation-duration: 2s;
  }
`;

const FeatureTitle = styled.h3`
  color: ${colors.white};
  font-size: 1.6rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 0 0 15px ${colors.accent}40;
  
  &:hover {
    text-shadow: 0 0 20px ${colors.accent}80;
    color: ${colors.lightBlue};
  }
`;

const FeatureDescription = styled.p`
  color: ${colors.gray};
  line-height: 1.7;
  font-size: 1rem;
  text-shadow: 0 0 8px ${colors.mutedBlue}30;
`;

const SectionTitle = styled.h2`
  color: ${colors.white};
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  background: linear-gradient(45deg, ${colors.white}, ${colors.lightBlue});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px ${colors.accent}50;
  animation: ${glow} 5s ease-in-out infinite;
`;

const SectionSubtitle = styled.p`
  color: ${colors.gray};
  font-size: 1.3rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 0 10px ${colors.mutedBlue}40;
`;

const StatsSection = styled.section`
  position: relative;
  z-index: 10;
  padding: 4rem 2rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 3rem auto 0;
`;

const StatCard = styled.div`
  background: linear-gradient(145deg, ${colors.charcoal}50, ${colors.raisinBlack}70);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid ${colors.mutedBlue}40;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${colors.accent}60;
    box-shadow: 0 15px 40px ${colors.raisinBlack}80, 0 0 25px ${colors.accent}30;
  }
`;

const StatNumber = styled.div`
  color: ${colors.white};
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px ${colors.accent}60;
  background: linear-gradient(45deg, ${colors.white}, ${colors.lightBlue});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  color: ${colors.gray};
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 0 8px ${colors.mutedBlue}40;
`;

const Footer = styled.footer`
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.7);
`;

const LandingPage: React.FC = () => {
  return (
    <LandingContainer>
      <AnimatedBackground />
      
      <Header>
        <Logo>
          ⚡ WebIntel Pro
        </Logo>
        <Nav>
          <NavLink to="#features">🚀 Features</NavLink>
          <NavLink to="#technology">🔧 Technology</NavLink>
          <NavLink to="#pricing">💎 Pricing</NavLink>
          <NavLink to="#docs">📚 Docs</NavLink>
        </Nav>
        <AuthButtons>
          <LoginButton to="/login">Login</LoginButton>
          <SignupButton to="/register">Get Started</SignupButton>
        </AuthButtons>
      </Header>

      <HeroSection>
        <HeroTitle>
          Next-Generation Web Intelligence<br />
          <span style={{ fontSize: '0.8em', color: colors.lightBlue }}>Powered by Advanced AI</span>
        </HeroTitle>
        <HeroSubtitle>
          Unlock the full potential of web data with our enterprise-grade scraping platform. 
          Extract, analyze, and secure insights from any website with military-grade precision. 
          Built for developers, trusted by Fortune 500 companies worldwide.
        </HeroSubtitle>
        <CTAButtons>
          <PrimaryButton to="/register">🚀 Start Your Journey</PrimaryButton>
          <SecondaryButton to="/demo">🎬 Watch Demo</SecondaryButton>
        </CTAButtons>
        
        <div style={{ 
          marginTop: '4rem', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=60&fit=crop&crop=center" 
            alt="Analytics Dashboard"
            style={{ 
              borderRadius: '10px', 
              boxShadow: `0 10px 30px ${colors.raisinBlack}80`,
              filter: `drop-shadow(0 0 15px ${colors.accent}40)`
            }}
          />
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=60&fit=crop&crop=center" 
            alt="Data Visualization"
            style={{ 
              borderRadius: '10px', 
              boxShadow: `0 10px 30px ${colors.raisinBlack}80`,
              filter: `drop-shadow(0 0 15px ${colors.lightBlue}40)`
            }}
          />
          <img 
            src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=60&fit=crop&crop=center" 
            alt="Security Analysis"
            style={{ 
              borderRadius: '10px', 
              boxShadow: `0 10px 30px ${colors.raisinBlack}80`,
              filter: `drop-shadow(0 0 15px ${colors.mutedBlue}40)`
            }}
          />
        </div>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>Revolutionary Web Intelligence Platform</SectionTitle>
        <SectionSubtitle>
          Experience the future of web scraping with our AI-powered platform that delivers unprecedented insights, 
          security analysis, and performance metrics in real-time.
        </SectionSubtitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Quantum-Speed Processing</FeatureTitle>
            <FeatureDescription>
              Harness the power of distributed headless Chrome clusters with edge computing. 
              Process millions of pages with sub-second response times and 99.99% accuracy rates.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🛡️</FeatureIcon>
            <FeatureTitle>Military-Grade Security</FeatureTitle>
            <FeatureDescription>
              Advanced threat detection with real-time vulnerability scanning, SSL/TLS analysis, 
              CSP validation, and comprehensive security posture assessment for every target.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>AI-Powered Analytics</FeatureTitle>
            <FeatureDescription>
              Machine learning algorithms analyze Core Web Vitals, predict performance bottlenecks, 
              and provide actionable optimization recommendations with precision insights.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>Deep Network Intelligence</FeatureTitle>
            <FeatureDescription>
              Complete network topology mapping, request waterfall analysis, CDN optimization tracking, 
              and real-time monitoring of third-party dependencies and data flows.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Intelligent Content Mining</FeatureTitle>
            <FeatureDescription>
              Advanced NLP algorithms extract structured data, sentiment analysis, entity recognition, 
              SEO insights, and readability metrics with human-level accuracy.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Enterprise Dashboard</FeatureTitle>
            <FeatureDescription>
              Real-time analytics with customizable widgets, API key lifecycle management, 
              usage forecasting, billing optimization, and comprehensive audit trails.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Auto-Scaling Infrastructure</FeatureTitle>
            <FeatureDescription>
              Kubernetes-powered auto-scaling handles traffic spikes seamlessly. 
              Global CDN ensures low-latency access from anywhere on the planet.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>Visual Page Analysis</FeatureTitle>
            <FeatureDescription>
              Advanced screenshot analysis with element detection, visual regression testing, 
              accessibility audits, and responsive design validation across devices.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔐</FeatureIcon>
            <FeatureTitle>Privacy & Compliance</FeatureTitle>
            <FeatureDescription>
              GDPR, CCPA, and SOC2 compliant with end-to-end encryption, data anonymization, 
              audit logs, and configurable data retention policies for enterprise security.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      {/* Technology Showcase */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: `linear-gradient(180deg, ${colors.raisinBlack} 0%, ${colors.charcoal} 100%)`,
        position: 'relative',
        zIndex: 10
      }}>
        <SectionTitle>Powered by Cutting-Edge Technology</SectionTitle>
        <SectionSubtitle>
          Built on a foundation of enterprise-grade technologies for maximum performance and reliability
        </SectionSubtitle>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginTop: '3rem',
          maxWidth: '1000px',
          margin: '3rem auto 0'
        }}>
          {[
            { icon: '🦀', name: 'Rust Backend', desc: 'Memory-safe, ultra-fast processing' },
            { icon: '🚀', name: 'React + Vite', desc: 'Lightning-fast frontend development' },
            { icon: '🍃', name: 'MongoDB Atlas', desc: 'Globally distributed database' },
            { icon: '☁️', name: 'Heroku Platform', desc: 'Scalable cloud infrastructure' },
            { icon: '🤖', name: 'Headless Chrome', desc: 'Advanced browser automation' },
            { icon: '🔧', name: 'TypeScript', desc: 'Type-safe development experience' }
          ].map((tech, index) => (
            <div key={index} style={{
              background: `linear-gradient(145deg, ${colors.charcoal}60, ${colors.raisinBlack}80)`,
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: `1px solid ${colors.mutedBlue}40`,
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.accent}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tech.icon}</div>
              <h4 style={{ 
                color: colors.white, 
                fontSize: '1.3rem', 
                marginBottom: '0.5rem',
                textShadow: `0 0 10px ${colors.accent}40`
              }}>{tech.name}</h4>
              <p style={{ color: colors.gray, fontSize: '0.9rem' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <StatsSection>
        <SectionTitle>Trusted by Industry Leaders</SectionTitle>
        <SectionSubtitle>
          Join thousands of developers and enterprises who rely on our platform for mission-critical data extraction
        </SectionSubtitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>100M+</StatNumber>
            <StatLabel>Pages Analyzed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Global Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>99.99%</StatNumber>
            <StatLabel>Uptime SLA</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>&lt; 100ms</StatNumber>
            <StatLabel>Avg Response</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>150+</StatNumber>
            <StatLabel>Countries</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7/365</StatNumber>
            <StatLabel>Expert Support</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <Footer>
        <FooterContent>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h4 style={{ 
                color: colors.white, 
                marginBottom: '1rem',
                textShadow: `0 0 10px ${colors.accent}40`
              }}>Platform</h4>
              <div style={{ color: colors.gray }}>
                <div style={{ marginBottom: '0.5rem' }}>🌐 Global CDN</div>
                <div style={{ marginBottom: '0.5rem' }}>🔒 Enterprise Security</div>
                <div style={{ marginBottom: '0.5rem' }}>📊 Real-time Analytics</div>
              </div>
            </div>
            <div>
              <h4 style={{ 
                color: colors.white, 
                marginBottom: '1rem',
                textShadow: `0 0 10px ${colors.accent}40`
              }}>Developers</h4>
              <div style={{ color: colors.gray }}>
                <div style={{ marginBottom: '0.5rem' }}>📖 API Documentation</div>
                <div style={{ marginBottom: '0.5rem' }}>🛠️ SDKs & Libraries</div>
                <div style={{ marginBottom: '0.5rem' }}>💬 Community</div>
              </div>
            </div>
            <div>
              <h4 style={{ 
                color: colors.white, 
                marginBottom: '1rem',
                textShadow: `0 0 10px ${colors.accent}40`
              }}>Support</h4>
              <div style={{ color: colors.gray }}>
                <div style={{ marginBottom: '0.5rem' }}>🎧 24/7 Support</div>
                <div style={{ marginBottom: '0.5rem' }}>📧 Contact Us</div>
                <div style={{ marginBottom: '0.5rem' }}>🎓 Training</div>
              </div>
            </div>
          </div>
          <div style={{ 
            borderTop: `1px solid ${colors.mutedBlue}40`, 
            paddingTop: '2rem', 
            textAlign: 'center' 
          }}>
            <p style={{ 
              color: colors.gray,
              textShadow: `0 0 8px ${colors.mutedBlue}30`
            }}>
              &copy; 2025 WebIntel Pro. All rights reserved. Built with ⚡ for the next generation of developers.
            </p>
          </div>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;