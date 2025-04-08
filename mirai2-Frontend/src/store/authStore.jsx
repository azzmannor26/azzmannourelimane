import axios from 'axios';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null,
  role: localStorage.getItem('userRole') || '',
  userId: localStorage.getItem('userId') || '',  // ✅ Ensure userId is stored

  login: async (authData) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        null,
        {
          params: {
            username: authData.username,
            password: authData.password,
          },
        }
      );

      const { token, userId, username, email, role } = response.data;

      // Store user details in state and localStorage
      const user = { userId, username, email, role };

      set({ token, user, role, userId });  // ✅ Ensure userId is stored in Zustand state
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId); // ✅ Store userId separately for easy access

      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  },

  logout: () => {
    set({ token: '', user: null, role: '', userId: '' }); // ✅ Reset userId on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId'); // ✅ Remove userId from localStorage
  },
}));
