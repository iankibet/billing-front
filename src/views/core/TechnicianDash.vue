<script setup>
import { useStreamline } from '@iankibetsh/vue-streamline'
import { onMounted, ref } from 'vue'

const {service, loading, getActionUrl} = useStreamline('home')

const homeData = ref([])

const fetchTicketCounts  = () => {
  service.technicianHomeStats().then((res) => {
    homeData.value = res
  })
}

onMounted(() => {
  fetchTicketCounts()
})
</script>

<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-sm-4 col-md-4">
        <div class="bg-primary bg-opacity-10 rounded-2 px-3 pt-1 mb-2">
          <h6 class="py-1 d-flex align-items-center justify-content-between"> <span> Tickets</span> <small class="text-gray small fw-light">  Assigned </small></h6>
          <div class="info-card sales-card ">
            <div class="d-flex align-items-center justify-content-between text-end ">
              <div class="card-icon bg-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="bi bi-node-plus text-info "></i>
              </div>
              <div class="ps-3">
                <h6>{{ homeData.tickets?.new_assigns}}</h6>
                <span class="text-warning small pt-1 fw-bold">+{{ homeData.tickets?.new_assigns_today}}</span> <span class="text-muted small pt-2 ps-1"> today </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-md-4 ">
        <div class="bg-primary bg-opacity-10 rounded-2 px-3 pt-1 mb-2">
          <h6 class="py-1 d-flex align-items-center justify-content-between"> <span> Tickets</span> <small class="text-gray small fw-light">  Working </small></h6>
          <div class=" info-card sales-card ">
            <div class="d-flex align-items-center justify-content-between text-end ">
              <div class="card-icon bg-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="bi bi-dash-circle-dotted text-primary"></i>
              </div>
              <div class="ps-3">
                <h6>{{ homeData.tickets?.working_tickets}}</h6>
<!--                <span class="text-warning small pt-1 fw-bold"> {{ homeData.tickets?.working_tickets}} </span> <span class="text-muted small pt-2 ps-1"> working </span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="  col-sm-4 col-md-4 ">
        <div class="bg-primary bg-opacity-10 rounded-2 px-3 pt-1 mb-2">
          <h6 class="py-1 d-flex align-items-center justify-content-between"> <span> Tickets</span> <small class="text-gray small fw-light">  Closed </small></h6>
          <div class=" info-card sales-card ">
            <div class="d-flex align-items-center justify-content-between text-end ">
              <div class="card-icon bg-white rounded-circle d-flex align-items-center justify-content-center">
                <i class="bi bi-check2-circle text-success"></i>
              </div>
              <div class="ps-3">
                <h6>{{ homeData.tickets?.closed_tickets}}</h6>
                <span class="text-warning small pt-1 fw-bold">+{{ homeData.tickets?.closed_today}}</span> <span class="text-muted small pt-2 ps-1"> Today </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>