<script setup>
import { formatDate } from '@/utils/helpers.js'
import { ShTable } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { onMounted, ref } from 'vue'

const homeData = ref([])

const fetchTicketCounts  = () => {
  service.homeStats().then((res) => {
    homeData.value = res
  })
}

onMounted(() => {
  // fetchTicketCounts()
})


</script>



<template>
  <main class="row">

  </main>

</template>

<style scoped>
.dashboard .sales-card i {
  color: #4154f1;
}
.dashboard .card-icon {
  font-size: 32px;
  line-height: 0;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  flex-grow: 0;
}
.rounded-circle {
  border-radius: 50% !important;
}
.text-gray{
  color: #879bbd;
}
</style>
