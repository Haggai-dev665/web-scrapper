import React from 'react';
import styled from 'styled-components';
import WebScraper from './components/WebScraper';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #1e1e1e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.header`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 3rem 0;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  margin: 1rem 0 0 0;
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>� AI-Powered Web Intelligence</Title>
        <Subtitle>Extract, analyze, and visualize comprehensive website data with advanced insights</Subtitle>
      </Header>
      <Container>
        <WebScraper />
      </Container>
    </AppContainer>
  );
}

export default App;
