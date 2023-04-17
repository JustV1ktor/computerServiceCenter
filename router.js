import { createRouter, createWebHistory } from "vue-router/dist/vue-router"
import App from "@/views/Home";
import Login from './src/views/Login'
import Register from './src/views/Register'
import PriceList from './src/views/PriceList'
import About from './src/views/About'
import History from "@/views/History";
import Notification from "./src/components/NotificationHandler"
import personalOffice from "@/views/personalOffice";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: App},
        { path: '/Login', component: Login},
        { path: '/Register', component: Register},
        { path: '/PriceList', component: PriceList},
        { path: '/About', component: About},
        { path: '/History', component: History},
        { path: '/Notification', component: Notification},
        { path: '/personalOffice', component: personalOffice}
    ]
})