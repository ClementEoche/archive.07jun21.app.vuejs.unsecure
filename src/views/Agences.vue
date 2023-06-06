<template>
  <div>
    <NavBar></NavBar>
    <div class="container">
      <div id="a_list" class="jumbotron m-4">
        <div class="row d-flex justify-content-between">
          <h3>Gestion des Agences</h3>
          <button class="btn btn-primary" @click="showForm">Ajouter</button>
        </div>
        <hr class="row my-4">
        <div class="row">
          <table class="table table-hover table-borderless">
            <thead>
            <tr>
              <th v-if="isAdmin==true">Entreprise</th>
              <th>Adresse</th>
              <th>Status</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="agence in agences" v-bind:key="agence.id"><!--v-if="agence.active==1"-->
              <td v-if="isAdmin==true">{{getCurrentEntreprise(agence.entreprise)}}</td>
              <td>{{agence.adresse}} {{agence.code_postal}} {{agence.ville}}</td>
              <td>{{getStatus(agence)}}</td>
              <td class="d-flex flex-row-reverse px-0">
                <button class="btn btn-primary" @click="selectAgence(agence.id)">Détails</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <Detailsagence v-bind:id="selectedAgence" v-bind:currentPage="'agences'"></Detailsagence>
    </div>

    <div class="container">
      <div id="a_add_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Ajouter une agence</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='add_form' @submit.prevent="add_agence">
          <div id="response"></div>
          <div v-if="isAdmin==true" class='form-group'>
            <label for="entrepriseId">Entreprise</label>
            <select class="form-control" ref="entrepriseId" id="entrepriseId" name="entrepriseId">
              <option value="" disabled selected></option>
              <option v-for="entreprise in entreprises" :value="entreprise.id" v-bind:key="entreprise.id">{{entreprise.nom}}</option>
            </select>
          </div>
          <div class='form-group'>
            <label for='adresse'>Adresse</label>
            <input type='text' class='form-control' ref="adresse" id='adresse' name='adresse' required>
          </div>
          <div class='form-group'>
            <label for='code_postal'>Code postal</label>
            <input type='number' class='form-control' ref="code_postal" id='code_postal' name='code_postal'
                   min="1000" max="96000" required>
          </div>
          <div class='form-group'>
            <label for='ville'>Ville</label>
            <input type='text' class='form-control' ref="ville" id='ville' name='ville' required>
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
  import Detailsagence from "../components/DetailsAgence";

  export default {
    name: 'agences',
    data() {
      return {
        selectedAgence: 0,
        agences: [],
        selectedEntreprise: 0,
        entreprises: [],
        form_message: '',
        isAdmin: false,
      }
    },
    methods: {
      //Récupérer toutes les agences
      getAgences: function () {
        var self = this
        if (JSON.parse(localStorage.getItem('userData')).role === '3') {
          axios.get('api/agence/read_all.php')
            .then(function (response) {
              self.agences = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
          axios.get('api/agence/read_by_entreprise.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.agences = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      //Récupérer tous les entreprises
      getEntreprises: function () {
        var self = this
        axios.get('api/entreprise/read_all.php')
          .then(function (response) {
            self.entreprises = response.data.records
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //Récupérer le nom d'un entreprise
      getCurrentEntreprise: function (id) {
        return this.entreprises.find(obj => obj.id == id).nom
      },
      //Récupérer le status d'une agence de manière "lisible"
      getStatus: function (agence) {
        if (agence.active == 1) {
          return "active"
        } else {
          return "désactivée"
        }
      },
      //Sélectionner une agence
      selectAgence: function (id) {
        this.selectedAgence = id
        this.showSelectedAgence(id)
      },
      //Afficher la liste des agences
      showList: function () {
        document.getElementById("a_list").classList.remove('hidden')
        document.getElementById("a_add_form").classList.add('hidden')
      },
      //Afficher les détails d'une agence
      showSelectedAgence: function (id) {
        document.getElementById("a_list").classList.add('hidden')
        document.getElementById(id + "_selected").classList.remove('hidden')
        document.getElementById("a_add_form").classList.add('hidden')
      },
      //Afficher le formulaire d'ajout
      showForm: function () {
        document.getElementById("a_list").classList.add('hidden')
        document.getElementById("a_add_form").classList.remove('hidden')
      },
      //Ajouter une agence
      add_agence: function () {
        var self = this
        if (this.isAdmin == true) {
          this.entrepriseId = this.$refs.entrepriseId.value
        }
        axios.post('api/agence/create.php', {
          "active": 1,
          "entreprise": this.entrepriseId,
          "adresse": this.$refs.adresse.value,
          "code_postal": this.$refs.code_postal.value,
          "ville": this.$refs.ville.value
        })
          .then(function (response) {
            console.log(response)
            window.location = '/agences'
          })
          .catch(function (error) {
            console.log(error)
          })
      },
    },
    created() {
      this.getAgences()
      if (JSON.parse(localStorage.getItem('userData')).role === '3') {
        this.getEntreprises()
        this.isAdmin = true
      } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
        this.entrepriseId = JSON.parse(localStorage.getItem('userData')).id
      } else {
        this.$router.push('/')
      }
    },
    components: {
      Detailsagence, NavBar
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
