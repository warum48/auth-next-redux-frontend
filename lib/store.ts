import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import authReducer from './features/authSlice';
import { localStorageMiddleware } from './middleware/localStorage';

// Function to get initial state from localStorage
const getInitialState = () => {
  // Always return a default state on the server
  if (typeof window === 'undefined') {
    return {
      auth: {
        token: null,
        user: null
      }
    };
  }

  // Client-side initialization
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return {
    auth: {
      token: token || null,
      user: user ? JSON.parse(user) : null
    }
  };
};

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  preloadedState: getInitialState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials', 'auth/logout']
      }
    })
    .concat(authApi.middleware)
    .prepend(localStorageMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
