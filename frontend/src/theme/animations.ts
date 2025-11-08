import { keyframes, css } from 'styled-components';

// Fade animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Scale animations
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const scaleUp = keyframes`
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
`;

// Slide animations
export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

// Bounce animations
export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Spin animations
export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
`;

// Shimmer effect
export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Shake animation
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

// Glow effect
export const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  }
`;

// Float animation
export const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Reusable animation mixins
export const animations = {
  fadeIn: (duration = '0.3s', delay = '0s') => css`
    animation: ${fadeIn} ${duration} ease-out ${delay} both;
  `,
  fadeInUp: (duration = '0.4s', delay = '0s') => css`
    animation: ${fadeInUp} ${duration} ease-out ${delay} both;
  `,
  fadeInDown: (duration = '0.4s', delay = '0s') => css`
    animation: ${fadeInDown} ${duration} ease-out ${delay} both;
  `,
  fadeInLeft: (duration = '0.4s', delay = '0s') => css`
    animation: ${fadeInLeft} ${duration} ease-out ${delay} both;
  `,
  fadeInRight: (duration = '0.4s', delay = '0s') => css`
    animation: ${fadeInRight} ${duration} ease-out ${delay} both;
  `,
  scaleIn: (duration = '0.3s', delay = '0s') => css`
    animation: ${scaleIn} ${duration} ease-out ${delay} both;
  `,
  bounceIn: (duration = '0.5s', delay = '0s') => css`
    animation: ${bounceIn} ${duration} ease-out ${delay} both;
  `,
  pulse: (duration = '1.5s') => css`
    animation: ${pulse} ${duration} ease-in-out infinite;
  `,
  spin: (duration = '1s') => css`
    animation: ${spin} ${duration} linear infinite;
  `,
  float: (duration = '3s') => css`
    animation: ${float} ${duration} ease-in-out infinite;
  `,
  glow: (duration = '2s') => css`
    animation: ${glow} ${duration} ease-in-out infinite;
  `,
  shake: (duration = '0.5s') => css`
    animation: ${shake} ${duration} ease-in-out;
  `,
};

// Transition utilities
export const transitions = {
  default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 0.3s ease-in-out',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export default {
  ...animations,
  transitions,
  keyframes: {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    scaleUp,
    slideInLeft,
    slideInRight,
    slideInUp,
    slideInDown,
    bounceIn,
    bounce,
    spin,
    pulse,
    shimmer,
    shake,
    glow,
    float,
  },
};
