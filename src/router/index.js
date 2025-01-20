import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/core/DashboardView.vue'
import BillingMain from '@/views/core/billing/BillingMain.vue'
import PlansList from '@/views/core/billing/plans/PlansList.vue'
import BillingFeaturesList from '@/views/core/billing/plans/features/tabs/BillingFeaturesList.vue'
import PlanView from '@/views/core/billing/plans/plan/PlanView.vue'
import PlanFeaturesList from '@/views/core/billing/plans/plan/tabs/PlanFeaturesList.vue'
import PlanOverview from '@/views/core/billing/plans/plan/tabs/PlanOverview.vue'
import FeaturesList from '@/views/core/billing/plans/features/FeaturesList.vue'
import ClientPlansList from '@/views/core/clients-billing/ClientPlansList.vue'
import PaymentMethodsList from '@/views/core/billing/paymentMethods/PaymentMethodsList.vue'
import BillsMain from '@/views/core/billing/bills/BillsMain.vue'

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
          path:'bills',
          component: BillsMain
        },
        {
          path:'plans',
          component: PlansList,
        },
        {
          path:'features',
          component: FeaturesList
        },
        {
          path:'payment-methods',
          component: PaymentMethodsList
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
      path:'/clients-billing',
      component: ClientPlansList
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
