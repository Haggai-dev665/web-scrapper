import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import colors from '../theme/colors';

// Modern Animations
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

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  overflow-x: hidden;
  position: relative;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  background: ${colors.gradientHero};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, ${colors.primary}15 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, ${colors.accent}10 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, ${colors.primaryGlow}05 0%, transparent 60%);
    pointer-events: none;
  }
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(${colors.secondaryLight}20 1px, transparent 1px),
    linear-gradient(90deg, ${colors.secondaryLight}20 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
  pointer-events: none;
`;

const FloatingOrb = styled.div<{ size: number; top: string; left: string; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${colors.gradientPrimary};
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  filter: blur(${props => props.size / 2}px);
  opacity: 0.3;
  animation: ${pulse} ${props => 4 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.secondary}95;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${colors.secondaryLight}50;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${colors.textLight};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.02em;

  span {
    background: ${colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${colors.textMuted};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${colors.gradientPrimary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${colors.textLight};
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

const LoginBtn = styled(Link)`
  color: ${colors.textLight};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.secondaryLight};
  }
`;

const SignupBtn = styled(Link)`
  background: ${colors.gradientPrimary};
  color: ${colors.textLight};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${colors.shadowPrimary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${colors.shadowPrimary};
  }
`;

const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.secondaryLight};
  border: 1px solid ${colors.primary}40;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  color: ${colors.primaryLight};
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.6s ease-out;

  &::before {
    content: '✨';
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: ${colors.textLight};
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  span {
    background: ${colors.gradientGlow};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: ${colors.textMuted};
  max-width: 650px;
  line-height: 1.7;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeInUp} 0.6s ease-out 0.3s both;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.gradientPrimary};
  color: ${colors.textLight};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px ${colors.shadowPrimary};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px ${colors.shadowPrimary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: ${colors.textLight};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 2px solid ${colors.secondaryLight};
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.secondaryLight};
    border-color: ${colors.primary};
  }
`;

const HeroVisual = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 4rem auto 0;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const DashboardPreview = styled.div`
  background: ${colors.secondary};
  border-radius: 16px;
  border: 1px solid ${colors.secondaryLight};
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px ${colors.shadowXl},
    0 0 0 1px ${colors.secondaryLight};
`;

const PreviewHeader = styled.div`
  height: 40px;
  background: ${colors.secondaryDark};
  border-bottom: 1px solid ${colors.secondaryLight};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
`;

const WindowDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewCard = styled.div`
  background: ${colors.secondaryLight};
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid ${colors.secondaryLight};

  h4 {
    color: ${colors.textMuted};
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .value {
    color: ${colors.textLight};
    font-size: 1.75rem;
    font-weight: 700;
  }

  .change {
    color: ${colors.success};
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background: ${colors.background};
  position: relative;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionLabel = styled.span`
  display: inline-block;
  color: ${colors.primary};
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: ${colors.textPrimary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${colors.gradientPrimary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${colors.shadowLg};
    border-color: ${colors.primary}30;

    &::before {
      transform: scaleX(1);
    }
  }
`;

const FeatureIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: ${colors.primary}15;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.7;
  font-size: 0.95rem;
`;

// Stats Section
const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: ${colors.gradientDark};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 0% 50%, ${colors.primary}20 0%, transparent 50%),
      radial-gradient(circle at 100% 50%, ${colors.accent}15 0%, transparent 50%);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: ${colors.textLight};
  margin-bottom: 0.5rem;
  background: ${colors.gradientGlow};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

// Tech Stack Section
const TechSection = styled.section`
  padding: 6rem 2rem;
  background: ${colors.backgroundSecondary};
`;

const TechGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const TechCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background: ${colors.surface};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px ${colors.shadowMd};
    border-color: ${colors.primary}40;
  }

  span {
    font-size: 2rem;
  }

  p {
    font-weight: 600;
    color: ${colors.textPrimary};
    font-size: 0.9rem;
    margin: 0;
  }
`;

// CTA Section
const CTASection = styled.section`
  padding: 8rem 2rem;
  background: ${colors.background};
  text-align: center;
`;

const CTACard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${colors.gradientDark};
  border-radius: 24px;
  padding: 4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, ${colors.primary}30 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, ${colors.accent}20 0%, transparent 40%);
  }
`;

const CTATitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${colors.textLight};
  margin-bottom: 1rem;
  position: relative;
  z-index: 10;
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  color: ${colors.textMuted};
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;
`;

// Footer
const Footer = styled.footer`
  background: ${colors.secondaryDark};
  padding: 4rem 2rem 2rem;
  border-top: 1px solid ${colors.secondaryLight};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 4rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterBrand = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${colors.textLight};
    margin-bottom: 1rem;

    span {
      background: ${colors.gradientPrimary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p {
    color: ${colors.textMuted};
    line-height: 1.7;
    max-width: 300px;
  }
`;

const FooterColumn = styled.div`
  h4 {
    color: ${colors.textLight};
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: ${colors.textMuted};
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.primaryLight};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${colors.secondaryLight};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  p {
    color: ${colors.textMuted};
    font-size: 0.875rem;
    margin: 0;
  }
`;

// Arrow Icon Component
const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// Component
const LandingPage: React.FC = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <GridBackground />
        <FloatingOrb size={300} top="10%" left="5%" delay={0} />
        <FloatingOrb size={200} top="60%" left="80%" delay={1} />
        <FloatingOrb size={150} top="30%" left="70%" delay={2} />

        <Header>
          <Logo to="/">
            ⚡ WebScraper<span>.live</span>
          </Logo>
          <Nav>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#technology">Technology</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="/api-docs">API Docs</NavLink>
          </Nav>
          <AuthButtons>
            <LoginBtn to="/login">Sign In</LoginBtn>
            <SignupBtn to="/register">Get Started</SignupBtn>
          </AuthButtons>
        </Header>

        <HeroContent>
          <HeroBadge>New: Advanced Security Analysis Available</HeroBadge>
          <HeroTitle>
            Extract Web Data<br />
            <span>With Precision & Speed</span>
          </HeroTitle>
          <HeroSubtitle>
            Enterprise-grade web scraping platform with built-in security analysis, 
            performance metrics, and real-time monitoring. Built for developers 
            who demand reliability.
          </HeroSubtitle>
          <CTAGroup>
            <PrimaryBtn to="/register">
              Start Free Trial
              <ArrowIcon />
            </PrimaryBtn>
            <SecondaryBtn to="/dashboard">
              View Dashboard
            </SecondaryBtn>
          </CTAGroup>

          <HeroVisual>
            <DashboardPreview>
              <PreviewHeader>
                <WindowDot color="#EF4444" />
                <WindowDot color="#F59E0B" />
                <WindowDot color="#10B981" />
              </PreviewHeader>
              <PreviewContent>
                <PreviewCard>
                  <h4>Total Requests</h4>
                  <div className="value">24,521</div>
                  <div className="change">↑ 12.5% this week</div>
                </PreviewCard>
                <PreviewCard>
                  <h4>Success Rate</h4>
                  <div className="value">99.8%</div>
                  <div className="change">↑ 0.3% improvement</div>
                </PreviewCard>
                <PreviewCard>
                  <h4>Avg Response</h4>
                  <div className="value">142ms</div>
                  <div className="change">↓ 18ms faster</div>
                </PreviewCard>
              </PreviewContent>
            </DashboardPreview>
          </HeroVisual>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionContainer>
          <SectionHeader>
            <SectionLabel>Features</SectionLabel>
            <SectionTitle>Everything You Need to Extract Web Data</SectionTitle>
            <SectionSubtitle>
              Powerful tools and features designed for modern web scraping workflows
            </SectionSubtitle>
          </SectionHeader>

          <FeatureGrid>
            <FeatureCard>
              <FeatureIconWrapper>⚡</FeatureIconWrapper>
              <FeatureTitle>Lightning Fast Scraping</FeatureTitle>
              <FeatureDescription>
                Powered by headless Chrome with distributed processing. 
                Handle thousands of requests with sub-second response times.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>🛡️</FeatureIconWrapper>
              <FeatureTitle>Security Analysis</FeatureTitle>
              <FeatureDescription>
                Comprehensive security scanning including HTTPS validation, 
                security headers, CSP analysis, and vulnerability detection.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>📊</FeatureIconWrapper>
              <FeatureTitle>Performance Metrics</FeatureTitle>
              <FeatureDescription>
                Real-time Core Web Vitals monitoring, load time analysis, 
                and performance optimization recommendations.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>🌐</FeatureIconWrapper>
              <FeatureTitle>Network Intelligence</FeatureTitle>
              <FeatureDescription>
                Complete network request tracking, resource analysis, 
                and third-party dependency monitoring.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>🔑</FeatureIconWrapper>
              <FeatureTitle>API Key Management</FeatureTitle>
              <FeatureDescription>
                Create and manage multiple API keys with granular permissions, 
                rate limiting, and usage analytics.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>📈</FeatureIconWrapper>
              <FeatureTitle>Usage Analytics</FeatureTitle>
              <FeatureDescription>
                Detailed dashboards with request history, success rates, 
                response times, and usage trends over time.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </SectionContainer>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          <StatItem>
            <StatValue>10M+</StatValue>
            <StatLabel>Pages Scraped</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>99.9%</StatValue>
            <StatLabel>Uptime SLA</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>&lt;200ms</StatValue>
            <StatLabel>Avg Response</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>5K+</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <TechSection id="technology">
        <SectionContainer>
          <SectionHeader>
            <SectionLabel>Technology</SectionLabel>
            <SectionTitle>Built With Modern Tech Stack</SectionTitle>
            <SectionSubtitle>
              Enterprise-grade infrastructure for reliability and performance
            </SectionSubtitle>
          </SectionHeader>

          <TechGrid>
            <TechCard><span>⚛️</span><p>React</p></TechCard>
            <TechCard><span>📘</span><p>TypeScript</p></TechCard>
            <TechCard><span>🟢</span><p>Node.js</p></TechCard>
            <TechCard><span>🍃</span><p>MongoDB</p></TechCard>
            <TechCard><span>🎭</span><p>Puppeteer</p></TechCard>
            <TechCard><span>☁️</span><p>Cloud Deploy</p></TechCard>
          </TechGrid>
        </SectionContainer>
      </TechSection>

      <CTASection>
        <CTACard>
          <CTATitle>Ready to Start Scraping?</CTATitle>
          <CTADescription>
            Join thousands of developers using WebScraper.live to extract web data efficiently.
          </CTADescription>
          <PrimaryBtn to="/register" style={{ position: 'relative', zIndex: 10 }}>
            Create Free Account
            <ArrowIcon />
          </PrimaryBtn>
        </CTACard>
      </CTASection>

      <Footer>
        <FooterContent>
          <FooterGrid>
            <FooterBrand>
              <h3>⚡ WebScraper<span>.live</span></h3>
              <p>
                Enterprise-grade web scraping platform with security analysis 
                and performance monitoring built-in.
              </p>
            </FooterBrand>

            <FooterColumn>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/api-docs">API Docs</a></li>
                <li><a href="#changelog">Changelog</a></li>
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <FooterBottom>
            <p>© 2025 WebScraper.live. All rights reserved.</p>
          </FooterBottom>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
};

export default LandingPage;
