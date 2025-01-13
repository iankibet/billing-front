import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/core/DashboardView.vue'
import BillingMain from '@/views/core/billing/BillingMain.vue'
import ListPlans from '@/views/core/billing/plans/ListPlans.vue'
import BillingFeaturesList from '@/views/core/billing/BillingFeaturesList.vue'
import PlanView from '@/views/core/billing/plans/plan/PlanView.vue'
import PlanFeaturesList from '@/views/core/billing/plans/plan/tabs/PlanFeaturesList.vue'
import PlanOverview from '@/views/core/billing/plans/plan/tabs/PlanOverview.vue'

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
          component: BillingFeaturesList
        },
        {
          path:'plans/plan/:id',
          component:  PlanView,
          children: [
            {
              path:'tab/overview',
              component:  PlanOverview,
            },{
              path:'tab/features',
              component:  PlanFeaturesList,
            }
          ]
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
