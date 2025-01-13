<script setup>

import { useStreamline } from '@iankibetsh/vue-streamline'
import { shRepo, ShTable, ShCanvas, useAppStore } from '@iankibetsh/shframework'
import FormatDate from '@/views/components/FormatDate.vue'
import { useRoute } from 'vue-router'
import { ref, useId } from 'vue'
import { formatDateTime, formatPriority, formatStatus } from '@/utils/helpers.js'
import CardLayout from '@/views/layouts/CardLayout.vue'

const appStore = useAppStore();


const route = useRoute();
const status = route.params.status
const {getActionUrl, service: ticketsService} = useStreamline('tickets')

const props = defineProps(['sharedData'])
// console.log('sharedData', props.sharedData)
const editTicket = props.sharedData.editTicket
// const deleteTicket = props.sharedData.deleteTicket

const ticket = ref(null);
const deleteTicket = (ticket) => {
  shRepo.runPlainRequest(getActionUrl('deleteTicket', ticket.id)).then((res) => {
    shRepo.showToast('Ticket deleted successfully', 'success')
    appStore.refresh(2000)
  })

}
// const editTicket = ticket => {
//   console.log('emitting', ticket)
//   emit('editTicket', ticket)
// }

const ticketCanvasId = useId();

const viewTicket = (row) => {
  ticket.value = row
  shRepo.showOffCanvas(ticketCanvasId)
}

const formatPriorityCb = (row) => {
  return formatPriority(row.priority)
}

const formatStatusCb = (row) => {
  return formatStatus(row.status)
}


const ticketSummary = (row) => {
  ticket.value = row
  shRepo.showOffCanvas('ticketSummary')
}
const cancelTicket = (row) => {
  shRepo.runPlainRequest(getActionUrl('cancelTicket', row.id)).then((res) => {
    shRepo.showToast('Ticket cancelled successfully', 'success')
    appStore.refresh(2000)
  })
}

</script>

<template>
  <CardLayout>
    <div class="table-responsive">
      <sh-table
        :disable-mobile-responsive="true"
        :end-point="getActionUrl('listTickets', status)"
        :headers="[
        'id', 'name',
        {
          label: 'Client',
          key: 'client',
          callback: (row) => `<a href='/users/view/${row.user.id}'> ${row?.user.name ?? '--'}<a>`
        },
        {
          label: 'Account',
          key: 'account',
          callback: (row) => `<a href='/accounts/view/${row?.account?.id}'> ${row?.account?.account_no ?? '--'}<a>`
        },
        {
          label:' Status',
          callback: formatStatusCb
        },
          {
            label:'Priority',
            callback:formatPriorityCb
          },
        {
          label: 'Start At',
          key: 'start_at',
          callback: (row) => formatDateTime(row.start_at)
        },
         'created_at']"
          :links="{
        name: {
          url: '/tickets/view/{id}',
        }

      }"
      :has-range="true"
      :actions="{
                label: '&nbsp;',
                type: 'dropdown-horizontal',
                actions:[
                    {
                        label: 'View',
                        icon: 'bi bi-eye',
                        permission: 'tickets.read',
                        path: '/tickets/view/{id}'
                    },
                    {
                        label: 'Summary',
                        icon: 'bi bi-clipboard',
                        permission: 'tickets.read',
                        emits:ticketSummary
                    },
                    {
                        label: 'Edit',
                        icon: 'bi bi-pencil-square',
                        permission: 'tickets.write',
                        emits: editTicket
                    },
                    {
                        label: 'Cancel',
                        icon: 'bi bi-x-square',
                        permission: 'tickets.write',
                        emits: cancelTicket
                    }




                ]
              }"

      >
      </sh-table>

      <sh-canvas canvas-id="ticketSummary"  canvas-title="Ticket Summary" canvas-size="md" position="end">
        <div class="card px-0" v-if="ticket">
          <div class="card-body">
            <p class="card-text">Ticket ID: #{{ ticket?.id }}</p>
            <p class="card-text">Name: {{ ticket?.name }}</p>
            <p class="card-text">Client: {{ ticket?.client }}</p>
            <p class="card-text">Priority: <span v-html="formatPriority(ticket?.priority)"></span></p>
            <p class="card-text">Status: <span v-html="formatStatus(ticket?.status)"></span></p>
            <p class="card-text">Start At: {{ ticket?.start_at }}</p>
            <p class="card-text">Expected T.Time: {{ ticket?.expected_ttime }} hours</p>
            <p class="card-text">Created At: {{ formatDateTime(ticket?.created_at) }}</p>
            <p class="card-text">Description : {{ ticket?.description }}</p>
          </div>
        </div>
      </sh-canvas>


    </div>
  </CardLayout>

</template>

<style scoped>
.card-text{
  margin-bottom: 5px;
  display: flex;
}

</style>