<template>
  <div>
    <NavBar></NavBar>
    <div class="container">
      <div id="a_list" class="jumbotron m-4">
        <div class="row d-flex justify-content-between">
          <h3>Responsables</h3>
        </div>
        <hr class="row my-4">
        <div class="row">
          <table class="table table-hover table-borderless">
            <thead>
            <tr>
              <th> Nom / Prénom </th>
              <th> Equipe </th>
              <th> id employé</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="resp in resps" v-bind:key="resp.id">
              <td id="here"> {{getOne(resp.id_emp)}} </td>
              <td>{{resp.id_equipe}}</td>
              <td>{{resp.id_emp}}</td>
            </tr>
            </tbody>
          </table>
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
  name: 'responsable',
  data() {
    return {
      data :[],
      resps: [],
      isAdmin: false,
      name:'',
    }
  },
  methods: {
    getResp: function () {
      var self = this
      axios.get('api/asso_r/read_all.php').then(function (response) {
        console.log('appel getResp')
        self.resps= response.data.records
        //self.getEmployeInfo();
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    getOne: function(idep){
      
      this.getEmployeInfo(idep)
      //console.log(this.getEmployeInfo(idep)+" C la fonction")
      console.log(name+"ICI")
      if(true){ return name }
      
    },
    getEmployeInfo: function (id) {
      var self = this
      console.log('appel getEmploye')
      //for (let resp in self.data.resps) {
        console.log(JSON.parse(id))
        try {
          axios.get('api/employe/read_one.php?id=' + JSON.parse(id))
          //console.log('axios employe')
            .then(function (response) {
              //console.log('then')
              
              self.data = response.data
              var infoemploye = self.data.nom + ' '+ self.data.prenom
              //document.getElementById("here").innerHTML += (infoemploye.substring()+"</br>")
              
              
              name= infoemploye.substring()
              console.log(name+" nom defini")
              //console.log(typeof(infoemploye))
              //return infoemploye.substring();

            })
            .catch(function (error) {
              console.log(error)
            })
        } catch(error){
          console.log(error)
        }
        
    }
  },


  created() {
    this.getResp();
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
  color: #000000;
}
</style>
