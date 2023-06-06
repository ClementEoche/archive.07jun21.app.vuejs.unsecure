<template>
  <div class="jumbotron m-4 pt-3">
    <div class="row d-flex justify-content-between mb-4">
      <h3>Validation de votre contrat Reflex-Assistance en 3 étapes</h3>
    </div>
    <hr class="my-4">
    <div id="validate">
      <label>1 - Vérifiez vos coordonnées</label>
      <p>
        nom/prénom : {{data.nom}} {{data.prenom}}<br/>
        numéro de contrat : {{data.id}}<br/>
        adresse : {{data.num_rue}} {{data.rue}} {{data.code_postal}} {{data.ville}}<br/>
      </p>
      <form id='validate_form' @submit.prevent="validate">
        <div class="row ml-1">
          <p class="text-danger">{{error}}</p>
        </div>
        <div class='form-group'>
          <label for='password'>2 - Entrez votre code confidentiel.</label>
          <input type='password' class='form-control' style="width: 200px" ref="password" id='password' name='password'
                 placeholder='Code confidentiel'>
        </div>
        <div class="form-group">
          <label for="v_button" style="width: 100%;">3 - Valider votre contrat</label>
          <button id="v_button" type='submit' class='btn btn-primary'>Valider mon contrat</button>
        </div>
      </form>
    </div>
    <div id="validated" class="hidden">
      <div class="row ml-1">
        <p class="text-success">Votre contrat a bien été validé !</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Validation",
    data() {
      return {
        error: '',
        data: []
      }
    },
    props: ['url'],
    methods: {
      getData: function(){
        self = this
        axios.post('/api/souscription/read_by_code.php', {
          "url_conf": this.url
        }).then(function (response) {
          self.data=response.data.substring(0, response.data.length - 1)
          self.data=JSON.parse(self.data)
          if(self.data.status=="1"){
            document.getElementById('validate').classList.add("hidden")
            document.getElementById('validated').classList.remove("hidden")
          }
        }).catch(function (error) {
          console.log(error);
          self.error = 'une erreur est survenue. Veuillez réessayer.'
        })
      },
      validate: function () {
        self = this
        axios.post('/api/souscription/validate.php', {
          "url_conf": this.url,
          "code_conf": this.$refs.password.value
        }).then(function (response) {
          console.log(response)
          document.getElementById('validate').classList.add("hidden")
          document.getElementById('validated').classList.remove("hidden")
        }).catch(function (error) {
          console.log(error);
          self.error = 'une erreur est survenue. Veuillez réessayer.'
        })
      }
    },
    created() {
      this.getData()
    }
  }
</script>

<style scoped>
  .hidden {
    display: none;
  }
</style>
