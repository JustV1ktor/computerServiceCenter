import { createRouter, createWebHistory } from "vue-router/dist/vue-router"
import App from "@/views/Home";
import Login from './src/views/Login'
import Register from './src/views/Register'
import PriceList from './src/views/PriceList'
import About from './src/views/About'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: App},
        { path: '/Login', component: Login},
        { path: '/Register', component: Register},
        { path: '/PriceList', component: PriceList},
        { path: '/About', component: About}
    ]
})