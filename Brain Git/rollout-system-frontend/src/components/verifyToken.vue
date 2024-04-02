<template>
    <div class="cardsVerify">
        <div class="cardVerify" onpaste="return true" onselectstart="return true;">
            <h6><a class="nonLink">Token:</a></h6>
            <input class="inputTextLong" name="Matricula" type="text" placeholder="Token..." v-model="token" autocomplete="off" required autofocus/>
            <input class="theme-blue" type="submit" @click="check()" value="Verificar"/><br>
            <transition :name="computedTransition">
                <div class="errorAlert" v-if="!errorHandling">{{ messageError }}</div>
            </transition>
            <input class="theme-blue" type="submit" @click="hasData=false" v-if="hasData" value="Get Users"/>
            <input class="theme-blue" type="submit" @click="user(), hasData=true" v-if="!hasData" value="Get Users"/>
        </div>
        <div class="cardVerify" v-if="hasData">
            <h6 class="title"><a class="nonLink">Users:</a></h6>
            <h6 class="title"><a class="nonLink">Index - Nome - Matricula - isVerified - loggedin - QtdUsers: {{ items.length }}</a></h6>
            <div class="cards">
                <div class="card" v-for="(item, index) in items" :key="index">
                    <a class="nonLink">
                        {{ index }} - {{ item.Nome }} - {{ item.Matricula }} - {{ item.isVerified }} - {{ item.loggedin }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data: () => {
            return{
                token: '',
                items: '',
                errorHandling: true, 
                transitionError: true,
                messageError: '',
                hasData: false,
            }
        },
        created(){
            let authToken = this.$route.query.authToken
            this.$router.replace(" ")
            if(authToken == undefined){

            }else{
                this.token = authToken;
            }
            this.check();
        },
        computed: {
        computedTransition () {
                return this.transitionError && 'fade'
            }
        },
        methods: {
            check(){
                let thisInside = this;
                let token = this.token;
                if(!token){
                    thisInside.messageError = "Não existe token";
                    thisInside.errorHandling = false;
                    thisInside.sendToken = false;
                }else{
                    axios.post('http://localhost:3000/usuario/verifyToken', {Token: this.token})
                    .then(function(response){
                        if(response.data.contaVerificada){
                            window.location.href = "/login";
                        }else{
                            thisInside.messageError = response.data.authError;
                            thisInside.errorHandling = false;
                            thisInside.sendToken = false;
                        }
                    })
                }
            },
            user(){
                let thisInside = this;
                axios.get('http://localhost:3000/usuario/')
                .then(function(response){
                    thisInside.items = response.data;
                })
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
</style>