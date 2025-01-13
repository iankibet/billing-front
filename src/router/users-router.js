import ClientsMain from '@/views/core/Users/ClientsMain.vue'
import UsersMain from '@/views/core/Users/UsersMain.vue'
import UserView from '@/views/core/Users/UserView.vue'
import UserDetails from '@/views/core/Users/user/tabs/UserDetails.vue'
import UserLocation from '@/views/core/Users/user/tabs/UserLocation.vue'
import Gmaps from '@/views/core/Users/user/tabs/Gmaps.vue'
import ListAdmins from '@/views/core/Users/admins/tabs/ListAdmins.vue'

import AdminsMain from '@/views/core/Users/AdminsMain.vue'
import ListClients from '@/views/core/Users/clients/tabs/ListClients.vue'
import UserAccounts from '@/views/core/Users/user/tabs/UserAccounts.vue'

const routes = [
  {
    path: "/users",
    name: "users",
    component:UsersMain,
    children:[
      {
        path: "clients",
        component:ClientsMain,
        children: [
          {
            path:'tab/:status',
            component: ListClients,
          }
        ]
      },
      {
        path: "admins",
        component:AdminsMain,
        name: "admins",
        children: [
          {
            path:'tab/:status',
            component: ListAdmins,
          }
        ]
      },
      {
        path: "view/:id",
        component: UserView,
        children: [
          {
            path: "tab/details",
            component: UserDetails
          },
          {
            path: "tab/accounts",
            component: UserAccounts
          },
          {
            path: "tab/location",
            component: UserLocation
          },
          {
            path: "tab/gmaps",
            component: Gmaps
          }
        ]
      }

    ]
  }
  ]

  export default routes;