import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from "../views/Dashboard";
import Account from "../views/Account";
import Entreprises from "../views/Entreprises";
import Employes from "../views/Employes";
import Produits from "../views/Produits";
import Agences from "../views/Agences";
import Souscriptions from "../views/Souscriptions";
import Sous_Dashboard from "../views/Sous_Dashboard";
import Sous_Choix from "../views/Sous_Choix";
import TypeProduits from "../views/TypeProduits";
import Validation from "../views/Validation";
import Responsable from "../views/Responsable";
//import {component} from '../../node_modules/vue/types/umd';

// Voir modification de router pour employes

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/responsable',
      name: 'responsable',
      component: Responsable
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/entreprises',
      name: 'entreprises',
      component: Entreprises
    },
    {
      path: '/employes',
      name: 'employes',
      component: Employes
    },
    {
      path: '/produits',
      name: 'produits',
      component: Produits
    },
    {
      path: '/typeproduits',
      name: 'typeproduits',
      component: TypeProduits
    },
    {
      path: '/agences',
      name: 'agences',
      component: Agences
    },
    {
      path: '/souscriptions',
      name: 'souscriptions',
      component: Souscriptions
    },
    {
      path: '/sous_dashboard',
      name: 'sous_dashboard',
      component: Sous_Dashboard
    },
    {
      path: '/sous_choix',
      name: 'sous_choix',
      component: Sous_Choix
    },
    {
      path: '/validation/:url',
      name: 'validation',
      component: Validation,
      props: true
    }
  ]
})
