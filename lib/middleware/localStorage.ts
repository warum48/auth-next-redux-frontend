import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setCredentials, logout } from '../features/authSlice';

export const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: (action) => {
    if (action.type === logout.type) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } else if (action.type === setCredentials.type) {
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    }
  },
});
