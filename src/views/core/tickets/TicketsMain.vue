<script setup>
import { ShModalForm, ShTabs, ShModal, shRepo, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { onMounted, ref, useId } from 'vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const {getActionUrl, service: ticketsService, loading} = useStreamline('tickets')
const {getActionUrl:usersGetActionUrl} = useStreamline('users')
const {getActionUrl:accountsActionUrl} = useStreamline('accounts')
const ticketModalId = useId();

const appStore = useAppStore();
const showaAlert = ref(true)

const ticketSaved = (res) => {
  shRepo.showToast('Ticket saved successfully', 'success', {timeout:5000});
  appStore.refresh(2000)
}

const currentData = ref(null)
const editTicket = (ticket) => {
  ticket.close_at = shRepo.formatDate(ticket.close_at, 'YYYY-MM-DDTHH:mm')
  ticket.start_at = shRepo.formatDate(ticket.start_at, 'YYYY-MM-DDTHH:mm')
  currentData.value = ticket
  console.log(ticket)
  shRepo.showModal(ticketModalId)
}

const deleteTicket = ticket => {
  console.log('delete', ticket)
}
const tabCounts = ref({});

onMounted(() => {
  ticketsService.countTickets().then((res) => {
    tabCounts.value = res
  })
})

const fields = [
  {
    name: 'account_id',
    type: 'select',
    label: 'Select Account',
    url: accountsActionUrl('listUsersTicketAccounts'),
    suggest: true
  },
  {
    name: 'user_id',
    type: 'select',
    label: 'Select Client',
    url: usersGetActionUrl('listClients', 'active'),
    suggest: true
  },
  {
    name: 'type',
    type: 'select',
    label: 'Select Ticket Type',
    required: true,
    options: [
      {label: 'Installation', value: 'installation'},
      {label: 'Maintenance', value: 'maintenance'},
      {label: 'Relocation', value: 'relocation'},
      {label: 'Construction', value: 'construction'},
    ]
  },
  {
    name: 'name',
    label: 'Ticket name',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'priority',
    type: 'select',
    label: 'Select Priority',
    required: true,
    options: [
      {label: 'Low', value: 'low'},
      {label: 'Medium', value: 'medium'},
      {label: 'High', value: 'high'},
      {label: 'Urgent', value: 'urgent'},
    ]
  },
  {
    name: 'start_at',
    type: 'datetime-local',
    label: 'Expected Start Time',
  }
]

</script>

<template>
  <div class="" v-if="!loading">
<!--    <div class="alert alert-success alert-dismissible fade show  text-success" role="alert" v-if="showaAlert">-->
<!--      <strong>Holy guacamole!</strong> You should check in on some of those fields below.-->
<!--      <router-link to="/tickets">Go to ticket</router-link>-->
<!--      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>-->
<!--    </div>-->
    <div class="row">
      <div class="" v-if-user-can="'tickets.create'">
        <sh-modal-form
          :modal-id="ticketModalId"
          modal-title="Save Ticket"
          :fields="fields"
          :current-data="currentData ?? {
            priority: 'medium',
            type: 'maintenance',
          }"
          :action="getActionUrl('saveTicket')"
          :successCallback="ticketSaved"
          class="btn btn-primary  btn-sm"
          modal-size='lg'
        > <i class="bi bi-plus-circle me-1"></i>Create Ticket </sh-modal-form>
      </div>

    </div>

    <div class="table-responsive">
      <sh-tabs
        :tabs="['new','assigned', 'working','escalated','postponed', 're_opened', 'closed', 'cancelled' ]"
        base-url="/tickets"
        :shared-data="{editTicket, deleteTicket}"
        :tab-counts="tabCounts"
      />
    </div>
  </div>
  <SkeletonFull v-else />
</template>

<style scoped>

</style>