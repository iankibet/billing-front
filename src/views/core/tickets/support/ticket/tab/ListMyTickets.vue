<script setup>
import { useStreamline } from '@iankibetsh/vue-streamline'
import { ShTable, ShConfirmAction, shRepo, ShModal, useAppStore, useUserStore } from '@iankibetsh/shframework'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { useRoute } from 'vue-router'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { formatPriority, formatStatus, normalDateTime } from '@/utils/helpers.js'
import { ref, useId, watch, watchEffect } from 'vue'
import getSupportDistance from '@/utils/getSupportDistance.js'
import { storeToRefs } from 'pinia'
import router from '@/router/index.js'
import { Geolocation } from '@capacitor/geolocation';


const route = useRoute();
const status = route.params.status
const {getActionUrl, service: myService, loading} = useStreamline('myTickets')
const appStore = useAppStore()
const ticket = ref(null)
const userStore = useUserStore();
const {user} = storeToRefs(userStore)

const distance = ref(null)
const alertModalId = useId()
const distanceError = ref(false)



const startWorking = async (assign) => {
  // const coordinates = await Geolocation.getCurrentPosition();
  // console.log(coordinates.coords.latitude)
  //
  // return;
  distanceError.value = false
  shRepo.showModal(alertModalId)
  distance.value = await getSupportDistance(assign.account.latitude, assign.account.longitude)
  // shRepo.hideModal(alertModalId)
  if (typeof distance.value === 'number' && distance.value > 100) {
    distanceError.value = true
    shRepo.showToast('You are far from client location', 'error')
  }else{
    myService.startWorking(assign.id).then((res) => {
      if (res.status === "success"){
        shRepo.showToast('You have started working on this ticket', 'success');
        router.push(`/tickets/view/${assign.ticket_id}`)
      }

      // appStore.refresh(3000);
    }).catch((err) => {
      shRepo.showToast('An error occurred while starting ticket', 'error');
    });
  }
}
watch(distance, (newVal, oldVal) => {
  if (typeof oldVal === 'object' && typeof newVal !== 'object') {
    // console.log('Distance changed from object to float:', typeof newVal)
    if(newVal > 100){
      shRepo.showToast('You are far from client location', 'error')
      // appStore.refresh(3000)
    }else{
      //
    }
  }
})

const closeTicket = (ticket) => {
  myService.closeTicket(ticket.id).then((res) => {
    if (res.status === "success"){
      shRepo.showToast('Ticket closed successfully', 'success');
      appStore.refresh(3000);
    }
  }).catch((err) => {
    shRepo.showToast('An error occurred while closing ticket', 'error');
  });
}

</script>

<template>
  <div class="" v-if="!loading">
    <sh-table :end-point="getActionUrl('listTickets', status)" pagination-style="loadMore">
      <template v-slot:records="slotProps">
        <div class="row">
          <div  class="col-md-4" v-for="assign in slotProps.records" :ticket="assign" :key="assign.id">
              <div >
                <div class="card">
                  <div class="card-body t_details">
                    <div class="d-flex justify-content-between align-items-center">
                      <p> Ticket ID:<span> #{{ assign?.ticket_id}} </span></p>
                      <p class="d-flex justify-content-between small align-items-center text-end"> <span class="t_title"> Status:</span><span v-html="formatStatus(assign?.ticket?.status)"></span></p>
                    </div>
                    <div class="d-flex justify-content-between">
                      <p> <span class="t_title"> Urgency:</span><span v-html="formatPriority(assign?.ticket?.priority)"></span></p>
                      <p class="text-end"> <span class="t_title"> Type:</span><span> {{ assign?.ticket?.type}}</span></p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                       <div>
                         <p> <span class="t_title"> Client:</span><span> {{ assign?.ticket?.user?.name.split(' ')[0]}}</span></p>
                         <p> <span class="t_title"> Account:</span><span> {{ assign?.account?.account_no}}</span></p>
                       </div>
                      <template v-if="!assign?.ticket?.user?.phone2">
                        <p class="text-end"> <span class=""> {{ assign?.ticket?.user?.phone}} <i class="bi bi-telephone-outbound-fill  h5 fw-bold  text-primary py-0 px ms-1"></i></span></p>
                      </template>
                      <template v-else>
                       <div>
                         <p class="text-end"> <a :href="`tel:${assign?.ticket?.user?.phone}`" class=""> +{{ assign?.ticket?.user?.phone}} <i class="bi bi-telephone-outbound-fill  h5 fw-bold  text-primary py-0 px ms-1"></i></a></p>
                         <p class="text-end"> <a :href="`tel:${assign?.ticket?.user?.phone2}`" class=""> +{{ assign?.ticket?.user?.phone}} <i class="bi bi-telephone-outbound-fill  h5 fw-bold  text-primary py-0 px ms-1"></i></a></p>
                       </div>
                      </template>


                    </div>
                    <div class="d-flex justify-content-between">
                      <p> <span class="t_title"> Location:</span><span> {{ assign?.account?.location}}</span></p>
                    </div>
                    <div class="d-flex justify-content-between">
                      <p> <span class="t_title"> Expected Start Time:</span><span> {{ normalDateTime(assign.ticket.start_time)}}</span></p>
                    </div>
                    <div class="d-flex gap-2">
<!--                      <button class="btn  btn-success flex-fill bi-play-circle-fill" v-if="assign.ticket.status === 'assigned'" @click="startWorking(assign)"> Start Working  </button>-->
<!--                      <button class="btn btn-sm btn-success w-100 bi-check-circle-fill" v-if="ticket.status === 'working'" @click="closeTicket(ticket)"> Close Ticket  </button>-->
                      <router-link :to="`/tickets/view/${assign.ticket_id}`" class="btn  btn-dark flex-fill  bi-eye-fill"> View Details  </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

      </template>

    </sh-table>

    <sh-modal :modal-id="alertModalId" modal-title="Calculating Distance"  :centered='true'>
      <div class="text-center" v-if="!distanceError">
        <p> Finding your location. Please wait... </p>
        <p class="spinner-border text-primary text-center" v-if="typeof distance !== 'number'"></p>
<!--        <p> You are {{ distance ?? '' }} Metres away from client's location</p>-->
      </div>
      <div v-else-if="distanceError" class="text-center">
        <i class="bi bi-exclamation-diamond-fill h1 text-danger"></i> <br>
        <h3 class="text-danger"> Error!</h3>
        <p> You are far from client location. Please move closer and try again </p>
      </div>
    </sh-modal>


  </div>
  <SkeletonFull v-else />

</template>

<style scoped>
.t_title{
  margin-right: 5px;
  opacity: .6;
}
.t_details p{
  margin-bottom: 5px;
}

</style>