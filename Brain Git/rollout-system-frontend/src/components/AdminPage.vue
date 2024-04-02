<template>
    <div>
        <div class="cards">
            <div class="card" v-if="login">
                <h6>Para continuar, confirme sua senha</h6>
                <div onpaste="return true" onselectstart="return false;">
                    <input style="margin-left: 8px;" id="password" name="Senha" type="password" placeholder="Senha..." v-model="password" v-on:keyup.enter="checkLogin()" autocomplete="off" required autofocus/>
                    <!-- <i class="material-icons icon-button" style="font-size: 18px" @click="showPassword(0)">remove_red_eye</i> -->
                    <transition :name="computedTransition">
                        <div class="errorAlert" v-if="!errorHandling">{{ messageError }}</div>
                    </transition>
                    <input class="theme-blue" type="submit" @click="checkLogin()" value="Conectar"/>
                </div>
            </div>
        </div>
        <div class="cards">
            <div class="cards1" v-if="!login">
                <a>Usuários a serem verificados</a><br>
                <input class="theme-blue" type="submit" @click="hasData=false" v-if="hasData" value="Ocultar"/>
                <input class="theme-blue" type="submit" @click="user(), hasData=true" v-if="!hasData" value="Mostrar"/>
                <div v-if="hasData">
                    <div class="card" v-for="(item, index) in items" :key="index">
                        <p class="nonLink" style="text-transform: capitalize">
                            {{ item.id }} - {{ item.Nome }} - {{ item.isVerified }}
                        </p>
                        <button class="theme-green" @click="verifyAccount(item.id, 1)">Aceitar</button>
                        <button class="theme-red" @click="verifyAccount(item.id, 0)">Recusar</button>
                    </div>
                </div>
            </div>      
            <div class="cards1" v-if="!login">
                <a>Todos usuários</a><br>
                <input class="theme-blue" type="submit" @click="hasData1=false" v-if="hasData1" value="Ocultar"/>
                <input class="theme-blue" type="submit" @click="getUsers(), hasData1=true" v-if="!hasData1" value="Mostrar"/>
                <div v-if="hasData1">
                    <div class="card" v-for="(item, index) in items1" :key="index">
                        <p class="nonLink" style="text-transform: capitalize">
                            {{ item.id }} - {{ item.Nome }} - {{ item.Matricula }} - {{ item.userType }}
                        </p>
                        <button class="theme-green" @click="updateUserType(item.id, 0, item.Matricula)" :disabled="item.userType=='admin'">Tornar Admin</button>
                        <button class="theme-red" @click="updateUserType(item.id, 1, item.Matricula)" :disabled="item.userType=='default'">Tornar Default</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    const baseUrl = "http://localhost:3000/";
    export default {
        data: () => {
            return{
                mat: '',
                password: '',
                token: '',
                items: '',
                items1: '',
                errorHandling: true, 
                transitionError: true,
                messageError: '',
                hasData: false,
                hasData1: false,
                login: true,
            }
        },
        created(){
            let authToken = this.$route.query.authToken
            // this.$router.replace(" ")
            // console.log(authToken)
            if(authToken == undefined){
                
            }else{
                this.token = authToken;
                this.check();
            }
            this.mat = localStorage.username;
        },
        computed: {
        computedTransition () {
                return this.transitionError && 'fade'
            }
        },
        methods: {
            check(){
                let thisInside = this;
                axios.post(baseUrl + 'usuario/verifyToken', {Token: this.token})
                .then(function(response){
                    if(response.data.contaVerificada){
                        window.location.href = "/login";
                    }else{
                        thisInside.messageError = response.data.authError;
                        thisInside.errorHandling = false;
                        thisInside.sendToken = false;
                        // console.log(response.data.authError);
                    }
                })
            },
            user(){
                let thisInside = this;
                axios.get(baseUrl + 'usuarioNotVerified')
                .then(function(response){
                    thisInside.items = response.data;
                })
            },
            checkLogin(){
                let thisInside = this;
                axios.post(baseUrl + 'usuario/checkLogin', {Matricula: this.mat, Senha: this.password})
                .then(function(response){
                    if(response.data.authorizedLogin){
                        thisInside.login = false;
                    }else{
                        thisInside.messageError = response.data.authError;
                        thisInside.errorHandling = false;
                        thisInside.sendToken = false;
                    }
                })
            },
            verifyAccount(idUser, statusVerify){
                let thisInside = this;
                axios.put(baseUrl + 'usuario/verifyByAdmin', {id: idUser, chooseStatusVerify: statusVerify})
                .then(function(response){
                    thisInside.user();
                })
            },
            getUsers(){
                let thisInside = this;
                axios.get(baseUrl + 'usuario')
                .then(function(response){
                    thisInside.items1 = response.data;
                })
            },
            updateUserType(userId, userType, userToBeChanged){
                let thisInside = this;
                axios.post(baseUrl + 'usuario/updateUserType', {id: userId, userType: userType, currentUserId: localStorage.username, userToBeChanged: userToBeChanged})
                .then(function(response){
                    if(response.data.userUpdated){
                        thisInside.emitMessage(response.data.result, 1);
                    }else{
                        thisInside.emitMessage(response.data.result, 2);
                    }
                    thisInside.getUsers();
                })
            },
            emitMessage(message, type){
                //Tipos de mensagem:
                // 0 => primary
                // 1 => success
                // 2 => danger
                // 3 => warning
                if(!type){
                type = 0;
                }
                this.$emit('Message', message, type);
            }
        }
    }
</script>

<style scoped>
    .inputTextLong{
        width: 40vw;
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
    .cardVerify{
        padding: 8px;
        margin: 8px;
        color: #444;
        background-color: #FFF;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
        border-radius: 2px;
        /* height: 30vh; */
        /* width: 50vw; */
        text-align: left;
        transition: transform .25s;
    }
    .cardsVerify{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .title{
        margin-left: 2vw;
    }
    h6 {
        font-size: 14px;
    }
    a{
        font-size: 18px;
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
    h6{
        font-size: 1.50em;
    }
    .theme-green:hover{
        transform: scale(1.1);
    }
    .cards1{
        width: 40vw;
        padding: 8px;
        margin: 8px;
        color: #444;
        background-color: rgb(177, 204, 255);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
        border-radius: 2px;

        text-align: center;
        transition: transform .25s;
        /* flex: 0 0 23vw; */
        min-width: 250px;
    }
    button:disabled{
        opacity: .5;
        cursor: not-allowed;
    }
    button:disabled:hover{
        transform: scale(1);
    }
</style>