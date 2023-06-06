<template>
    <div>
        <NavBar></NavBar>
        <div class="container">
            <div id="a_list" class="jumbotron m-4">
                <div class="row d-flex justify-content-between">
                     <h3>CHOIX DE LA SOUSCRIPTION</h3>
                </div>
                <hr class="row my-4">
                <div class="container col-xl-12 p-5">
                    <a v-if="isAdmin" v-for="produit in produits" v-bind:key="produit.id_prod" class="btn btn-primary btn-lg active ml-4 mr-5 mb-3" role="button" aria-pressed="true" style="width:13em">
                        <router-link to="/sous_choix" class="nav-link">{{produit.nom_prod}}
                        </router-link>
                        
                    </a>
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
  import NavBar from '../components/NavBar'
  import axios from "axios";

  export default {
    name: 'sous_dashboard',
    data() {
      return {
        selectedProduit: 0,
        produits: [],
        data:[],
        form_message: '',
        isAdmin: false,
      }
    },
    methods: {
      showModifyProduitForm: function () {
        document.getElementById("a_modify_form").classList.remove('hidden')
      },
       getProduits: function () {
        var self = this
        if (JSON.parse(localStorage.getItem('userData')).role === '3') {
          axios.get('api/produit/read_all.php')
            .then(function (response) {
              self.produits = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        } 
      },
      //Récupérer le status d'une agence de manière "lisible"
      
      showList: function () {
        document.getElementById("a_list").classList.remove('hidden')
        document.getElementById("a_add_form").classList.add('hidden')
      },
    },
    created() {
      this.getProduits()
      if (JSON.parse(localStorage.getItem('userData')).role === '3') {
        this.isAdmin = true
      } else {
        this.$router.push('/')
      }
    },
    components: {
       NavBar
    }
  }
</script>

<style>
  .hidden {
    display: none;
  }

  label {
    color: #000;
  }
</style>