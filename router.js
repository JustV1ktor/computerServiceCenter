import { createRouter, createWebHistory } from "vue-router/dist/vue-router"
import App from "@/views/Home"
import Login from '@/views/Login'
import Register from '@/views/Register'
import PriceList from '@/views/PriceList'
import About from '@//views/About'
import History from "@/views/History"
import PersonalOffice from "@/views/PersonalOffice"
import Editor from '@/views/Editor'
import error from '@/views/PageNotFound'

import Notification from "@/components/NotificationHandler"

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
        { path: '/PersonalOffice', component: PersonalOffice},
        { path: '/Editor', component: Editor},
        { path: '/:catchAll(.*)', component: error}
    ]
})