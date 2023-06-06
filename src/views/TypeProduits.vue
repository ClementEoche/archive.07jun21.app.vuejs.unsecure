<template>
    <div>
        <NavBar></NavBar>
        <div class="container">
            <div id="a_list" class="jumbotron m-4">
                <div class="row d-flex justify-content-between">
                     <h3>Gestion des Types de Produits</h3>
                     <button v-if="isAdmin==true" class="btn btn-primary" @click="showForm">Ajouter
                    </button>
                </div>
                <hr class="row my-4">
                <div class="row">
                    <table class="table table-hover table-borderless">
                        <thead>
                            <tr>
                                <th v-if="isAdmin==true">Id</th>
                                <th>Nom</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="typeProduit in typeProduits" v-bind:key="typeProduit.id_type_prod">
                                <td v-if="isAdmin==true">{{typeProduit.id_type_prod}}</td>
                                <td>{{typeProduit.nom_type_prod}}</td>
                                <td>
                                  <button class="btn btn-primary" @click="showModifyTypeProduitForm(typeProduit.id_type_prod)">Modifier</button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <!--FORM DE MODIFICATION-->
                    <div id="a_modify_form" class="jumbotron m-4 pt-4 hidden">
                          <div class="row">
                            <h3>Modifier Type de Produit</h3>
                          </div>
                          <div class="row">
                            <p class="text-danger">{{form_message}}</p>
                          </div>
                          <form id='modify_form' @submit.prevent="modify_type_produit">
                            <div id="response"></div>
                            <div class='form-group'>
                                <label for='typeProduit'>Nom type de produit</label>
                                <input type='text' class='form-control' ref="nom_type_prod_m" id='nom_type_prod' name='nom_type_prod' required>
                            </div>
                          </form>
                          <button type='submit' form="modify_form" class='btn btn-primary blue-grey'>Modifier</button>
                          <button @click="showList" class='btn btn-primary blue-grey'>Annuler</button>
                        </div>
                </div>
            </div>
        </div>
        <!--FORM D'AJOUT-->
        <div class="container">
            <div id="a_add_form" class="jumbotron m-4 pt-4 hidden">
                <div class="row">
                <h3>Ajouter un type de produit</h3>
                </div>
                <div class="row">
                <p class="text-danger">{{form_message}}</p>
                </div>
                <form id='add_form' @submit.prevent="add_type_produit">
                    <div id="response"></div>
                    <div class='form-group'>
                        <label for='typeProduit'>Nom type produit</label>
                        <input type='text' class='form-control' ref="nom_type_prod" id='nom_type_prod' name='nom_type_prod' required>
                    </div>
                </form>
                <button type='submit' form="add_form" class='btn btn-primary blue-grey'>Ajouter</button>
                <button @click="showList" class='btn btn-primary blue-grey'>Annuler</button>
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
    name: 'typeproduits',
    data() {
      return {
        selectedTypeProduit: 0,
        typeProduits: [],
        data:[],
        form_message: '',
        isAdmin: false,
        id_modif:0,
      }
    },
    methods: {
      showModifyTypeProduitForm: function (id_type_modif) {
        document.getElementById("a_modify_form").classList.remove('hidden')
        this.id_type_modif=id_type_modif
        console.log(this.id_type_modif)
      },
       getTypeProduits: function () {
        var self = this
        if (JSON.parse(localStorage.getItem('userData')).role === '3') {
          axios.get('api/type_produit/read_all.php')
            .then(function (response) {
              self.produits = response.data.records
              //console.log(typeproduit.id_type_prod)
            })
            .catch(function (error) {
              console.log(error);
            });
        } 
      },
      //Afficher la liste des agences
      showList: function () {
        document.getElementById("a_list").classList.remove('hidden')
        document.getElementById("a_add_form").classList.add('hidden')
      },
      //Afficher le formulaire d'ajout
      showForm: function () {
        document.getElementById("a_list").classList.add('hidden')
        document.getElementById("a_add_form").classList.remove('hidden')
      },
      //Ajouter une agence
      add_type_produit: function () {
        var self = this
        axios.post('api/type_produit/create.php', {
          "nom_type_prod": this.$refs.nom_type_prod.value,
        })
          .then(function (response) {
            console.log(response)
            console.log("response est vrai")
            window.location = '/typeproduits'
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      modify_type_produit: function () {
        var self = this
        axios.post('api/type_produit/update.php', {
          
          "nom_type_prod": this.$refs.nom_type_prod_m.value,
          "id_type_prod":this.id_type_modif,
        })
          .then(function (response) {
            console.log(response)
            window.location = '/typeproduits'
          })
          .catch(function (error) {
            console.log(error)
          })
      },
    },
    created() {
      this.getTypeProduits()
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