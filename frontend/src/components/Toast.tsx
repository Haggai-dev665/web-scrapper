import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ToastItem = styled.div<{ $isExiting: boolean; type: string }>`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-left: 4px solid ${props => 
    props.type === 'success' ? '#10B981' :
    props.type === 'error' ? '#EF4444' :
    props.type === 'warning' ? '#F59E0B' : '#3B82F6'
  };
  animation: ${props => props.$isExiting ? slideOut : slideIn} 0.3s ease-in-out;
`;

const ToastIcon = styled.div<{ type: string }>`
  color: ${props => 
    props.type === 'success' ? '#10B981' :
    props.type === 'error' ? '#EF4444' :
    props.type === 'warning' ? '#F59E0B' : '#3B82F6'
  };
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
`;

const ToastMessage = styled.div`
  font-size: 14px;
  color: #6B7280;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #6B7280;
  }
`;

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exitingToasts, setExitingToasts] = useState<Set<string>>(new Set());

  const removeToast = useCallback((id: string) => {
    setExitingToasts(prev => new Set([...prev, id]));
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      setExitingToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 4000
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, [removeToast]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiX />;
      case 'warning':
        return <FiAlertTriangle />;
      default:
        return <FiInfo />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastWrapper>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            type={toast.type}
            $isExiting={exitingToasts.has(toast.id)}
          >
            <ToastIcon type={toast.type}>
              {getIcon(toast.type)}
            </ToastIcon>
            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
            </ToastContent>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FiX />
            </CloseButton>
          </ToastItem>
        ))}
      </ToastWrapper>
    </ToastContext.Provider>
  );
};