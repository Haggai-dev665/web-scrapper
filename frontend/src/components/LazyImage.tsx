import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const ImageContainer = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => props.aspectRatio || '56.25%'}; /* 16:9 by default */
  overflow: hidden;
  background: #f0f0f0;
`;

const Placeholder = styled.div<{ isLoading: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  display: ${props => props.isLoading ? 'block' : 'none'};
`;

const StyledImage = styled.img<{ loaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.loaded ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

interface LazyImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, aspectRatio, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ImageContainer ref={containerRef} aspectRatio={aspectRatio} className={className}>
      <Placeholder isLoading={!loaded} />
      {isInView && (
        <StyledImage
          ref={imgRef}
          src={src}
          alt={alt}
          loaded={loaded}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </ImageContainer>
  );
};

export default LazyImage;
