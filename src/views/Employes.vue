<template>
  <div>
    <NavBar></NavBar>
    <div class="container">
      <div id="c_list" class="jumbotron m-4">
        <div class="row d-flex justify-content-between">
          <h3>Gestion des Employes</h3>
          <button class="btn btn-primary" @click="showForm">Ajouter</button>
        </div>
        <hr class="my-4 row">
        <div class="row">
          <table class="table table-hover table-borderless">
            <thead>
            <tr>
              <th v-if="isAdmin==true">Entreprise</th>
              <th>Nom/Prénom</th>
              <th>Tel</th>
              <th>Mail</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="employe in employes" v-bind:key="employe.id"  >
              <td v-if="isAdmin==true">{{getCurrentEntreprise(employe.entreprise)}}</td>
              <td>{{employe.nom}} {{employe.prenom}}</td>
              <td>{{employe.tel_portable}}</td>
              <td>{{employe.mail}}</td>
              <td class="d-flex flex-row-reverse px-0">
                <button class="btn btn-primary" @click="selectEmploye(employe.id)">Détails</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <div id="c_selected" class="hidden">
        <Detailsemploye v-bind:id="selectedEmploye" v-bind:currentPage="'employes'"></Detailsemploye>
      </div>
    </div>
    <div class="container">
      <div id="c_add_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Ajouter un employe</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='add_form' @submit.prevent="add_comm">
          <div id="response"></div>
          <div v-if="isAdmin==true" class='form-group'>
            <label for="entrepriseId">Entreprise</label>
            <select class="form-control" ref="entrepriseId" id="entrepriseId" name="entrepriseId" required>
              <option value="" disabled selected></option>
              <option v-for="entreprise in entreprises" :value="entreprise.id" v-bind:key="entreprise.id">{{entreprise.nom}}</option>
            </select>
          </div>
          <div class='form-group'>
            <label for="agenceId">Agence</label>
            <select class="form-control" ref="agenceId" id="agenceId" name="agenceId" required>
              <option value="" disabled selected></option>
              <option v-for="agence in agences" :value="agence.id" v-bind:key="agence.id"><p v-if="isAdmin==true">
                {{getCurrentEntreprise(agence.entreprise)}} - </p>{{agence.ville}}
              </option>
            </select>
          </div>
          <div class='form-group'>
            <label for="civ">Civilité</label>
            <select class="form-control" ref="civ" id="civ" name="civ" required>
              <option value="" disabled selected></option>
              <option value="1">Homme</option>
              <option value="2">Femme</option>
            </select>
          </div>
          <div class='form-group'>
            <label for='nom'>Nom</label>
            <input type='text' class='form-control' ref="nom" id='nom' name='nom' required>
          </div>
          <div class='form-group'>
            <label for='prenom'>Prenom</label>
            <input type='text' class='form-control' ref="prenom" id='prenom' name='prenom' required>
          </div>
          <div class='form-group'>
            <label for='date_naiss'>Date de naissance</label>
            <input type='date' class='form-control' ref="date_naiss" id='date_naiss' name='date_naiss' required>
          </div>
          <div class='form-group'>
            <label for='lieu_naiss'>Lieu de naissance</label>
            <input type='text' class='form-control' ref="lieu_naiss" id='lieu_naiss' name='lieu_naiss' required>
          </div>
          <div class='form-group'>
            <label for='pays_naiss'>Pays de naissance</label>
            <input type='text' class='form-control' ref="pays_naiss" id='pays_naiss' name='pays_naiss' required>
          </div>
          <div class='form-group'>
            <label for='num_rue'>Numéro de rue</label>
            <input type='number' class='form-control' ref="num_rue" id='num_rue' name='num_rue' min="0" max="1000" required>
          </div>
          <div class='form-group'>
            <label for='rue'>Rue</label>
            <input type='text' class='form-control' ref="rue" id='rue' name='rue' required>
          </div>
          <div class='form-group'>
            <label for='code_postal'>Code postal</label>
            <input type='number' class='form-control' ref="code_postal" id='code_postal' name='code_postal'
                   pmin="1000" max="96000" required>
          </div>
          <div class='form-group'>
            <label for='ville'>Ville</label>
            <input type='text' class='form-control' ref="ville" id='ville' name='ville' required>
          </div>
          <div class='form-group'>
            <label for='tel_fixe'>Téléphone fixe</label>
            <input type='tel' class='form-control' ref="tel_fixe" id='tel_fixe' name='tel_fixe'
                   pattern="0[123459]{1}[0-9]{8}" required>
          </div>
          <div class='form-group'>
            <label for='tel_portable'>Téléphone portable</label>
            <input type='tel' class='form-control' ref="tel_portable" id='tel_portable' name='tel_portable'
                   pattern="0[67]{1}[0-9]{8}" required>
          </div>
          <div class='form-group'>
            <label for='mail'>Adresse mail</label>
            <input type='email' class='form-control' ref="mail" id='mail' name='mail' required>
          </div>
          <div class='form-group'>
            <label for='nationalite'>Nationalité</label>
            <input type='text' class='form-control' ref="nationalite" id='nationalite' name='nationalite'
                   required>
          </div>
        </form>
        <button type='submit' form="add_form" class='btn btn-primary'>Ajouter</button>
        <button @click="showList" class='btn btn-primary'>Annuler</button>
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
  import Detailsemploye from "../components/DetailsEmploye";
  import emailjs from "emailjs-com";

  export default {
    name: 'employes',
    data() {
      return {
        selectedEmploye: 0,
        employes: [],
        entrepriseId: 0,
        entreprises: [],
        agenceId: 0,
        agences: [],
        data:[],
        form_message: '',
        pass: '',
        isAdmin: false
      }
    },
    methods: {
      validstate: function(){
        bool = false;
        if((employe.actif==1) || (isAdmin==true)){
          bool = true;
        }
        return bool;
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
        return this.entreprises.find(obj => obj.id == id).nom;
      },
      //Récupérer toutes les agences
      getData: function () {
        var self = this
        if (JSON.parse(localStorage.getItem('userData')).role === '3') {
          axios.get('api/employe/read_all.php')
            .then(function (response) {
              self.employes = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
          axios.get('api/employe/read_by_entreprise.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.employes = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        }
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
      //Sélectionner un employe
      selectEmploye: function (id) {
        this.selectedEmploye = id
        this.showSelectedEmploye()
      },
      //Afficher la liste des employes
      showList: function () {
        document.getElementById("c_list").classList.remove('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("c_add_form").classList.add('hidden')
      },
      //Afficher les détails d'un commecial
      showSelectedEmploye: function () {
        document.getElementById("c_list").classList.add('hidden')
        document.getElementById("c_selected").classList.remove('hidden')
        document.getElementById("c_add_form").classList.add('hidden')
      },
      //Afficher le formulaire d'ajout de employe
      showForm: function () {
        document.getElementById("c_list").classList.add('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("c_add_form").classList.remove('hidden')

      },
      //Vérifier les numéros de téléphone
      checkTels: function () {
        if (this.$refs.tel_fixe.value != '' || this.$refs.tel_portable.value != '') {
          return true
        }
        return false
      },
      //Vérifier l'âge
      checkAge: function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18;
      },
      //Génerer un mot de passe
      generatePassword: function () {
        var length = 8,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$*",
          pass = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          pass += charset.charAt(Math.floor(Math.random() * n));
        }
        return pass;
      },
      //Créer un employe (API)
      create_employe: function (id) {
        var self = this
        if (this.isAdmin == true) {
          this.entrepriseId = this.$refs.entrepriseId.value
        }
        if (this.checkAge(this.$refs.date_naiss.value) && this.checkTels()) {
          axios.post('api/employe/create.php', {
            "id": id,
            "actif": 1,
            "entreprise": this.entrepriseId,
            "agence": this.$refs.agenceId.value,
            "civ": this.$refs.civ.value,
            "nom": this.$refs.nom.value,
            "prenom": this.$refs.prenom.value,
            "date_naiss": this.$refs.date_naiss.value,
            "lieu_naiss": this.$refs.lieu_naiss.value,
            "pays_naiss": this.$refs.pays_naiss.value,
            "num_rue": this.$refs.num_rue.value,
            "rue": this.$refs.rue.value,
            "code_postal": this.$refs.code_postal.value,
            "ville": this.$refs.ville.value,
            "tel_fixe": this.$refs.tel_fixe.value,
            "tel_portable": this.$refs.tel_portable.value,
            "mail": this.$refs.mail.value,
            "nationalite": this.$refs.nationalite.value,
            "carteId": 'none'
          })
            .then(function (response) {
              console.log('ok')
            })
            .catch(function (error) {
              console.log(error);
              self.form_message = "Erreur lors de la création du employe"
            })
        }
      },
      //Créer un historique (API)
      create_historique: function (id) {
        var self = this
        if (this.isAdmin == true) {
          this.entrepriseId = this.$refs.entrepriseId.value
        }
        axios.post('api/historique/create.php', {
          "entreprise": self.entrepriseId,
          "employe": id
        })
          .catch(function (error) {
            console.log(error);
          })
      },
      //Ajouter un employe
      add_comm: function () {
        var self = this
        this.pass = this.generatePassword()
        axios.post('api/user/create.php', {
          "name": this.$refs.nom.value + ' ' + this.$refs.prenom.value,
          "email": this.$refs.mail.value,
          "password": this.pass,
          "role": 1
        })
          .then(function (response) {
            self.form_message = ''
            self.create_employe(response.data.id)
            self.create_historique(response.data.id)
            window.location = '/employes'
          })
          .catch(function (error) {
            console.log(error);
            self.form_message = "Erreur - l'adresse mail est déjà utilisée."
          });
      }
    },
    created() {
      if (JSON.parse(localStorage.getItem('userData')).role === '3') {
        this.getEntreprises()
        this.isAdmin = true
      } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
        this.entrepriseId = JSON.parse(localStorage.getItem('userData')).id
      } else {
        this.$router.push('/')
      }
      this.getData()
    }
    ,
    components: {
      Detailsemploye, NavBar
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
