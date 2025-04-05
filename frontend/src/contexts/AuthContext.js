import { createContext, useContext, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();
  const { initialize, isInitialized, isLoading } = store;
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !isInitialized) {
      initialize().catch(error => {
        console.error('Initialization error:', error);
      });
      initialized.current = true;
    }
  }, [initialize, isInitialized]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    isAuthenticated: context.isAuthenticated,
    user: context.user,
    token: context.token,
    login: context.login,
    logout: context.clear,
    refresh: context.refresh,
    getAuthState: context.getAuthState,
    error: context.error,
    isLoading: context.isLoading,
    isInitialized: context.isInitialized,
    setUser: context.setUser
  };
};