import {createApp} from 'vue'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure your project is capable of handling css files
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {aliases, fa} from "vuetify/iconsets/fa";
import {router} from "./config/Router.ts";


const vuetify = createVuetify({
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
            fa
        }
    },
    components,
    directives,
})

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
