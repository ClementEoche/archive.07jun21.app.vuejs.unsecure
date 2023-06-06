<template>
    <div>
        <NavBar></NavBar>
        <div class="container">
            <div id="a_list" class="jumbotron m-4">
                <div class="row d-flex justify-content-between">
                     <h3>Gestion des Produits</h3>
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
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="produit in produits" v-bind:key="produit.id_prod"><!--v-if="produit.active==1"-->
                                <td v-if="isAdmin==true">{{produit.id_prod}}</td>
                                <td>{{produit.nom_prod}}</td>
                                <td>{{produit.descript_p}}</td>
                                <td>{{getStatus(produit)}}</td>
                                <td>
                                  <button class="btn btn-danger" v-if="produit.actif_p==1" @click="desactivate">Désactiver</button>
                                  <button class="btn btn-success" v-if="produit.actif_p==0 && isAdmin" @click="activate">Activer</button>
                                  <button class="btn btn-primary" @click="showModifyProduitForm(produit.id_prod)">Modifier</button>
                                </td>
                                <!--<td class="d-flex flex-row-reverse px-0">
                                    <button class="btn btn-primary" @click="selectProduit(produit.id)">Détails</button>
                                </td>-->
                            </tr>
                            
                        </tbody>
                        
                    </table>
                    <!--FORM DE MODIFICATION-->
                    <div id="a_modify_form" class="jumbotron m-4 pt-4 hidden">
                          <div class="row">
                            <h3>Modifier Produit</h3>
                          </div>
                          <div class="row">
                            <p class="text-danger">{{form_message}}</p>
                          </div>
                          <form id='modify_form' @submit.prevent="modify_produit">
                            <div id="response"></div>
                            <div class='form-group'>
                                <label for='produit'>Nom produit</label>
                                <input type='text' class='form-control' ref="nom_prod_m" id='nom_prod' name='nom_prod' required>
                            </div>
                            <div class='form-group'>
                                <label for='produit'>Description</label>
                                <input type='text' class='form-control' ref="descript_p_m" id='descript_p' name='descript_p' required>
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
                <h3>Ajouter un Produit</h3>
                </div>
                <div class="row">
                <p class="text-danger">{{form_message}}</p>
                </div>
                <form id='add_form' @submit.prevent="add_produit">
                    <div id="response"></div>
                    <div class='form-group'>
                        <label for='produit'>Nom produit</label>
                        <input type='text' class='form-control' ref="nom_prod" id='nom_prod' name='nom_prod' required>
                    </div>
                    <div class='form-group'>
                        <label for='produit'>Description</label>
                        <input type='text' class='form-control' ref="descript_p" id='descript_p' name='descript_p' required>
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
    name: 'produits',
    data() {
      return {
        selectedProduit: 0,
        produits: [],
        data:[],
        form_message: '',
        isAdmin: false,
        id_modif:0,
      }
    },
    methods: {
      showModifyProduitForm: function (id_modif) {
        document.getElementById("a_modify_form").classList.remove('hidden')
        this.id_modif=id_modif
        console.log(this.id_modif)
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
      getStatus: function (produit) {
        if (produit.actif_p == 1) {
          return "actif"
        } else {
          return "désactivée"
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
      add_produit: function () {
        var self = this
        axios.post('api/produit/create.php', {
          "nom_prod": this.$refs.nom_prod.value,
          "descript_p": this.$refs.descript_p.value,
          "actif_p": 1,
        })
          .then(function (response) {
            console.log(response)
            console.log("response est vrai")
            window.location = '/produits'
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      modify_produit: function () {
        var self = this
        axios.post('api/produit/update.php', {
          
          "nom_prod": this.$refs.nom_prod_m.value,
          "descript_p": this.$refs.descript_p_m.value,
          "actif_p": 1,
          "id_prod":this.id_modif,
        })
          .then(function (response) {
            console.log(response)
            window.location = '/produits'
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      desactivate: function () {
        this.data.actif_p = 0
        this.data.entreprise = 0
        axios.post('api/user/desactivate.php', {
          "id": this.data.id_prod
        })
        axios.post('api/employe/update.php', this.data)
      },
      //Activer le employe
      activate: function () {
        this.data.actif = 1
        axios.post('api/user/activate.php', {
          "id": this.data.id_prod
        })
        axios.post('api/produit/update.php', this.data)
      }
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