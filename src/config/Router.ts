import {createRouter, createWebHistory} from "vue-router";

import Home from "../views/home/Home.vue";
import Entries from "../views/entries/Entries.vue";
import Limits from "../views/limits/Limits.vue";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Home,
            name: 'Home'
        },
        {
            path: '/entries',
            component: Entries,
            name: 'Entries'
        },
        {
            path: '/limits',
            component: Limits,
            name: 'Limits'
        },
    ]

})