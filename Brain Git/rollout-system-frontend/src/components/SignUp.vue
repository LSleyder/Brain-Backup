<template>
  <div class="cards" oncontextmenu="return false">
    <div class="signUp card">
      <h5>Cadastrar-se</h5>
      <div onpaste="return false" onselectstart="return false;">
        <input name="Nome" type="text" placeholder="Nome..." autocomplete="off" v-model="nome" required/>
        <input name="Email" type="text" placeholder="Email..." autocomplete="off" v-model="email" />
        <select class="selectBox" name="selectDomain" v-model="selectBox" required>
          <option value="" disabled>Tipo de email</option>
          <option name="emailInstitucional" value="algarMail">@algartelecom.com.br</option>
          <option name="outro" value="other">Outro</option>
        </select>
        <input name="Matricula" type="text" placeholder="Matrícula..." autocomplete="off" v-model="matricula" required/>
        <input id="password1" name="Senha" type="password" placeholder="Senha..." autocomplete="off" v-model="senha" required/>
        <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword1()">remove_red_eye</i>
        <input id="password2" name="ConfirmarSenha" type="password" placeholder="Confirmar senha..." autocomplete="off" v-model="confirmarSenha" required/>
        <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword2()">remove_red_eye</i>
        <input class="theme-blue" type="submit" @click="signup()" value="Cadastrar" :disabled="submitButton"/>
        <transition :name="computedTransitionError">
          <div class="errorAlert" v-if="!errorHandling">{{ messageError }}</div>
        </transition>
        <transition :name="computedTransitionAcepted">
          <div class="aceptedAlert" v-if="aceptedHandling">{{ messageAcepted }}</div>
        </transition>
      </div>
      <h6>Já tem uma conta? <a v-on:click="$router.push('/login')">Conecte-se</a></h6>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'SignUp',
    data: () => {
      return {
        nome: '',
        email: '',
        matricula: '',
        senha: '',
        confirmarSenha: '',
        selectBox: '',
        submitButton: false,
        errorHandling: true, 
        transitionError: true,
        messageError: '',
        aceptedHandling: false,
        transitionAcepted: true,
        messageAcepted: ''
      }
    },
    computed: {
      computedTransitionError () {
        return this.transitionError && 'fade'
      },
      computedTransitionAcepted () {
        return this.transitionAcepted && 'fade'
      }
    },
    methods: {
      signup(){
        this.submitButton = true;    
        let thisInside = this;
        var fields = [];
        var qtdFieldsNull = 0;
        fields.push(this.nome);
        fields.push(this.email);
        fields.push(this.matricula);
        fields.push(this.senha);
        fields.push(this.confirmarSenha);
        fields.push(this.selectBox);
        for(var i = 0; i < fields.length; i++){
          if(!fields[i]){
            qtdFieldsNull++;
          }
        }
        if(qtdFieldsNull != 0){
          // this.messageError = "Preencha todos os campos";
          for(var i = 0; i < qtdFieldsNull; i++){
            if(!this.nome){
              this.messageError = "O campo NOME precisa ser preenchido";
            }else if(!this.email){
              this.messageError = "O campo EMAIL precisa ser preenchido";
            }else if(!this.matricula){
              this.messageError = "O campo MATRÍCULA precisa ser preenchido";
            }else if(!this.senha){
              this.messageError = "O campo SENHA precisa ser preenchido";
            }else if(!this.confirmarSenha){
              this.messageError = "O campo CONFIRMAR SENHA precisa ser preenchido";
            }else if(!this.selectBox){
              this.messageError = "O campo TIPO DE EMAIL precisa ser preenchido";
            }
          }
          thisInside.errorHandling = false;
          thisInside.aceptedHandling = false;
        }else{
          // console.log(this.selectBox)
          if(this.selectBox == 'algarMail'){
            alert('Conta não pode ser criada.\nContacte o administrador do sistema para mais informações.')
          }else {
            axios.post("http://localhost:3000/usuario/create", {Nome: this.nome, Matricula: this.matricula, Email: this.email, Senha: this.senha, ConfirmarSenha: this.confirmarSenha, selectDomain: this.selectBox})
            .then(function(response){
              // console.log(response)
              if(response.data.emailEnviado){
                thisInside.aceptedHandling = true;
                thisInside.errorHandling = true;
                thisInside.messageAcepted = "Email para verificação enviado. Verifique sua caixa de entrada";
              }else if(response.data.senhasDiferentes){
                thisInside.errorHandling = false;
                thisInside.aceptedHandling = false;
                thisInside.messageError = "As senhas sao diferentes";
              }else if(response.data.usuarioExistente){
                thisInside.errorHandling = false;
                thisInside.aceptedHandling = false;
                thisInside.messageError = "Já existe cadastro com essa matrícula"
              }else if(response.data.nullField){
                thisInside.messageError = "Preencha todos os campos";
                thisInside.errorHandling = false;
                thisInside.aceptedHandling = false;
              }else if(response.data.emailInvalido){
                thisInside.errorHandling = false;
                thisInside.aceptedHandling = false;
                thisInside.messageError = "Email inválido";
              }else{  //email nao enviado
                thisInside.errorHandling = false;
                thisInside.aceptedHandling = false;
                thisInside.messageError = "Email não enviado"
              }
            })
          }
        }
        this.submitButton = false;
      },
      showPassword1(){
        var val = document.getElementById("password1");
        if(val.type === "password"){
          val.type = "text";
          return false;
        }else{
          val.type = "password";
          return true;
        }
      },
      showPassword2(){
        var val = document.getElementById("password2");
        if(val.type === "password"){
          val.type = "text";
          return false;
        }else{
          val.type = "password";
          return true;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  select {
    margin: 8px;
  }
  h6 {
    font-size: 14px;
  }
  a {
    color: rgb(33, 150, 243);
    font-weight: 600;
  }
  .errorAlert {
    border-radius: 4px;
    background-color: #f99;
    padding: 10px;
  }
  .aceptedAlert {
    border-radius: 4px;
    background-color: #99ff9e;
    padding: 10px;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: .3s;
  }
  .signUp{
    min-width: 240px;
    max-width: 270px;
  }
</style>