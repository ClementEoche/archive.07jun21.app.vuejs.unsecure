<template>
  <div>
    <NavBar></NavBar>
    <div class="container">
      <div class="jumbotron m-4" v-if="!this.isConnected">
        <h1>Connexion</h1>
        <p class="roboto">Vous n'êtes pas connecté.</p>
        <hr class="my-4">
        <div id="login">
          <form id='login_form' @submit.prevent="login">
            <div class="row ml-1">
              <p class="text-danger">{{error}}</p>
            </div>
            <div class='form-group'>
              <label for='email'>Adresse mail</label>
              <input type='email' class='form-control' ref="email" id='email' name='email'
                     placeholder='Enter email'>
            </div>
            <div class='form-group'>
              <label for='password'>Mot de passe</label>
              <input type='password' class='form-control' ref="password" id='password' name='password'
                     placeholder='Password'>
            </div>
            <div>
              <button type='submit' class='btn btn-primary'>Connexion</button>
            </div>
          </form>
        </div>
      </div>
      <div class="jumbotron m-4" v-if="this.isConnected">
        <h1>Connecté</h1>
        <p class="roboto">Vous êtes connecté en tant que {{userData.name}}.</p>
        <hr class="my-4">
        <div id="logout">
          <button class='btn btn-primary' v-on:click="logout">Déconnexion</button>
        </div>
      </div>
    </div>
    <div class="text-center">
      <a href="../">
      <button type="button" class="btn btn-warning" style="width:20em;height:5em">RETOUR</button>
      </a>
    </div>
  </div>
</template>

<script>
  import NavBar from "../components/NavBar";
  import axios from "axios";

  export default {
    name: 'account',
    data() {
      return {
        error: '',
        userData: []
      }
    },
    methods: {
      //Connexion via l'API
      login: function () {
        var self = this
        axios.post('api/user/login.php', {
          "email": this.$refs.email.value,
          "password": this.$refs.password.value
        })
          .then(function (response) {
            localStorage.setItem('jwt', response.data.jwt)
            axios.post('api/user/validate_token.php', {
              "jwt": response.data.jwt
            })
              .then(function (response) {
                localStorage.setItem('userData', JSON.stringify(response.data.data))
                if (JSON.parse(localStorage.getItem('userData')).actif == "1") {
                  window.location = "/"
                } else {
                  self.error = "Erreur : veuillez contacter le support par mail ( support@reflex-assistance.fr ) ou votre référent par téléphone."
                }
              })
              .catch(function (error) {
                console.log(error);
              })
          })
          .catch(function (error) {
            console.log(error);
            self.error = "login ou mot de passe incorrect."
          });
      },
      //Déconnexion (suppression des données dans le localStorage
      logout: function () {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userData');
        window.location = "/account"
      },
      //Récupérer les données utilisateur
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
      },
    },
    created() {
      this.isConnected = localStorage.getItem('jwt') !== null
      this.userData = JSON.parse(localStorage.getItem('userData'))
    },
    components: {NavBar},
  }
</script>
