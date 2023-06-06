<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <div id="s_list" class="jumbotron m-4">
        <div class="row d-flex justify-content-between">
          <h3>Gestion des Souscriptions</h3>
          <button v-if="userRole=='3' || userRole=='1'" class="btn btn-primary" @click="showForm">Faire une
            souscription
          </button>
        </div>
        <hr class="row my-4">
        <div class="row">
          <table class="table table-hover table-borderless">
            <thead>
            <tr>
              <th v-if="userRole=='3'">Entreprise</th>
              <th v-if="userRole=='2' || userRole=='3'">Employe</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="souscription in souscriptions" v-bind:key="souscription.id">
              <td v-if="userRole=='3'">{{souscription.entreprise_nom}}</td>
              <td v-if="userRole=='2' || userRole=='3'">{{souscription.employe_nom}}</td>
              <td>{{souscription.nom}} {{souscription.prenom}}</td>
              <td>{{getStatus(souscription.status)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <div id="s_add_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Faire une souscription</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='add_form' @submit.prevent="add_souscription">
          <div id="response"></div>
          <div v-if="userRole=='3'" class='form-group'>
            <label for="entreprise">Entreprise</label>
            <select class="form-control" ref="entreprise" id="entreprise" name="entreprise">
              <option value="" disabled selected></option>
              <option v-for="entreprise in entreprises" :value="entreprise.id" v-bind:key="entreprise.id">{{entreprise.nom}}</option>
            </select>
          </div>
          <div v-if="userRole=='3'" class='form-group'>
            <label for="employe">Employe</label>
            <select class="form-control" ref="employe" id="employe" name="employe">
              <option value="" disabled selected></option>
              <option v-for="employe in employes" :value="employe.id" v-bind:key="employe.id">{{employe.nom}}</option>
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
            <label for="civ">Civilité</label>
            <select class="form-control" ref="civ" id="civ" name="civ" required>
              <option value="" disabled selected></option>
              <option value="1">Homme</option>
              <option value="2">Femme</option>
            </select>
          </div>
          <div class='form-group'>
            <label for='mail'>Adresse mail</label>
            <input type='email' class='form-control' ref="mail" id='mail' name='mail' required>
          </div>
          <div class='form-group'>
            <label for='tel_fixe'>Téléphone fixe (facultatif)</label>
            <input type='tel' class='form-control' ref="tel_fixe" id='tel_fixe' name='tel_fixe'
                   pattern="0[123459]{1}[0-9]{8}">
          </div>
          <div class='form-group'>
            <label for='tel_portable'>Téléphone portable
            </label>
            <input type='tel' class='form-control' ref="tel_portable" id='tel_portable' name='tel_portable'
                   pattern="0[67]{1}[0-9]{8}" required>
          </div>
          <div class='form-group'>
            <label for='date_naiss'>Date de naissance</label>
            <input type='date' class='form-control' ref="date_naiss" id='date_naiss' name='date_naiss' required>
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
          <div class='form-group'>
            <label for='num_rue'>Numéro de rue</label>
            <input type='number' class='form-control' ref="num_rue" id='num_rue' name='num_rue' min='0' max="1000" required>
          </div>
          <div class='form-group'>
            <label for='rue'>Rue</label>
            <input type='text' class='form-control' ref="rue" id='rue' name='rue' required>
          </div>
          <div class='form-group'>
            <label for='comp_adresse'>Complément d'adresse</label>
            <input type='text' class='form-control' ref="comp_adresse" id='comp_adresse' name='comp_adresse'>
          </div>
          <div class='form-group'>
            <label>Date de prélèvement</label>
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="optionsRadios" id="prelev1" value="1"
                       checked="">1
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="optionsRadios" id="prelev5" value="5"
                       checked="">5
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="optionsRadios" id="prelev10" value="10"
                       checked="">10
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="optionsRadios" id="prelevautre" value="autre"
                       checked="">autre : <input type='number' class='form-control' ref="prelev_autre" id='prelev_autre'
                                                 name='prelev_autre' min='1' max="31">
              </label>
            </div>
          </div>
          <div class='form-group'>
            <label for='iban'>IBAN</label>
            <input type='text' class='form-control' ref="iban" id='iban' name='iban' required>
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
  import Navbar from "../components/NavBar";
  import axios from "axios";
  import IBAN from "../../static/iban.js";

  export default {
    name: "souscriptions",
    data() {
      return {
        userRole: 0,
        entreprises: [],
        entreprise: "",
        produits:[],
        employes: [],
        employe: "",
        souscriptions: [],
        form_message: ""
      }
    },
    methods: {
      //Récupérer toutes les donénes nécessaires
      getData: function () {
        var self = this
        if (this.userRole === '3') {
          axios.get('api/entreprise/read_all.php')
            .then(function (response) {
              self.entreprises = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
          axios.get('api/employe/read_all.php')
            .then(function (response) {
              self.employes = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
          axios.get('api/souscription/read_all.php')
            .then(function (response) {
              self.souscriptions = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        else if (this.userRole === '2') {
          axios.get('api/entreprise/read_one.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.entreprise = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
          axios.get('api/employe/read_one.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.employes = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
          axios.get('api/souscription/read_by_entreprise.php?entreprise=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.souscriptions = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        else if (this.userRole === '1') {
          axios.get('api/employe/read_one.php?id=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.employe = response.data
              axios.get('api/entreprise/read_one.php?id=' + self.employe.entreprise)
                .then(function (response) {
                  self.entreprise = response.data
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
          axios.get('api/souscription/read_by_employe.php?employe=' + JSON.parse(localStorage.getItem('userData')).id)
            .then(function (response) {
              self.souscriptions = response.data.records
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      //Récupérer le nom d'un entreprise à partir de son ID
      getCurrentEntreprise: function (id) {
        return this.entreprises.find(obj => obj.id == id).nom;
      },
      //Récupérer le nom d'un employe à partir de son ID
      getCurrentEmploye: function (id) {
        return this.employes.find(obj => obj.id == id).nom;
      },
      getStatus: function (status) {
        if (status == 0) {
          return "en attente"
        } else if (status == 1) {
          return "validée"
        }
      },
      //Afficher la liste des agences
      showList: function () {
        document.getElementById("s_list").classList.remove('hidden')
        document.getElementById("s_add_form").classList.add('hidden')
      },
      //Afficher le formulaire d'ajout
      showForm: function () {
        document.getElementById("s_list").classList.add('hidden')
        document.getElementById("s_add_form").classList.remove('hidden')
      },
      generateURLcode: function () {
        var length = 8,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$*",
          pass = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          pass += charset.charAt(Math.floor(Math.random() * n));
        }
        return pass;
      },
      generateValidationcode: function () {
        var length = 8,
          charset = "0123456789",
          pass = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          pass += charset.charAt(Math.floor(Math.random() * n));
        }
        return pass;
      },
      checkAge: function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18 && age < 75;
      },
      //Ajouter/Faire une souscription
      add_souscription: function () {
        var self = this
        var date_prelevement = ''
        if (document.getElementById('prelev1').checked) {
          date_prelevement = 1
        } else if (document.getElementById('prelev5').checked) {
          date_prelevement = 5
        } else if (document.getElementById('prelev10').checked) {
          date_prelevement = 10
        } else if (document.getElementById('prelevautre').checked) {
          date_prelevement = this.$refs.prelev_autre.value
        }
        if (this.userRole == 3) {
          this.entreprise = this.entreprises.find(obj => obj.id == this.$refs.entreprise.value).nom;
          this.employe = this.employes.find(obj => obj.id == this.$refs.employe.value).nom;
        }
        if (this.checkAge(this.$refs.date_naiss.value)) {
          if (IBAN.isValid(this.$refs.iban.value)) {
            axios.post('api/souscription/create.php', {
              'entreprise': this.entreprise.id,
              'entreprise_nom': this.entreprise.nom,
              'employe': JSON.parse(localStorage.getItem('userData')).id,
              'employe_nom': JSON.parse(localStorage.getItem('userData')).name,
              'nom': this.$refs.nom.value,
              'prenom': this.$refs.prenom.value,
              'civ': this.$refs.civ.value,
              'mail': this.$refs.mail.value,
              'tel_fixe': this.$refs.tel_fixe.value,
              'tel_portable': this.$refs.tel_portable.value,
              'date_naiss': this.$refs.date_naiss.value,
              'num_rue': this.$refs.num_rue.value,
              'rue': this.$refs.rue.value,
              'code_postal': this.$refs.code_postal.value,
              'ville': this.$refs.ville.value,
              'comp_adresse': this.$refs.comp_adresse.value,
              'titulaire': this.$refs.nom.value + ' ' + this.$refs.prenom.value,
              'iban': this.$refs.iban.value,
              'date_prelevement': date_prelevement,
              'url_conf': this.generateURLcode(),
              'code_conf': this.generateValidationcode()
            })
              .then(function (response) {
                self.form_message = ''
                window.location = '/souscriptions'
              })
              .catch(function (error) {
                console.log(error);
                self.form_message = "Erreur - adresse mail déjà utilisée."
              });
          } else {
            self.form_message = "IBAN invalide"
          }
        } else {
          self.form_message = "Age invalide"
        }
      }
    },
    created() {
      this.userRole = JSON.parse(localStorage.getItem('userData')).role
      if (this.userRole == '0') {
        this.$router.push('/')
      }
      this.getData()
    }
    ,
    components: {
      Navbar
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
