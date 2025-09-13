import React from 'react';
import styled from 'styled-components';
import WebScraper from './components/WebScraper';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #1e1e1e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.header`
  background: #1e1e1e;
  color: #ffffff;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.8;
  font-weight: 300;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>🔍 Advanced Web Scraper</Title>
        <Subtitle>Extract and analyze website data with powerful insights</Subtitle>
      </Header>
      <Container>
        <WebScraper />
      </Container>
    </AppContainer>
  );
}

export default App;
