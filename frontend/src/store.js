import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    isAuthenticated: false,
    user: null,
    token: null,
    parentId: null,
    children: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setUser(state, userData) {
      state.isAuthenticated = true;
      state.user = userData;
    },
    setParentId(state, parentId) {
      state.parentId = parentId;
    },
    setChildren(state, children) {
      state.children = children;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.parentId = null;
      state.children = [];
      localStorage.removeItem('token');
    }
  },
  actions: {
    async loginUser({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', credentials);
        const token = response.data.token;
        commit('setToken', token);
        await dispatch('fetchUserDetails', token);
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed');
      }
    },
    async fetchUserDetails({ commit, dispatch, state }) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        const userData = response.data;
        commit('setUser', userData);
        await dispatch('fetchParentId', userData.id);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        throw new Error('Failed to fetch user details');
      }
    },
    async fetchParentId({ commit, state }, userId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/parental`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          },
          params: {
            user_id: userId
          },
        });
        const parent = response.data.find(parent => parent.user_id === userId);
        if (parent) {
          commit('setParentId', parent.id);
          await this.dispatch('fetchChildren', parent.id);
        } else {
          throw new Error('Parent not found');
        }
      } catch (error) {
        console.error('Failed to fetch parent ID:', error);
        throw new Error('Failed to fetch parent ID');
      }
    },
    async fetchChildren({ commit, state }, parentId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/parentals/${parentId}/enfants`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('setChildren', response.data);
      } catch (error) {
        console.error('Failed to fetch children data:', error);
        throw new Error('Failed to fetch children data');
      }
    },
    logoutUser({ commit }) {
      commit('logout');
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    parentId: state => state.parentId,
    children: state => state.children,
    token: state => state.token,

  }
});

export default store;
