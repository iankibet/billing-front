import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/core/DashboardView.vue'
import BillingMain from '@/views/core/billing/BillingMain.vue'
import ListPlans from '@/views/core/billing/plans/ListPlans.vue'
import ListBillingFeatures from '@/views/core/billing/ListBillingFeatures.vue'

let routes = []
routes = routes.concat(
  [
    {
      path: '/',
      component: DashboardView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
    },
    {
      path: '/billing',
      component: BillingMain,
      children:[
        {
          path:'plans',
          component: ListPlans,
        },
        {
          path:'features',
          component: ListBillingFeatures
        }

      ]
    },
    {
      path: '/login',
       component: LoginView
    }

  ]
)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes

})

export default router
