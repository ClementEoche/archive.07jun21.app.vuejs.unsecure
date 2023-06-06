<template>
  <div>
    <NavBar></NavBar>
    <div id="p_list" class="jumbotron m-4">
        
          <span class="navbar-text mr-5" v-if="userName!=''">Bienvenue {{userName}} !</span>
          <h3>MENU DES ACTIONS :</h3>
          <div class="container row col-xl-12 p-5">
            <div class="container col-xl-5 p-5" style="background:white">
              <h4>Ressources Humaines :</h4><br>
              <a v-if="userRole==3" class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/entreprises" class="nav-link">Entreprises<br><br>
                  <figure><img src="../../build/handshake.png" alt="handshake" width="75px"></figure>
                </router-link>
                
              </a>
              <a v-if="userRole==3 || userRole==2" class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/agences" class="nav-link">Agences<br><br>
                  <figure><img src="../../build/buildings.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
              <a v-if="userRole==3 || userRole==2" class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/employes" class="nav-link">Employes<br><br>
                  <figure><img src="../../build/employes.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
              
            </div>
            <div></div>
            <div class="container col-xl-5 p-5" style="background:white">
              <h4>Gestionnaire :</h4><br>
              <a v-if="userRole==3 " class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/typeproduits" class="nav-link">Type Produits<br><br>
                  <figure><img src="../../build/package.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
              <a v-if="userRole==3 " class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/produits" class="nav-link">Produits<br><br>
                  <figure><img src="../../build/package.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
              <a v-if="userRole==3 || userRole==1" class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/souscriptions" class="nav-link">Souscriptions<br><br>
                  <figure><img src="../../build/souscription.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
              <a v-if="userRole==3 || userRole==1" class="btn btn-primary btn-lg active ml-1 mr-1 mb-2" role="button" aria-pressed="true" style="width:11.5em">
                <router-link to="/sous_dashboard" class="nav-link">Special<br><br>
                  <figure><img src="../../build/souscription.png" alt="handshake" width="75px"></figure>
                </router-link>
              </a>
            </div>
          </div>
    </div>
    <br><br><br><br><br>
  </div>

</template>

<script>
  import axios from "axios";
  import NavBar from '../components/NavBar'
  export default {
    name: 'dashboard',
    components: { NavBar },
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
        this.getUserData(localStorage.getItem('jwt'))
        this.userRole = JSON.parse(localStorage.getItem('userData')).role
        this.userName = JSON.parse(localStorage.getItem('userData')).name
      }else{
        localStorage.removeItem('jwt')
        localStorage.removeItem('userData');
      }
    }
    
  }
</script>

<style>

</style>
