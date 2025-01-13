import TicketsMain from '@/views/core/tickets/TicketsMain.vue'
import TicketView from '@/views/core/tickets/ticket/TicketView.vue'
import TicketDetails from '@/views/core/tickets/ticket/tabs/TicketDetails.vue'
import ListTickets from '@/views/core/tickets/tabs/ListTickets.vue'
import TicketAssignment from '@/views/core/tickets/ticket/tabs/TicketAssignments.vue'
import TicketItems from '@/views/core/tickets/ticket/tabs/TicketItems.vue'
import TicketNotes from '@/views/core/tickets/ticket/tabs/TicketNotes.vue'
import MyTickets from '@/views/core/tickets/support/MyTickets.vue'
import ListMyTickets from '@/views/core/tickets/support/ticket/tab/ListMyTickets.vue'
import TicketClient from '@/views/core/tickets/ticket/tabs/TicketClient.vue'

const routes = [
  {
    path: "/tickets",
    name: "tickets",
    component: TicketsMain,
    children:[
      {
        path:'tab/:status',
        component: ListTickets,
      },
    ]
  },
  {
    path:'/tickets/view/:id',
    component: TicketView,
    children: [
      {
        path:'tab/details',
        component: TicketDetails,
      },
      {
        path:'tab/assignments',
        component: TicketAssignment,
      },
      {
        path: 'tab/client',
        component: TicketClient
      },
      {
        path: 'tab/items',
        component: TicketItems
      },
      {
        path: 'tab/notes',
        component: TicketNotes
      }
    ]
  },
  {
    path: '/my-tickets',
    component: MyTickets,
    children:[
      {
        path:'tab/:status',
        component: ListMyTickets,
      },
    ]



  }

]

export default routes;