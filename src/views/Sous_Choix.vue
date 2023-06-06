<template>
    <div>
        <NavBar></NavBar>
        <div class="container">
            <div id="a_list" class="jumbotron m-4">
                <div class="row d-flex justify-content-between">
                     <h3>TYPE DE SOUSCRIPTION POUR {{nom_prod}}</h3>
                </div>
                <hr class="row my-4">
                <div class="container col-xl-12 p-5">
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
    name: 'sous_choix',
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
    
        getData: function () {
        var self = this
        if (this.id_prod != 0) {
          axios.get('api/produit/read_one.php?id=' + this.id_prod)
            .then(function (response) {
              self.data = response.data
              if (JSON.parse(localStorage.getItem('userData')).role === '2') {
                axios.get('api/agence/read_by_entreprise.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
                  .then(function (response) {
                    self.agences = response.data.records
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                    }
                })
                .catch(function (error) {
                self.data = []
                });
            }
        },

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
       NavBar,
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