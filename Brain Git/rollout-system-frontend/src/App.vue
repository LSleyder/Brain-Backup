<template>
<div class="container">
  <head>
    <!-- <link
      type="text/css"
      rel="stylesheet"
      href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css"
    /> -->
  </head>
  <header class="theme-light header">
    <router-link to="/home" v-if="isAuthenticated">
      <!-- <img class="logo" src="https://logodownload.org/wp-content/uploads/2017/08/algar-logo.png"> -->
      <h5><strong>ROLLOUT</strong>SYSTEM</h5>
    </router-link>

    <router-link to="/login" v-else>
      <!-- <img class="logo" src="https://logodownload.org/wp-content/uploads/2017/08/algar-logo.png"> -->
      <h5>
        <strong>ROLLOUT</strong>SYSTEM
      </h5>
    </router-link>

    <!-- <a href="/home">
        <h5><strong>ROLLOUT</strong>SYSTEM</h5>
    </a>-->
    <div v-show="!isAuthenticated">
      <button class="theme-gray" @click="$router.push('/login')">Login</button>
      <button class="theme-teal" @click="$router.push('/signup')">Signup</button>
      <button class="theme-green" v-on:click="$router.push('/verifyToken/teste')" v-show="!isAuthenticated">Token Verify</button>
    </div>
    <div v-show="isAuthenticated">
      <button class="theme-blue user" v-show="!show" @click="show = true, checkUser()">{{user}}</button>
      <div class="card-options" v-if="show">
        <i class="material-icons icon-button" v-bind:style="{float: 'right'}" @click="show=false">close</i>
        <button class="theme-green" v-show="isAdmin" @click="$router.push('/adminPage')">Admin Page</button>
        <h6 class="user">{{username}}</h6>
        <button class="theme-red" v-on:click="logout">Logout</button>
      </div>
    </div>
  </header>

  <main>
    <b-alert :show="showMessagePrimary" variant="primary" dismissible @dismissed="showMessagePrimary=false">{{ displayMessage }}</b-alert>
    <b-alert :show="showMessageSuccess" variant="success" dismissible @dismissed="showMessageSuccess=false">{{ displayMessage }}</b-alert>
    <b-alert :show="showMessageDanger" variant="danger" dismissible @dismissed="showMessageDanger=false">{{ displayMessage }}</b-alert>
    <b-alert :show="showMessageWarning" variant="warning" dismissible @dismissed="showMessageWarning=false">{{ displayMessage }}</b-alert>
    <i class="material-icons icon-button" style="font-size: 20px;" @click="$router.go(-1)" v-if="isAuthenticated">arrow_back</i>
    <router-view @Message="receiveMessageError">

    </router-view>
  </main>

  <footer class="theme-dark">
    <p>&copy; 2019 - 2020 Algar Telecom</p>
  </footer>
</div>
</template>

<script>
import Login from "./components/Login.vue";
import SignUp from "./components/SignUp.vue";
import Home from "./components/Home.vue";
import Sites from "./components/Sites.vue";
import Atividade from "./components/Atividade.vue";
import VerifyToken from "./components/VerifyToken.vue";
import AdminPage from "./components/AdminPage.vue";

import axios from "axios";
import jwt from "jwt-simple";
const key = "key";
const baseUrl = "http://localhost:3000/";

export default {
  name: "App",
  components: {
    Login,
    SignUp,
    Home,
    Sites,
    Atividade,
    VerifyToken,
  },
  data: function() {
    return {
      isAuthenticated: false,
      user: "",
      username: "",
      show: false,
      isAdmin: false,
      displayMessage: "",
      showMessagePrimary: false,
      showMessageSuccess: false,
      showMessageDanger: false,
      showMessageWarning: false,
    };
  },
  beforeUpdate() {
    this.checkLogin();
  },
  mounted() {
    this.checkLogin();
    // this.checkUser();
  },
  methods: {
    checkLogin: function() {
      const thisInside = this;
      var currentPath = window.location.pathname.toLowerCase();

      if (localStorage.loggedin) {
        //usuario fez login sem manter-se conectado
        if (
          currentPath == "/" ||
          currentPath == "/login" ||
          currentPath == "/signup"
        ) {
          // window.location.href = '/home';
          thisInside.$router.push("/home");
        } else {
        }
        this.isAuthenticated = true;
        this.user = localStorage.user.charAt(0);
        this.username = localStorage.user;
      } else if (localStorage.userData) {
        let token = localStorage.userData;
        let userDataDecoded = jwt.decode(token, key);
        let dataToken = userDataDecoded.expire;

        if (dataToken < Date.now()) {
          this.isAuthenticated = false;
          if (currentPath == "/login" || currentPath == "/signup") {
          } else {
            this.logout();
          }
        } else if (
          currentPath == "/" ||
          currentPath == "/login" ||
          currentPath == "/signup"
        ) {
          // window.location.href = '/home';
          thisInside.$router.push("/home");
        } else if (currentPath == "/home") {
        }
        this.isAuthenticated = true;
        this.user = localStorage.user.charAt(0);
        this.username = localStorage.user;
      } else if (currentPath.includes("/verifytoken")) {
      } else if (
        localStorage.loggedin == null &&
        localStorage.userData == null
      ) {
        if (
          currentPath != "/login" &&
          currentPath != "/signup" &&
          currentPath != "/verifytoken"
        ) {
          // window.location.href = '/login';
          thisInside.$router.push("/login");
        }
      }
    },
    logout: function() {
      const thisInside = this;
      if (localStorage.userData) {
        let token = localStorage.userData;
        let userDataDecoded = jwt.decode(token, key);
        axios
          .post(baseUrl + "usuario/logout", {
            Matricula: userDataDecoded.matriculaToken
          })
          .then(function(response) {
            if (!response.data.loggedin) {
              localStorage.clear();
              thisInside.$router.push("/login");
              window.location.reload();
              // window.location.href = "/login";
            }
          });
      } else {
        axios
          .post(baseUrl + "usuario/logout", {
            Matricula: localStorage.username
          })
          .then(function(response) {
            if (!response.data.loggedin) {
              localStorage.clear();
              thisInside.$router.push("/login");
              window.location.reload();
              // window.location.href = "/login";
            }
          });
      }
    },
    checkUser() {
      let thisInside = this;
      axios
        .post(baseUrl + "usuario/checkUserType", {
          Matricula: localStorage.username
        })
        .then(function(response) {
          if (response.data == "admin") {
            thisInside.isAdmin = true;
          }
        });
    },
    receiveMessageError(value, styleType){
      //Tipos de mensagem:
      // 0 => primary
      // 1 => success
      // 2 => danger
      // 3 => warning
      this.displayMessage = value
      let thisInside = this;
      if(styleType == 0){
        this.showMessagePrimary = true;
        setTimeout(function(){ 
          thisInside.showMessagePrimary=false;
        }, 5000);
      }else if(styleType == 1){
        this.showMessageSuccess = true;
        setTimeout(function(){ 
          thisInside.showMessageSuccess=false;
        }, 5000);
      }else if(styleType == 2){
        this.showMessageDanger = true;
        setTimeout(function(){ 
          thisInside.showMessageDanger=false;
        }, 5000);
      }else if(styleType == 3){
        this.showMessageWarning = true;
        setTimeout(function(){ 
          thisInside.showMessageWarning=false;
        }, 5000);
      }
    }
  }
};
</script>

<style>
/* Importing Aperial Design css library */
@import "/aperial.css";
.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}
main {
  flex-grow: 1;
}
main .cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
main .cards .card {
  flex: 0 0 15vw;
}
header,
main,
footer {
  flex-shrink: 0;
  justify-content: space-between;
}
.header{
  height: 6vh;
  min-height: 34px;
  /* width: 200px; */
}
/* this will be used to blur the background of some components */
.blur-div {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.64);
  backdrop-filter: blur(2px);
  z-index: 1;
}
/* this will be used in other components as a creation window */
.creation-window {
  position: fixed;
  top: 30vh;
  left: calc(50vw - 120px);
  z-index: 1;
}
.logo {
  /* width: 350px;
    height: 126px; */
  width: 10vw;
  height: auto;
  margin-left: 2vw;
  transition: 0.2s ease;
}
.logo:hover {
  opacity: 0.8;
  transform: scale(1.1);
  /* transform: scale(10); */
}
.options-button:hover + .card-options {
  display: block;
}
.containerPaginate {
  text-align: center;
  position: relative;
  padding: 3vh 0 1vh 0;
}
.paginate {
  display: inline-flex;
  /* border: 3px solid #73AD21; */
}
.activePaginateItem {
  background-color: rgb(33, 150, 243);
  color: white;
  border-radius: 5px;
  box-shadow: 4px 4px grey;
  transition: 0.2s ease;
  /* opacity: .7; */
}
.activePaginateItem:hover {
  opacity: 0.4;
  background-color: red;
  color: black;
}
.otherPaginateItem {
  border: 3px solid rgb(33, 150, 243);
  border-radius: 5px;
  box-shadow: 5px 5px 4px grey;
  margin-right: 10px;
  padding: 0.4vw;
  transition: 0.2s ease;
}
.otherPaginateItem:hover {
  opacity: 0.8;
  background-color: rgba(100, 243, 33, 0.794);
  border-color: rgb(100, 243, 33);
  color: black;
}
.disabledPaginateItem {
  /* background-color: rgb(56, 56, 56); */
  color: black;
  border-radius: 5px;
  box-shadow: 5px 5px 4px grey;
  margin-right: 10px;
  padding: 0.4vw;
  transition: 0.2s ease;
  opacity: 0.7;
}
.disabledPaginateItem:hover {
  background-color: rgba(255, 0, 0, 0.733);
  cursor: not-allowed;
  border-color: rgba(255, 0, 0, 0.3);
}
.user {
  text-transform: capitalize;
  text-align: center;
  font-size: 125%;
}
.theme-red:hover {
  transform: scale(1.1);
}
.card-options {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
  border: none;
  border-radius: 2px;
  outline: none;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: -3px;
  /* margin-left: -50px;  */
  display: flex;
  z-index: 1;
}
.card-options ul li {
  cursor: pointer;
}
.card-options ul li:hover {
  background-color: #f1f1f1;
}
.card-options:hover {
  /* display: block; */
  transform: none;
}
.disabled {
  cursor: not-allowed;
  transition: 0.2s ease;
}
.disabled:hover {
  opacity: 0.75;
  background-color: #f99;
}

.alert {
  position: relative;
  padding: 1.25rem 1.25rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  z-index: 2;
}
.alert-heading {
  color: inherit;
}
.alert-link {
  font-weight: 700;
}
.alert-dismissible {
  padding-right: 4rem;
}
.alert-dismissible .close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem 1.25rem;
  color: inherit;
}
.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}
.alert-primary hr {
  border-top-color: #9fcdff;
}
.alert-primary .alert-link {
  color: #002752;
}
.alert-secondary {
  color: #383d41;
  background-color: #e2e3e5;
  border-color: #d6d8db;
}
.alert-secondary hr {
  border-top-color: #c8cbcf;
}
.alert-secondary .alert-link {
  color: #202326;
}
.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}
.alert-success hr {
  border-top-color: #b1dfbb;
}
.alert-success .alert-link {
  color: #0b2e13;
}
.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}
.alert-info hr {
  border-top-color: #abdde5;
}
.alert-info .alert-link {
  color: #062c33;
}
.alert-warning {
  color: #856404;
  background-color: #fadc7b;
  border-color: #ffeeba;
}
.alert-warning hr {
  border-top-color: #ffe8a1;
}
.alert-warning .alert-link {
  color: #533f03;
}
.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
.alert-danger hr {
  border-top-color: #f1b0b7;
}
.alert-danger .alert-link {
  color: #491217;
}
.alert-light {
  color: #818182;
  background-color: #fefefe;
  border-color: #fdfdfe;
}
.alert-light hr {
  border-top-color: #ececf6;
}
.alert-light .alert-link {
  color: #686868;
}
.alert-dark {
  color: #1b1e21;
  background-color: #d6d8d9;
  border-color: #c6c8ca;
}
.alert-dark hr {
  border-top-color: #b9bbbe;
}
.alert-dark .alert-link {
  color: #040505;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>