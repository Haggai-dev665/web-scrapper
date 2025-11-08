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
  padding-bottom: ${props => props.aspectRatio || '56.25%'};
  overflow: hidden;
  background: #f0f0f0;
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

const Skeleton = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  display: ${props => props.show ? 'block' : 'none'};
`;

interface LazyImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, aspectRatio, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ImageContainer ref={imgRef} aspectRatio={aspectRatio} className={className}>
      <Skeleton show={!loaded} />
      {inView && (
        <StyledImage
          src={src}
          alt={alt}
          loaded={loaded}
          onLoad={() => setLoaded(true)}
        />
      )}
    </ImageContainer>
  );
};

export default LazyImage;
