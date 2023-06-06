<template>
  <div>
    <NavBar></NavBar>
    <div class="container">
      <div id="p_list" class="jumbotron m-4">
        <div class="row d-flex justify-content-between">
          <h3>Gestion des Entreprises</h3>
          <button class="btn btn-primary" @click="showForm">Ajouter</button>
        </div>
        <hr class="row my-4">
        <div class="row">
          <table class="table table-hover table-borderless">
            <thead>
            <tr>
              <th>Téléphone</th>
              <th>Mail</th>
              <th>Adresse</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(entreprise, index) in entreprises" v-bind:key="entreprise.id">
              <td>{{entreprise.nom}}</td>
              <td>{{entreprise.tel}}</td>
              <td>{{entreprise.mail}}</td>
              <td>{{entreprise.adresse_siege}} {{entreprise.code_postal}} {{entreprise.ville_siege}}
              </td>
              <td class="d-flex flex-row-reverse px-0">
                <button class="btn btn-primary" @click="selectEntreprise(index)">Détails</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="p_selected" class="hidden">
        <div class="jumbotron m-4 pt-3">
          <div class="row d-flex justify-content-between mb-4">
            <button class="btn btn-primary" @click="showList">Retour</button>
            <button class="btn btn-danger" v-if="selectedEntreprise.actif == 1" @click="desactivateSelected">
              Désactiver
            </button>
            <button class="btn btn-success" v-if="selectedEntreprise.actif == 0" @click="activateSelected">
              Activer
            </button>
          </div>
          <div class="row d-flex justify-content-between mb-4">
            <h3>Entreprise - {{selectedEntreprise.nom}}</h3>
            <h5>status : {{getSelectedStatus()}}</h5>
          </div>
          <div class="row d-flex flex-wrap justify-content-between">
            <div class="flex-fill">
              <h4>Coordonnées</h4>
              <table class="table table-hover">
                <tbody>
                <tr>
                  <th>Tél</th>
                  <td>{{selectedEntreprise.tel}}</td>
                </tr>
                <tr>
                  <th>Mail</th>
                  <td>{{selectedEntreprise.mail}}</td>
                </tr>
                <tr>
                  <th>Adresse</th>
                  <td>{{selectedEntreprise.adresse_siege}} {{selectedEntreprise.code_postal}}
                    {{selectedEntreprise.ville_siege}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="flex-fill">
              <h4>Informations</h4>
              <table class="table table-hover">
                <tbody>
                <tr>
                  <th>Siret</th>
                  <td>{{selectedEntreprise.siret}}</td>
                </tr>
                <tr>
                  <th>Siren</th>
                  <td>{{selectedEntreprise.siren}}</td>
                </tr>
                <tr>
                  <th>IBAN</th>
                  <td>{{selectedEntreprise.iban}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="flex-fill">
              <h4>Représentant</h4>
              <table class="table table-hover">
                <tbody>
                <tr>
                  <th>Nom</th>
                  <td>{{selectedEntreprise.representant}}</td>
                </tr>
                <tr>
                  <th>Téléphone</th>
                  <td>{{selectedEntreprise.tel_representant}}</td>
                </tr>
                <tr>
                  <th>Fonction</th>
                  <td>{{selectedEntreprise.fonction_representant}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row" v-if="agences.length>0">
            <h4>Agences</h4>
            <table class="table table-hover">
              <thead>
              <th>Adresse</th>
              <th>Status</th>
              <th></th>
              </thead>
              <tbody>
              <tr v-for="(agence, index) in agences" v-bind:key="agence.id">
                <td>{{agence.adresse}} {{agence.code_postal}} {{agence.ville}}</td>
                <td v-if="agence.active=='1'">active</td>
                <td v-if="agence.active=='0'">désactivée</td>
                <td class="d-flex flex-row-reverse px-0">
                  <button class="btn btn-primary" @click="selectAgence(agence.id)">Détails</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="row" v-if="employes.length>0">
            <h4>Employes</h4>
            <table class="table table-hover">
              <thead>
              <th>Prénom/Nom</th>
              <th>Téléphone</th>
              <th>Mail</th>
              <th>Adresse</th>
              <th></th>
              </thead>
              <tbody>
              <tr v-for="(employe, index) in employes" v-bind:key="employe.id">
                <td>{{employe.prenom}} {{employe.nom}}</td>
                <td>{{employe.tel_portable}}</td>
                <td>{{employe.mail}}</td>
                <td>{{employe.num_rue}} {{employe.rue}} {{employe.code_postal}}
                  {{employe.ville}}
                </td>
                <td class="d-flex flex-row-reverse px-0">
                  <button class="btn btn-primary" @click="selectEmploye(employe.id)">Détails</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="a_selected" class="hidden">
        <Detailsagence v-bind:id="selectedAgence" v-bind:current-page="'entreprises'"></Detailsagence>
      </div>
      <div id="c_selected" class="hidden">
        <Detailsemploye v-bind:id="selectedEmploye" v-bind:currentPage="'entreprises'"></Detailsemploye>
      </div>
      <div id="p_add_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Ajouter un entreprise</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='add_form' @submit.prevent="add_part">
          <div id="response"></div>
          <div class='form-group'>
            <label for='nom'>Nom</label>
            <input type='text' class='form-control' ref="nom" id='nom' name='nom' required>
          </div>
          <div class='form-group'>
            <label for='sigle'>Sigle</label>
            <input type='text' class='form-control' ref="sigle" id='sigle' name='sigle' required>
          </div>
          <div class='form-group'>
            <label for='tel'>Téléphone</label>
            <input type='tel' class='form-control' ref="tel" id='tel' name='tel' pattern="[0-9]{10}" required>
          </div>
          <div class='form-group'>
            <label for='mail'>Adresse mail</label>
            <input type='email' class='form-control' ref="mail" id='mail' name='mail' required>
          </div>
          <div class='form-group'>
            <label for='adresse_siege'>Adresse siège</label>
            <input type='text' class='form-control' ref="adresse_siege" id='adresse_siege' name='adresse_siege'
                   required>
          </div>
          <div class='form-group'>
            <label for='code_postal'>Code postal</label>
            <input type="number" class='form-control' ref="code_postal" id='code_postal' name='code_postal'
                   min="1000" max="96000" required>
          </div>
          <div class='form-group'>
            <label for='ville_siege'>Ville siège</label>
            <input type="text" class='form-control' ref="ville_siege" id='ville_siege' name='ville_siege'
                   required>
          </div>
          <div class='form-group'>
            <label for='siret'>Numéro de SIRET</label>
            <input type="text" class='form-control' ref="siret" id='siret' name='siret' pattern="[0-9]{14}" required>
          </div>
          <div class='form-group'>
            <label for='siren'>Numéro de SIREN</label>
            <input type="text" class='form-control' ref="siren" id='siren' name='siren' required>
          </div>
          <div class='form-group'>
            <label for='iban'>IBAN</label>
            <input type="text" class='form-control' ref="iban" id='iban' name='iban' required>
          </div>
          <div class='form-group'>
            <label for='capital_social'>Capital social</label>
            <input type="number" class='form-control' ref="capital_social" id='capital_social'
                   name='capital_social' min="1" required>
          </div>
          <div class='form-group'>
            <label for='representant'>Représentant</label>
            <input type="text" class='form-control' ref="representant" id='representant' name='representant'
                   required>
          </div>
          <div class='form-group'>
            <label for='tel_representant'>Téléphone du représentant</label>
            <input type="tel" class='form-control' ref="tel_representant" id='tel_representant'
                   name='tel_representant' pattern="[0-9]{10}" required>
          </div>
          <div class='form-group'>
            <label for='fonction_representant'>Fonction du représentant</label>
            <select class="form-control" ref="fonction_representant" id="fonction_representant"
                    name="fonction_representant" required>
              <option value="" disabled selected></option>
              <option value="Gérant">Gérant</option>
              <option value="Expert-Comptable">Expert-Comptable</option>
              <option value="Associé">Associé</option>
              <option value="Président">Président</option>
              <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
              <option value="VDI">VDI</option>
            </select>
          </div>
          <div class='form-group'>
            <label for='status_entreprise'>Status du entreprise</label>
            <select class="form-control" ref="status_entreprise" id="status_entreprise" name="status_entreprise"
                    required>
              <option value="" disabled selected></option>
              <option value="SARL">SARL</option>
              <option value="EURL">EURL</option>
              <option value="SA">SA</option>
              <option value="SAS">SAS</option>
              <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
              <option value="VDI">VDI</option>
            </select>
          </div>
        </form>
        <button type='submit' form="add_form" class='btn btn-primary blue-grey'>Ajouter</button>
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
  import Detailsagence from "../components/DetailsAgence";
  import Detailsemploye from "../components/DetailsEmploye";
  import IBAN from "../../static/iban.js";

  export default {
    name: 'entreprises',
    data() {
      return {
        entreprises: [],
        selectedEntreprise: [],
        agences: [],
        selectedAgence: 0,
        employes: [],
        selectedEmploye: 0,
        form_message: '',
        pass: ''
      }
    },
    methods: {
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
      //Récupérer le status du entreprise séléctionné
      getSelectedStatus: function () {
        if (this.selectedEntreprise.actif == 1) {
          return 'actif'
        } else {
          return 'désactivé'
        }
      },
      //Récupérer les agences du entreprise séléctionné
      getSelectedAgences: function () {
        var self = this
        axios.get('api/agence/read_by_entreprise.php?entreprise=' + this.selectedEntreprise.id)
          .then(function (response) {
            self.agences = response.data.records
          })
          .catch(function (error) {
            self.agences = []
          });
      },
      //Récupérer les employes du entreprise séléctionné
      getSelectedEmployes: function () {
        var self = this
        axios.get('api/employe/read_by_entreprise.php?entreprise=' + this.selectedEntreprise.id)
          .then(function (response) {
            self.employes = response.data.records
          })
          .catch(function (error) {
            self.employes = []
          });
      },
      //Désactiver le entreprise sélectionné
      desactivateSelected: function () {
        if (this.agences != null) {
          this.agences.forEach(function (item, index) {
              axios.post('api/agence/update.php', {
                "id": item.id,
                "active": "0",
                "entreprise": item.entreprise,
                "adresse": item.adresse,
                "code_postal": item.code_postal,
                "ville": item.ville
              })
            }
          )
          axios.post('api/user/desactivate.php', {
            "id": this.selectedEntreprise.id
          })
        }
        if (this.employes != null) {
          this.employes.forEach(function (item, index) {
              axios.post('api/historique/terminate.php', {
                "entreprise": item.entreprise,
                "employe": item.id
              })
              item.actif = 0
              item.entreprise = 0
              axios.post('api/user/desactivate.php', {
                "id": item.id
              })
              axios.post('api/employe/update.php', item)
            }
          )
        }
        axios.post('api/user/desactivate.php', {
          "id": this.selectedEntreprise.id
        })
        this.selectedEntreprise.actif = "0";
        axios.post('api/entreprise/update.php', this.selectedEntreprise)
      },
      //Activer le entreprise sélectionné
      activateSelected: function () {
        this.selectedEntreprise.actif = 1
        axios.post('api/entreprise/update.php', this.selectedEntreprise)
        axios.post('api/user/activate.php', {
          "id": this.selectedEntreprise.id
        })
        if (this.agences != null) {
          this.agences.forEach(function (item, index) {
              axios.post('api/agence/update.php', {
                "id": item.id,
                "active": "1",
                "entreprise": item.entreprise,
                "adresse": item.adresse,
                "code_postal": item.code_postal,
                "ville": item.ville
              })
            }
          )
        }
        if (this.employes != null) {
          this.employes.forEach(function (item, index) {
              axios.post('api/historique/terminate.php', {
                "entreprise": item.entreprise,
                "employe": item.id
              })
              item.actif = 1
              item.entreprise = this.selectedEntreprise.id
              axios.post('api/user/activate.php', {
                "id": item.id
              })
              axios.post('api/employe/update.php', item)
            }
          )
        }
        axios.post('api/user/desactivate.php', {
          "id": this.selectedEntreprise.id
        })
        this.selectedEntreprise.actif = "0";
        axios.post('api/entreprise/update.php', this.selectedEntreprise)
      },
      //Séléctionner un entreprise
      selectEntreprise: function (id) {
        this.selectedEntreprise = this.entreprises[id]
        this.getSelectedAgences()
        this.getSelectedEmployes()
        this.showSelectedEntreprise()
      },
      //Sélectionner une agence
      selectAgence: function (id) {
        this.selectedAgence = id
        this.showSelectedAgence()
      },
      //Sélectionner un employe
      selectEmploye: function (id) {
        this.selectedEmploye = id
        this.showSelectedEmploye()
      },
      //Afficher la liste des entreprises
      showList: function () {
        document.getElementById("p_list").classList.remove('hidden')
        document.getElementById("p_selected").classList.add('hidden')
        document.getElementById("a_selected").classList.add('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("p_add_form").classList.add('hidden')

      },
      //Afficher les détails d'un entreprise
      showSelectedEntreprise: function () {
        document.getElementById("p_list").classList.add('hidden')
        document.getElementById("p_selected").classList.remove('hidden')
        document.getElementById("a_selected").classList.add('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("p_add_form").classList.add('hidden')
      },
      //Afficher les détails d'une agence
      showSelectedAgence: function () {
        document.getElementById("p_list").classList.add('hidden')
        document.getElementById("p_selected").classList.add('hidden')
        document.getElementById("a_selected").classList.remove('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("p_add_form").classList.add('hidden')
      },
      //Afficher les détails d'un employe
      showSelectedEmploye: function () {
        document.getElementById("p_list").classList.add('hidden')
        document.getElementById("p_selected").classList.add('hidden')
        document.getElementById("a_selected").classList.add('hidden')
        document.getElementById("c_selected").classList.remove('hidden')
        document.getElementById("p_add_form").classList.add('hidden')
      },
      //Afficher le formulaire d'ajout
      showForm: function () {
        document.getElementById("p_list").classList.add('hidden')
        document.getElementById("p_selected").classList.add('hidden')
        document.getElementById("a_selected").classList.add('hidden')
        document.getElementById("c_selected").classList.add('hidden')
        document.getElementById("p_add_form").classList.remove('hidden')
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
      //Créer un entreprise (API)
      create_entreprise: function (id) {
        var self = this
        axios.post('api/entreprise/create.php', {
          "id": id,
          "actif": 1,
          "nom": this.$refs.nom.value,
          "sigle": this.$refs.sigle.value,
          "tel": this.$refs.tel.value,
          "mail": this.$refs.mail.value,
          "adresse_siege": this.$refs.adresse_siege.value,
          "code_postal": this.$refs.code_postal.value,
          "ville_siege": this.$refs.ville_siege.value,
          "siret": this.$refs.siret.value,
          "siren": this.$refs.siren.value,
          "iban": this.$refs.iban.value,
          "capital_social": this.$refs.capital_social.value,
          "representant": this.$refs.representant.value,
          "tel_representant": this.$refs.tel_representant.value,
          "fonction_representant": this.$refs.fonction_representant.value,
          "status": this.$refs.status_entreprise.value
        })
          .then(function (response) {
            console.log('ok')
          })
          .catch(function (error) {
            console.log(error);
            self.form_message = "Erreur lors de la création du entreprise"
          })
      },
      //Ajouter un entreprise
      add_part: function () {
        if (IBAN.isValid(this.$refs.iban.value)) {
          var self = this
          this.pass = this.generatePassword(),
            axios.post('api/user/create.php', {
              "name": this.$refs.nom.value,
              "email": this.$refs.mail.value,
              "password": this.pass,
              "role": 2
            })
              .then(function (response) {
                self.form_message = ''
                self.create_entreprise(response.data.id)
                window.location = '/entreprises'
              })
              .catch(function (error) {
                console.log(error);
                self.form_message = "Erreur - adresse mail déjà utilisée."
              });
        } else {
          this.form_message = "IBAN invalide"
        }
      }
    },
    created() {
      if (JSON.parse(localStorage.getItem('userData')).role !== '3') {
        this.$router.push('/')
      } else {
        this.getEntreprises()
      }
    },
    components: {
      Detailsemploye, Detailsagence, NavBar
    }
  }
  document.addEventListener('click', function (evt) {
    if (document.getElementById('siret') != null && document.getElementById('siren')) {
      document.getElementById('siren').value = document.getElementById('siret').value.substring(0, 9)
    }
  });
</script>

<style>
  .hidden {
    display: none;
  }

  label {
    color: #000;
  }
</style>
