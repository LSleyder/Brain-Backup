import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import Home from '@/components/Home.vue'
import Sites from '@/components/Sites.vue'
import Atividade from '@/components/Atividade.vue'
import VerifyToken from '@/components/VerifyToken.vue'
import AdminPage from '@/components/AdminPage.vue'
import Paginate from 'vuejs-paginate'
import { AlertPlugin } from 'bootstrap-vue'
import { ToastPlugin } from 'bootstrap-vue'

Vue.component('paginate', Paginate)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(Router)
Vue.config.devtools = false;        //Desativando mensagem de devTools no console do client

export default new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'SignUp', component: SignUp },
    { path: '/home', name: 'Home', component: Home },
    { path: '/sites/:id', name: 'Sites', component: Sites },
    { path: '/sites/atividade/:id', name: 'Atividade', component: Atividade },
    { path: '/verifyToken/:id', name: 'VerifyToken', component: VerifyToken },
    { path: '/adminPage', name: 'AdminPage', component: AdminPage},
    { path: '/', redirect: '/login' },
    // { path: '/verifyToken', redirect: '/verifyToken/q?=teste'},
  ],
})