// import './assets/custom-bootstrap.scss';

import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@iankibetsh/shframework/dist/dist/library.mjs.css'
import {streamline} from '@iankibetsh/vue-streamline'
import './assets/custom.css'
import './assets/mobile.css'
import './assets/dark-mode.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ShFrontend } from '@iankibetsh/shframework'

import App from './App.vue'
import router from './router'
import AddPlanFeatures from '@/views/core/billing/plans/plan/AddPlanFeatures.vue'

const app = createApp(App)
app.use(createPinia())

const shFormElementClasses = {
  formGroup: 'mb-2',
  formLabel: 'form-label',
  helperText: 'form-text',
  actionBtn: 'btn btn-primary',
  formErrorTitle: 'alert alert-danger',
  invalidFeedback: 'invalid-feedback',
  formControl: 'form-control'
}

const shFormComponents = {
  // text: SampleComponent,
  // phone: SampleComponent,
  // email: SampleComponent,
  // textArea: SampleComponent,
  // number: SampleComponent,
  // password: PasswordInput.vue,
}
app.use(ShFrontend, {
  sessionTimeout: 400,
  defaultRange: 'All Time',
  loginUrl: '/sh-auth',
  redirectLogin: '/dashboard',
  logoutApiEndpoint: 'auth/logout',
  router: router,
  registerTitle: 'Welcome, create a new account',
  registerSubTitle: '',
  tablePaginationStyle: 'table', //loadMore,table
  tablePerPage: 30,
  shFormElementClasses,
  toastTimer: 5000,
  shFormComponents,

})


app.use(router)
app.use(streamline, {
  streamlineHeaders: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  },
  streamlineUrl: import.meta.env.VITE_APP_API_URL + 'streamline'
})

app.component('AddPlanFeatures',AddPlanFeatures)
app.mount('#app')
