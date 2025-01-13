import { createRouter, createWebHistory } from 'vue-router'
import AdminDash from '../views/core/AdminDash.vue'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/core/DashboardView.vue'
import ListProductsCategory from '@/views/core/inventory/products-category/ListProductsCategory.vue'
import BillingMain from '@/views/core/billing/BillingMain.vue'
import ListPlans from '@/views/core/billing/plans/ListPlans.vue'

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
