<script setup>
import { ShModalForm, ShTabs, ShModal, shRepo, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { onMounted, ref, useId } from 'vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const {getActionUrl, service, loading} = useStreamline('myTickets')
const ticketModalId = useId();

const appStore = useAppStore();
const showaAlert = ref(true)

const ticketSaved = (res) => {
  shRepo.showToast('Ticket saved successfully', 'success', {timeout:50000});
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


const tabCounts = ref({});

onMounted(() => {
  service.countAssigns().then((res) => {
    tabCounts.value = res
  })
})


</script>

<template>
  <div class="" v-if="!loading">

    <div class="table-responsive">
      <sh-tabs
        :tabs="['assigned','working', 'closed' ]"
        base-url="/my-tickets"
        :shared-data="{editTicket, deleteTicket}"
        :tab-counts="tabCounts"
      />
    </div>
  </div>
  <SkeletonFull v-else />
</template>

<style scoped>

</style>