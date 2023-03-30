import { createRouter } from "vue-router/dist/vue-router"
import Home from './views/Home.vue'
import Login from './views/Login'
import Register from './views/Register'
import PriceList from './views/PriceList'
import About from './views/About'

export default createRouter({
    routes: [
        { path: '/', component: Home},
        { path: '/Login', component: Login},
        { path: '/Register', component: Register},
        { path: '/PriceList', component: PriceList},
        { path: '/About', component: About}
    ]
})