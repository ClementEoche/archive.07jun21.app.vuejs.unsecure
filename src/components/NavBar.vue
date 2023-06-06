<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <router-link to="/" class="navbar-brand">OGV WEB APP</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
            aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor03">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link v-if="userRole==3" to="/entreprises" class="nav-link">Entreprises</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="userRole==3 || userRole==2" to="/agences" class="nav-link">Agences</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="userRole==3" to="/produits" class="nav-link">Produits</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="userRole==3" to="/typeproduits" class="nav-link">Types</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="userRole==3 || userRole==2" to="/employes" class="nav-link">Employes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="userRole==3 || userRole==1" to="/souscriptions" class="nav-link">Souscriptions
          </router-link>
        </li>
      </ul>
      <span class="navbar-text mr-5" v-if="userName!=''">Connecté en tant que {{userName}}</span>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/account" class="nav-link" href="#">Mon compte</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import axios from "axios";

  export default {
    name: "navbar",
    data() {
      return {
        userRole: 0,
        userName: ''
      }
    },
    methods: {
      //Récuperer les données utilisateur
      getUserData: function (jwt) {
        axios.post('api/user/validate_token.php', {
          "jwt": jwt
        })
          .then(function (response) {
            localStorage.setItem('userData', JSON.stringify(response.data.data))
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    mounted() {
      this.isConnected = localStorage.getItem('jwt') !== null
      if (this.isConnected) {
        this.getUserData(localStorage.getItem('jwt'));
        this.userRole = JSON.parse(localStorage.getItem('userData')).role;
        this.userName = JSON.parse(localStorage.getItem('userData')).name;
      }else{
        localStorage.removeItem('jwt')
        localStorage.removeItem('userData');
      }
    }
  }
</script>
