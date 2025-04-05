import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: true,
      error: null,
      isInitialized: false, 

      initialize: async () => {
        if (get().isInitialized) return;
        
        set({ isLoading: true });
        const token = get().token;

        if (!token) {
          return set({ 
            isLoading: false, 
            isInitialized: true,
            user: null
          });
        }

        try {
          const response = await axios.get('http://localhost:1234/users/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          set({ 
            user: response.data.user, 
            isLoading: false,
            isInitialized: true,
            error: null
          });
        } catch (error) {
          if (error.response?.status === 401 && get().refreshToken) {
            try {
              const newToken = await get().refresh();
              if (newToken) {
                const verifyResponse = await axios.get('http://localhost:1234/users/verify', {
                  headers: { Authorization: `Bearer ${newToken}` }
                });
                set({
                  user: verifyResponse.data.user,
                  token: newToken,
                  isLoading: false,
                  isInitialized: true,
                  error: null
                });
                return;
              }
            } catch (refreshError) {
              console.error('Refresh failed:', refreshError);
            }
          }
          
          set({ 
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            isInitialized: true
          });
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('http://localhost:1234/users/login', credentials);
          const { user, token, refreshToken } = response.data;
          
          // Update all state at once
          set({ 
            user, 
            token, 
            refreshToken, 
            isLoading: false,
            error: null,
            isInitialized: true // Mark as initialized
          });
          
          return true; // Return success status
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return false; // Return failure status
        }
      },

      silentRefresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return null;

        try {
          const response = await axios.post('http://localhost:1234/users/refresh', { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          
          set({ token, refreshToken: newRefreshToken });
          return token;
        } catch (error) {
          get().clear();
          return null;
        }
      },

      // Manual refresh token action
      refresh: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await axios.post('http://localhost:1234/users/refresh', { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          
          set({ token, refreshToken: newRefreshToken });
          return token;
        } catch (error) {
          get().clear();
          throw error;
        }
      },

      // Logout action
      clear: () => {
        set({ 
          user: null, 
          token: null, 
          refreshToken: null,
          isLoading: false,
          error: null
        });
      },

      // Check authentication status
      isAuthenticated: () => {
        return !!get().user;
      },

      setUser: (userData) => set({ user: { ...get().user, ...userData } }),

      // Get current auth state
      getAuthState: () => {
        const { user, token, isLoading, isInitialized } = get();
        return {
          isAuthenticated: !!user,
          user,
          token,
          isLoading,
          isInitialized
        };
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user
      }),
    
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          window.addEventListener('storage', (event) => {
            if (event.key === 'auth-storage') {
              const newState = JSON.parse(event.newValue || '{}');
              if (newState.token !== state.token) {
                state.set({ 
                  token: newState.token,
                  refreshToken: newState.refreshToken 
                });
                state.initialize();
              }
            }
          });
        }
      }
    }
  )
);

const authAxios = axios.create();

authAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const authStore = useAuthStore.getState();
    
    try {
      const newToken = await authStore.silentRefresh();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authAxios(originalRequest);
      }
    } catch (refreshError) {
      console.error('Refresh token failed:', refreshError);
    }
    
    authStore.clear();
    return Promise.reject(error);
  }
);

export { authAxios };