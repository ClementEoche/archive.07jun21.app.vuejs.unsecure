<template>
  <div class="jumbotron m-4 pt-3" v-if="id!=0">
    <div class="row d-flex justify-content-between mb-4">
      <button class="btn btn-primary" @click="showList">Retour</button>
      <button class="btn btn-primary" @click="showModifyEmployeForm">Modifier</button>
      <button class="btn btn-danger" v-if="data.actif==1" @click="desactivate">Désactiver</button>
      <button class="btn btn-success" v-if="data.actif==0 && isAdmin" @click="activate">Activer</button>
    </div>
    <div class="row d-flex justify-content-between mb-4">
      <h3>Employe - {{data.prenom}} {{data.nom}}</h3>
      <h5 class="right">status : {{getStatus()}}</h5>
    </div>
    <hr class="md-4 row">
    <div class="row">
      <div class="col px-0">
        <h4>Informations Personnelles</h4>
        <table class="table table-hover">
          <tbody>
          <tr>
            <td>Civilité :</td>
            <td>{{data.civ}}</td>
          </tr>
          <tr>
            <td>Nationalité :</td>
            <td>{{data.nationalite}}</td>
          </tr>
          <tr>
            <td>Naissance :</td>
            <td>{{data.date_naiss}} - {{data.lieu_naiss}} {{data.pays_naiss}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col px-0">

        <h4 class="">Coordonnées</h4>
        <table class="table table-hover">
          <tbody>
          <tr>
            <td>Adresse :</td>
            <td>{{data.num_rue}} {{data.rue}} {{data.code_postal}} {{data.ville}}</td>
          </tr>
          <tr>
            <td>Téléphone :</td>
            <td>{{data.tel_portable}} - {{data.tel_fixe}}</td>
          </tr>
          <tr>
            <td>Mail :</td>
            <td>{{data.mail}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- FORM DE MODIFICATION -->
    
    <div id="a_modify_form" class="jumbotron m-4 pt-4 hidden">
        <div class="row">
          <h3>Modifier Employe</h3>
        </div>
        <div class="row">
          <p class="text-danger">{{form_message}}</p>
        </div>
        <form id='modify_form' @submit.prevent="modify_comm">
          <div id="response"></div>

          <div v-if="isAdmin==true" class='form-group'>
            <label for="entrepriseId">Entreprise</label>
            <select class="form-control" ref="entrepriseId" id="entrepriseId" name="entrepriseId">
              <option value="" disabled selected></option>
              <option v-for="entreprise in entreprises" :value="entreprise.id" v-bind:key="entreprise.id">{{entreprise.nom}}</option>
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
        <button type='submit' form="modify_form" class='btn btn-primary blue-grey'>Modifier</button>
        <button @click="showList" class='btn btn-primary blue-grey'>Annuler</button>
      </div>
      
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "detailsemploye",
    props: ['id', 'currentPage', 'inUse'],
    data() {
      return {
        data: [],
        employes: [],
        isAdmin: false,
        form_message: ""
      }
    },
    methods: {
      //Récuperer les données nécessaires
      getData: function () {
        var self = this
        axios.get('api/employe/read_one.php?id=' + this.id)
          .then(function (response) {
            self.data = response.data
          })
          .catch(function (error) {
            self.data = []
          });
      },
      //show
      showModifyEmployeForm: function () {
        document.getElementById("a_modify_form").classList.remove('hidden')
      },
      getCurrentEntreprise: function (id) {
        return this.entreprises.find(obj => obj.id == id).nom
      },
      //Récupérer le status du employe sous forme "lisible"
      getStatus: function () {
        if (this.data.actif == 1) {
          return "Actif"
        } else {
          return "Désactivé"
        }
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
      //Afficher la liste
      showList: function () {
        window.location = '/' + this.currentPage
      },
      //fonction de modif
      modify_comm: function () {
        var self = this
        if (this.isAdmin == true) {
          this.entrepriseId = this.$refs.entrepriseId.value
        }
        if (this.checkAge(this.$refs.date_naiss.value) && this.checkTels()) {
          axios.post('api/employe/update.php', {
            "id":this.data.id,
            "active":this.data.active,
            "entreprise":this.entrepriseId,
            "agence":this.agenceId,
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
            console.log(response)
            window.location = '/employes'
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //Désactiver le employe
      desactivate: function () {
        axios.post('api/historique/terminate.php', {
          "entreprise": this.data.entreprise,
          "employe": this.data.id
        })
        this.data.actif = 0
        this.data.entreprise = 0
        axios.post('api/user/desactivate.php', {
          "id": this.data.id
        })
        axios.post('api/employe/update.php', this.data)
      },
      //Activer le employe
      activate: function () {
        axios.post('api/historique/create.php', {
          "entreprise": this.data.entreprise,
          "employe": this.data.id
        })
        this.data.actif = 1
        axios.post('api/user/activate.php', {
          "id": this.data.id
        })
        axios.post('api/employe/update.php', this.data)
      }
    },
    watch: {
      'id': function (newVal, oldVal) {
        this.getData()
      }
    },
    created() {
      if (JSON.parse(localStorage.getItem('userData')).role === '3') {
        this.isAdmin = true
      }
    },
  }
</script>
