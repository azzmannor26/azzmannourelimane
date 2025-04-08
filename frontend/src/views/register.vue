<template>
    <div>
      <h1>Register User</h1>
      <form @submit.prevent="registerUser">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>
        
        <label for="prenom">Prenom:</label>
        <input type="text" id="prenom" v-model="prenom" required>
  
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
  
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
  
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import usersTable from '@/tables/usersTable.vue';
  
  export default {
    components: { usersTable },
    data() {
      return {
        name: '',
        prenom: '',
        email: '',
        password: ''
      };
    },
    methods: {
      registerUser() {
        axios.post('http://127.0.0.1:8000/api/users', {
          name: this.name,
          prenom: this.prenom,
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log('User registered successfully:', response.data);
          this.$router.push('/dashboard');
        })
        .catch(error => {
          console.error('Error registering user:', error.response.data);
          // Handle error, such as displaying an error message to the user
        });
      }
    }
  }
  </script>
  