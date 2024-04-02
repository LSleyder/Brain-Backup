<template>
  <div class="cards" oncontextmenu="return false">
    <div class="login card">
      <h5>Login</h5>
      <div onpaste="return true" onselectstart="return false;">
        <input name="Matricula" type="text" placeholder="Matrícula..." v-model="mat" @keyup.enter="login()" autocomplete="off" required autofocus/>
        <input id="password" name="Senha" type="password" placeholder="Senha..." v-model="password" v-on:keyup.enter="login()" autocomplete="off" required/>
        <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword(0)">remove_red_eye</i>
        <input name="LembrarUsuario" type="checkbox" value="LembrarUsuario" id="remindUser" v-model="remindUser">
        <label for="remindUser">Mantenha-me Conectado</label><br>
        <input class="theme-blue" type="submit" @click="login()" value="Conectar"/>
        <transition :name="computedTransition">
          <div class="errorAlert" v-if="!errorHandling">{{ messageError }}</div>
        </transition>
        <h6 v-if="sendToken" @click="resendToken()"><a>Reenviar token</a></h6>
      </div>
      <h6 v-show="showEsqueci"><a v-on:click="showRedefinirSenha= true">Esqueci minha senha</a></h6>
      <h6>Não tem uma conta? <a v-on:click="$router.push('/signup')">Cadastre-se</a></h6>
    </div>
    <div class="blur-div" v-if="showRedefinirSenha">
      <div class="card creation-window">
        <h5>Redefinir senha</h5>
        <div v-if="!showDivRedefineSenha">
        <input type="text" placeholder="Matricula..." v-model="matriculaRedefine" v-on:keyup.enter="redefinirSenha()" autofocus><br>
        <input type="text" placeholder="Email..." v-model="emailRedefine" v-on:keyup.enter="redefinirSenha()"><br>
        </div>
        <transition :name="computedTransition">
          <div class="errorAlert" id="errorAlert" v-show="!errorHandlingRedefine">{{ messageError }}</div>
        </transition>
        <!-- <input type="password" placeholder="Senha antiga..." v-model="oldPasswordRedefine"><br> -->
        <!-- <input type="password" placeholder="Nova senha..." v-model="newPasswordRedefine"><br> -->
        <!-- <input type="password" placeholder="Confirmar nova senha..." v-model="confirmNewPasswordRedefine"><br> -->
        <!-- <input type="text" placeholder="Status do projeto..." v-model="statusIdRename"><br> -->
        <div v-if="showDivRedefineSenha">
          <input id="password1" type="password" placeholder="Senha enviada..." v-model="senhaEnviada">
          <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword(1)">remove_red_eye</i><br>
          <input id="password2" type="password" placeholder="Nova senha..." v-model="newSenha">
          <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword(2)">remove_red_eye</i><br>
          <input id="password3" type="password" placeholder="Confirmar nova senha..." v-model="confirmNewSenha">
          <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword(3)">remove_red_eye</i><br>
        </div>
        <button v-if="showSendButton" class="theme-blue" v-on:click="redefinirSenha()">Enviar</button>
        <button v-if="!showSendButton" class="theme-blue" v-on:click="redefinirSenhaCheck()">Redefinir</button>
        <button class="theme-red teste" v-on:click="showRedefinirSenha = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import jwt from 'jwt-simple';
  const key = 'key';
  const baseUrl = "http://localhost:3000/";

  export default {
    name: 'Login',
    data: () => {
      return {
        mat: '',
        password: '',
        errorHandling: true, 
        errorHandlingRedefine: true, 
        transitionError: true,
        messageError: '',
        remindUser: false,
        sendToken: false,
        showRedefinirSenha: false,
        matriculaRedefine: '',
        emailRedefine: '',
        senhaEnviada: '',
        newSenha: '',
        confirmNewSenha: '',
        showDivRedefineSenha: false,
        showSendButton: true,
        showEsqueci: false,
        // oldPasswordRedefine: '',
        // newPasswordRedefine: '',
        // confirmNewPasswordRedefine: '',
      }
    },
    mounted() {
      // console.log(localStorage.userData)
      if(localStorage.userData){
        let token = localStorage.userData;
        let userDataDecoded = jwt.decode(token, key);
        // if(Date(userDataDecoded.expire) < Date.now()){
        if (userDataDecoded.expire > Date.now()) {          // Se data do token for maior que a data atual, token ainda e valido
            // this.mat = userDataDecoded.matriculaToken;
            // this.password = userDataDecoded.senhaToken;
            // this.login();
        } else {
          localStorage.clear();
          this.loggedin = false;
          this.messageError = "Login expirado. Conecte novamente.";
          this.errorHandling = false;
        }
      }
    },
    computed: {
      computedTransition () {
        return this.transitionError && 'fade'
      },
      
    },
    watch:{
      mat: function checkMatricula(){
        if(this.mat != ''){
          return this.showEsqueci = true;
        }else{
          return this.showEsqueci = false;
        }
      }
    },
    methods: {
      login() {
        let thisInside = this;          // Usar "this" logo apos a declaracao da funcao
        if(!this.mat){
          this.messageError = "O campo Matrícula precisa ser preenchido";
          thisInside.errorHandling = false;
          thisInside.sendToken = false;
        }else if(!this.password){
          this.messageError = "O campo Senha precisa ser preenchido";
          thisInside.errorHandling = false;
          thisInside.sendToken = false;
        }else{
          axios.post(baseUrl + 'usuario/login/', {Matricula: this.mat, Senha: this.password})
          .then(function(response){
            if(response.data.authorizedLogin){
              thisInside.errorHandling = true;
              thisInside.sendToken = false;
              // console.log("loginResponse:" + response.data.authorizedLogin);
              if(thisInside.remindUser){
                var expireDate = (new Date().getTime()) + (60000 * 60 * 24 * 7);                // Token configurado para expirar em 1 semana
                // var expireDate = (new Date().getTime()) + (60000 * 1 / 2 / 2);                  // Token configurado para expirar em 15 segundos
                const loginToken = jwt.encode({
                  matriculaToken: thisInside.mat,
                  senhaToken: thisInside.password,
                  // expire: Date(Date(Date.now()) + (60 * 60 * 1000 * 24 * 7))                // Token configurado para expirar em 1 semana
                  expire: expireDate
                }, key);
                localStorage.userData = loginToken;
                localStorage.username = thisInside.mat;
                localStorage.user = response.data.user;
                localStorage.userType = response.data.userType;
              }else{
                localStorage.loggedin = true;
                thisInside.sendToken = false;
                localStorage.username = thisInside.mat;
                localStorage.user = response.data.user;
                localStorage.userType = response.data.userType;
              }
              thisInside.$router.push('/home')
              // window.location.href = "/home";
            }else{
              // console.log("loginResponse: " + response.data.authorizedLogin);
              if(response.data.loginError != null){
                if(response.data.loginError == "Conta não verificada"){
                  thisInside.messageError = response.data.loginError;  
                  thisInside.errorHandling = false;
                  thisInside.sendToken = true;
                }else{
                  thisInside.errorHandling = false;
                  thisInside.messageError = response.data.loginError;  
                  thisInside.sendToken = false;
                }
              }else{
                thisInside.errorHandling = false;
                thisInside.sendToken = false;
                thisInside.messageError = "Usuário ou senha incorretos";
              }
            }
          })
        }
      },
      showPassword(indexPassword){
        if(indexPassword == 0){
          var val = document.getElementById("password");
          if(val.type === "password"){
            val.type = "text";
            return false;
          }else{
            val.type = "password";
            return true;
          }
        }else if(indexPassword == 1){
          var val = document.getElementById("password1");
          if(val.type === "password"){
            val.type = "text";
            return false;
          }else{
            val.type = "password";
            return true;
          }
        }else if(indexPassword == 2){
          var val = document.getElementById("password2");
          if(val.type === "password"){
            val.type = "text";
            return false;
          }else{
            val.type = "password";
            return true;
          }          
        }else if(indexPassword == 3){
          var val = document.getElementById("password3");
          if(val.type === "password"){
            val.type = "text";
            return false;
          }else{
            val.type = "password";
            return true;
          }          
        }
      },
      resendToken(){
        // console.log(this.mat)
        // console.log(this.password)
        let thisInside = this;
        axios.post(baseUrl + 'usuario/sendTokenAgain', {Matricula: this.mat, Senha: this.password})
        .then(function(response){
          console.log(response.data)
          thisInside.messageError = "Email enviado";  
          thisInside.errorHandling = false;
          console.log(response);
        })
      },
      redefinirSenha(){
        let thisInside = this;
        axios.post(baseUrl + 'usuario/redefinirSenha', {Matricula: this.matriculaRedefine, Email: this.emailRedefine})
        .then(function(response){
          if(response.data.emailEnviado){
            setTimeout(function(){
              thisInside.messageError = '';
              document.getElementById("errorAlert").style.backgroundColor = "#f99"
              thisInside.errorHandlingRedefine = true;
            }, 5000);
            thisInside.messageError = 'Mensagem enviada. Verifique seu email.';
            document.getElementById("errorAlert").style.backgroundColor = "#99ff9e"
            thisInside.showDivRedefineSenha = true;
            thisInside.showSendButton = false;
          }else if(!response.data.usuarioEncontrado){
            thisInside.messageError = 'Usuario não encontrado';
          }else if(!response.data.emailEncontrado){
            thisInside.messageError = 'Email não encontrado';
          }
          thisInside.errorHandlingRedefine = false;
          // console.log(response.data)
          // console.log(thisInside.messageError)
          localStorage.username = thisInside.matriculaRedefine;
        })
      },
      redefinirSenhaCheck(){
        let thisInside = this;
        let matricula = localStorage.username;
        console.log(matricula)
        axios.post(baseUrl + 'usuario/redefinirSenhaConfirm', {Matricula: matricula, SenhaEnviada: this.senhaEnviada, NewSenha: this.newSenha, ConfirmNewSenha: this.confirmNewSenha})
        .then(function(response){
          if(response.data.redefineSenha){
            thisInside.showRedefinirSenha = false;
            thisInside.showDivRedefineSenha = false;
          }else{
            document.getElementById("errorAlert").style.backgroundColor = "#f99"
            thisInside.messageError = response.data.errorType;
          }
          // console.log(response)
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h6 {
    font-size: 14px;
  }
  a {
    color: rgb(33, 150, 243);
    font-weight: 600;
  }
  .fade-enter-active, .fade-leave-active {
    transition: .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .errorAlert {
    background-color: #f99;
    padding: 10px;
    border-radius: 4px;
  }
  .login{
    min-width: 240px;
    max-width: 270px;
  }
</style>
