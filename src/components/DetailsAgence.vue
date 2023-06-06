<template>
  <div class="jumbotron m-4 pt-3" v-if="id!=0">
    <div class="row d-flex justify-content-between mb-4">
      <button class="btn btn-primary" @click="showList">Retour</button>
      <button class="btn btn-primary" @click="showModifyAgenceForm">Modifier</button>
      <button class="btn btn-danger" v-if="data.active==1" @click="desactivate">Désactiver</button>
      <button class="btn btn-success" v-if="data.active==0 && isAdmin" @click="activate">Activer</button>
    </div>
    <div class="row d-flex justify-content-between mb-4">
      <h3>Agence {{data.ville}}</h3>
      <h5 class="right">status : {{getStatus()}}</h5>
    </div>
    <div class="row">
      <h6>Adresse : {{data.adresse}} <br> Code Postal : {{data.code_postal}} <br> Ville : {{data.ville}}</h6>
    </div>
    <hr class="md-4 row">
    <div id="a_list" class="row" v-if="employes!=null">
      <h4>Employes</h4>
      <table class="table table-hover">
        <thead>
        <tr>
          <th>Nom/Prénom</th>
          <th>Tel</th>
          <th>Mail</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="employe in employes" v-bind:key="employe">
          <td>{{employe.nom}} {{employe.prenom}}</td>
          <td>{{employe.tel_portable}}</td>
          <td>{{employe.mail}}</td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
      <div id="a_modify_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Modifier l'Agence</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='modify_form' @submit.prevent="modify_agence">
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
        <button type='submit' form="modify_form" class='btn btn-primary blue-grey'>Modifier</button>
        <button @click="showList" class='btn btn-primary blue-grey'>Annuler</button>
      </div>
    </div>
    <!--
    <button  @click="showForm" type='submit' form="add_form" class='btn btn-primary blue-grey'>Modifier</button>
    -->
</template>

<script>
  import axios from "axios";

  export default {
    name: "detailsagence",
    props: ['id', 'currentPage'],
    data() {
      return {
        selectedEmploye: 0,
        data: [],
        selectedEntreprise: 0,
        entreprises: [],
        employes: [],
        isAdmin: false,
        form_message: ""
      }
    },
    methods: {
      getData: function () {
        var self = this
        if (this.id != 0) {
          axios.get('api/agence/read_one.php?id=' + this.id)
            .then(function (response) {
              self.data = response.data
              if (self.data.active == 1) {
                axios.get('api/employe/read_by_agence.php?agence=' + self.id)
                  .then(function (response) {
                    self.employes = response.data.records
                  })
                  .catch(function (error) {
                    self.employes = null
                  })
              } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
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
      showModifyAgenceForm: function () {
        document.getElementById("a_modify_form").classList.remove('hidden')
      },
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
      getCurrentEntreprise: function (id) {
        return this.entreprises.find(obj => obj.id == id).nom
      },
      getStatus: function (agence) {
        if (agence.active == 1) {
          return "active"
        } else {
          return "désactivée"
        }
      },
      getStatus: function () {
        if (this.data.active == "1") {
          return "Active"
        } else {
          return "Désactivée"
        }
      },
      showList: function () {
        window.location = '/' + this.currentPage
      },
      //Desactiver l'agence
      desactivate: function () {
        if (this.employes != null) {
          this.employes.forEach(function (item, index) {
              axios.post('api/historique/terminate.php', {
                "entreprise": item.entreprise,
                "employe": item.id
              })
              item.actif = 0
              axios.post('api/user/desactivate.php', {
                "id": item.id
              })
              axios.post('api/employe/update.php', item)
            }
          )
        }
        this.data.active = 0
        axios.post('api/agence/update.php', {
          "id": this.id,
          "active": "0",
          "entreprise": this.data.entreprise,
          "adresse": this.data.adresse,
          "code_postal": this.data.code_postal,
          "ville": this.data.ville
        })
      },
      //Activer l'agence
      activate: function () {
        self = this
        if (this.employes != null) {
          this.employes.forEach(function (item, index) {
              axios.post('api/historique/create.php', {
                "entreprise": item.entreprise,
                "employe": item.id
              })
              item.actif = 1
              item.entreprise = this.data.entreprise
              axios.post('api/user/activate.php', {
                "id": item.id
              })
              axios.post('api/employe/update.php', item)
            }
          )
        }
        this.data.active = 1
        axios.post('api/agence/update.php', {
          "id": this.id,
          "active": 1,
          "entreprise": this.data.entreprise,
          "adresse": this.data.adresse,
          "code_postal": this.data.code_postal,
          "ville": this.data.ville
        })
      },
      modify_agence: function () {
        var self = this
        if (this.isAdmin == true) {
          this.entrepriseId = this.$refs.entrepriseId.value
        }
        axios.post('api/agence/update.php', {
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
      }
    },
    watch: {
      'id': function (newVal, oldVal) {
        this.getData()
      }
    },
    created() {
      this.getData()
      if (JSON.parse(localStorage.getItem('userData')).role === '3') {
        this.isAdmin = true
        this.getEntreprises()
      } else if (JSON.parse(localStorage.getItem('userData')).role === '2') {
        this.entrepriseId = JSON.parse(localStorage.getItem('userData')).id
      } else {
        this.$router.push('/')
      }
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
