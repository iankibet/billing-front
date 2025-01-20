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
import AvailablePlansList from '@/views/core/clients-billing/AvailablePlansList.vue'
import PaymentMethodsList from '@/views/core/billing/paymentMethods/PaymentMethodsList.vue'
import BillsMain from '@/views/core/billing/bills/BillsMain.vue'
import BillsList from '@/views/core/billing/bills/tabs/BillsList.vue'
import BillCheckout from '@/views/core/clients-billing/BillCheckout.vue'
import PlanBillsList from '@/views/core/clients-billing/plan/tabs/PlanBillsList.vue'
import PlanMain from '@/views/core/clients-billing/plan/PlanMain.vue'
import UserPlan from '@/views/core/clients-billing/plan/tabs/UserPlan.vue'
import PaymentDetails from '@/views/core/clients-billing/plan/tabs/PaymentDetails.vue'

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
          component: BillsMain,
          children: [
            {
              path:'tab/:status',
              component: BillsList
            }
          ]
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
      path:'/available-plans',
      component: AvailablePlansList
    },
    {
      path:'/my-plan',
      component: PlanMain,
      children: [
        {
          path: 'tab/plan',
          component: UserPlan
        },
        {
          path: 'tab/bills',
          component: PlanBillsList
        },
        {
          path:'tab/payment_details',
          component: PaymentDetails
        }

      ]
    },
    {
      path:'/checkout/:id',
      component: BillCheckout
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
