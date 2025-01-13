import AccountsMain from '@/views/core/accounts/AccountsMain.vue'
import AccountView from '@/views/core/accounts/account/AccountView.vue'
import AccountDetails from '@/views/core/accounts/account/tabs/AccountDetails.vue'
import AccountLocation from '@/views/core/accounts/account/tabs/AccountLocation.vue'
import AccountClient from '@/views/core/accounts/account/tabs/AccountClient.vue'
import ListAccounts from '@/views/core/accounts/tabs/ListAccounts.vue'

export default [
  {
    path: "/accounts",
    component: AccountsMain,
    children: [
      {
        path: "tab/:status",
        component: ListAccounts
      }
    ]
  },
  {
    path: "/accounts/view/:id",
    component: AccountView,
    children: [
        {
          path: "tab/details",
          component: AccountDetails
        },
      {
        path: "tab/location",
        component: AccountLocation
      },
      {
        path: "tab/client",
        component: AccountClient
      }

    ]
  },
]