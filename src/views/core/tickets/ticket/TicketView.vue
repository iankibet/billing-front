<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { onMounted, ref, useId, watch } from 'vue'
import {
  ShTabs,
  ShModalForm,
  ShConfirmAction,
  shRepo,
  useAppStore,
  ShTable,
  ShModal,
  useUserStore
} from '@iankibetsh/shframework'
import { useRoute, useRouter } from 'vue-router'
import CheckBox from '@/components/form-components/CheckBox.vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { formatDate, formatPriority, formatStatus } from '@/utils/helpers.js'
import { storeToRefs } from 'pinia'
import FormatDate from '@/views/components/FormatDate.vue'
import DateTimeInput from '@/components/form-components/DateTimeInput.vue'
import getSupportDistance from '@/utils/getSupportDistance.js'

const route = useRoute();
const ticketId = route.params.id;
const userStore = useUserStore();
userStore.getUser()
const {user} = storeToRefs(userStore)

const {getActionUrl, service: ticketService, loading} = useStreamline('tickets',ticketId )
const {getActionUrl:ticketActionUrl, service} = useStreamline('ticket', ticketId)
const {service: myService, getActionUrl:myServiceActionUrl} = useStreamline('myTickets')


const {getActionUrl:usersGetActionUrl, service: userService} = useStreamline('users')

const props = defineProps(['ticket'])
const ticket = props.ticket
const appStore = useAppStore();
const counts = ref(null)
const client = ref(null)
const router = useRouter()
const closeModalId = useId()
const escalateModalId = useId()
const cancelModalId = useId()
const postoneModalId = useId()
const distance = ref(null)
const alertModalId = useId()
const distanceError = ref(false)


const getCounts = () => {
   ticketService.getCounts(ticketId).then((res) => {
    counts.value = res
  })
}
const taskAdded = (res) => {
  console.log(res)
}

const deleteSuccess = (res) => {
  shRepo.showToast('Ticket deleted successfully', 'success')
  appStore.refresh(1000)
  setTimeout(() => {
    router.push('/tickets')
  }, 1000)
}

const ticketAssigned = (res) => {
  shRepo.showToast('Ticket assigned successfully', 'success');
  appStore.refresh(2000)
}

const logs = ref(null)

const getTicketLogs = () => {
  ticketService.getTicketLogs(ticketId).then((res) => {
    logs.value = res.data
  })
}

onMounted(() => {
  appStore.setItem('title', `Ticket ID #${ticketId} Details`)
  getCounts()
  getTicketLogs()
})

const itemToUpdate = ref(null)
const updateItemUsage = (item) => {
  itemToUpdate.value = item
}

const completeSucces = (res) => {
  shRepo.showToast('Ticket completed successfully', 'success');
  setTimeout(()=>{
    window.location.reload()
  },2500)
}

const ticketActionSuccess = (res) => {
  shRepo.showToast('Ticket action successful', 'success');
  appStore.refresh(3000)
}


const  startWorking  = async ()  => {
  if(!ticketService.ticket.verify_distance){
    // myService.startWorking(ticketService.ticket.assignment.id).then((res) => {
    //   if (res.status === "success"){
    //     shRepo.showToast('You have started working on this ticket', 'success');
    //   }
    //   // appStore.refresh(3000);
    // }).catch((err) => {
    //   shRepo.showToast('An error occurred while starting ticket', 'error');
    // });

    shRepo.runPlainRequest(myServiceActionUrl('startWorking', ticketService.ticket.assignment.id)).then((res) => {
      if (res.status === "success"){
        shRepo.showToast('You have started working on this ticket', 'success');
        useAppStore().refresh(2000)
      }
      useAppStore().refresh(2000)
    }).catch((err) => {
      shRepo.showToast(err.message, 'error')
    })

  }else{
    distanceError.value = false
    shRepo.showModal(alertModalId)
    distance.value = await getSupportDistance(ticketService.ticket.account.latitude, ticketService.ticket.account.longitude)
    // shRepo.hideModal(alertModalId)
    if (typeof distance.value === 'number' && distance.value > 100) {
      distanceError.value = true
      shRepo.showToast('You are far from client location', 'error')
    }else{
      myService.startWorking(ticketService.ticket.assignment.id).then((res) => {
        if (res.status === "success"){
          shRepo.showToast('You have started working on this ticket', 'success');
          appStore.refresh(3000)
        }
        // appStore.refresh(3000);
      }).catch((err) => {
        shRepo.showToast('An error occurred while starting ticket', 'error');
      });
    }
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



const fields = [
  {
    name: 'support_id',
    type: 'select',
    label: 'Assign To',
    required: true,
    allowMultiple: true,
    url: usersGetActionUrl('listAdmins','active'),
    suggest: true,
  },
  {
    label: 'Select Team Lead',
    type: 'select',
    required: true,
    name:'team_lead_id',
    url: usersGetActionUrl('listAdmins', 'active'),
    suggest: true,
  },
  {
    label: 'Verify Technician Distance',
    type: 'checkbox',
    component: CheckBox,
    name: 'verify_distance',
  },
  {
    name: 'instructions',
    type: 'textarea',
    label: 'Assigment Instructions',
  }

]


</script>

<template>

  <div  v-if="!loading && ticketService.ticket" >
    <!--      Assign ticket-->
    <div class="actions d-flex align-items-center gap-2 pb-2 mb-3">
      <div  v-if-user-can="'tickets.assign'" v-if="ticketService.ticket.status === 'new' || ticketService.ticket.status === 'escalated'">
        <sh-modal-form
          class="btn btn-sm text-white btn-info"
          modal-id="addTask"
          modal-title="Assign Ticket "
          :fields="fields"
          :action="ticketActionUrl('assignTicket', ticketId)"
          :successCallback="ticketAssigned"
        > <i class="bi bi-person-fill-add"></i> Assign Ticket </sh-modal-form>
      </div>
      <div  v-if-user-can="'tickets.assign'" v-if="ticketService.ticket.status !== 'new' && ticketService.ticket.status !== 'deleted' && ticketService.ticket.status !== 'escalated'">
        <sh-modal-form
          class="btn btn-sm text-white btn-info"
          modal-id="addTask"
          modal-title="Reassign Ticket "
          :fields="fields"
          :action="ticketActionUrl('reassignTicket', ticketId)"
          :successCallback="ticketAssigned"
        > <i class="bi bi-person-fill-add"></i> Reassign Ticket </sh-modal-form>
      </div>

      <button class="btn-sm btn  btn-success  bi-play-circle-fill" v-if="ticketService.ticket?.assignment?.status === 'assigned'" @click="startWorking"> Start Working  </button>

      <!--      Close ticket-->
      <a :href="'#'+closeModalId" v-if="ticketService.ticket?.assignment?.status === 'working'" v-if-user-can="'tickets.close'" data-bs-toggle="modal" class="btn btn-sm btn-success" :data-bs-target="'#'+closeModalId"><i class="bi bi-check2-circle "></i> Close </a>
      <a :href="'#'+closeModalId" v-if="ticketService.ticket?.status === 'assigned'" v-if-user-can="'tickets.confirm'" data-bs-toggle="modal" class="btn btn-sm btn-success" :data-bs-target="'#'+closeModalId"><i class="bi bi-check2-circle "></i> Close </a>

      <sh-modal :modal-id="closeModalId" modal-title="Close Ticket" centered="true">
        <p class="text-center"> If you were assigned Ticket Items, Please confirm that all  have been accounted for</p>
        <div class="table-responsive ">
          <sh-table
            :disable-mobile-responsive="true"
            pagination-style="loadMore"
            :hide-search="true"
            :end-point="ticketActionUrl('listTicketItems', ticketId)"
          >
            <template v-slot:records="slotProps">
              <p v-for="(item, index) in slotProps.records" :key="item.id" class="d-flex align-items-center gap-2 mb-1">
                <span>{{ index+1 }}. </span>
                <span>{{ item.name }} used - </span>
                <span class="text-primary">{{item.used}} of {{ item.quantity }}</span>
                <!--                <button class="btn btn-xs btn-primary" @click="updateItemUsage(item)"> Update</button>-->
              </p>
            </template>
          </sh-table>
        </div>
        <template v-if="user.id === ticketService?.ticket?.assignment?.support_id">
          <sh-confirm-action  v-if-user-can="'tickets.close'" @success="completeSucces" :url="ticketActionUrl('closeTicket', ticketService.ticket?.assignment?.id)" method="post" title="Close Ticket" message="Make sure everything is confirmed.">
            <div class="d-grid gap-2 mx-auto col-6">
              <button class="btn btn-sm  btn-success btn-sm-block text-white text-center"><i class="bi bi-check2-circle"></i> PROCEED</button>
            </div>
          </sh-confirm-action>
        </template>
        <template v-else>
          <sh-confirm-action  v-if-user-can="'tickets.close'" @success="completeSucces" :url="ticketActionUrl('closeAndConfirm', ticketId)" method="post" title="Close Ticket" message="Make sure everything is confirmed.">
            <div class="d-grid gap-2 mx-auto col-6">
              <button class="btn btn-sm  btn-success btn-sm-block text-white text-center"><i class="bi bi-check2-circle"></i> PROCEED</button>
            </div>
          </sh-confirm-action>
        </template>

      </sh-modal>

      <!--      Delete ticket-->
      <sh-confirm-action  v-if-user-can="'tickets.delete'" @success="deleteSuccess" :url="ticketActionUrl('deleteTicket', ticketId)" method="post" title="Delete Ticket" message="This action cannot be undone. Are you sure you want to delete this ticket?">
        <button class="btn btn-sm btn-danger text-white"><i class="bi bi-trash "></i> Delete</button>
      </sh-confirm-action>

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
      <!--      Escalate ticket-->
      <div  v-if="ticketService.ticket?.assignment?.open === 'yes'" v-if-user-can="'tickets.close'">
        <sh-modal-form
          class="btn btn-sm btn-outline-primary"
          :modal-id="escalateModalId"
          modal-title="Escalate Ticket "
          centered="true"
          :fields="[{
            name:'reason',
            type:'textarea',
            label:'Reason for Escalation',
          }]"
          :action="ticketActionUrl('escalateTicket', ticketService.ticket.id)"
          :successCallback="ticketActionSuccess"
        > <i class="bi bi-upload"></i> Escalate  </sh-modal-form>
      </div>

      <!--      Postpone ticket-->
      <div  v-if="ticketService.ticket?.assignment?.open === 'yes'" v-if-user-can="'tickets.postpone'">
        <sh-modal-form
          class="btn btn-sm btn-info"
          :modal-id="postoneModalId"
          modal-title="Postpone Ticket "
          centered="true"
          :fields="[
            {
            name:'new_ticket_date',
            type:'datetime',
            label:'New Ticket Date',
            component: DateTimeInput,
            },
            {
            name:'reason',
            type:'textarea',
            label:'Reason for Postponement',
          }]"
          :action="ticketActionUrl('postponeTicket', ticketService.ticket?.id)"
          :successCallback="ticketActionSuccess"
        > <i class="bi bi-x-lg"></i> Postpone  </sh-modal-form>
      </div>

      <!--      Cancel ticket-->
      <div  v-if="ticketService.ticket?.assignment?.open === 'yes'" v-if-user-can="'tickets.cancel'">
        <sh-modal-form
          class="btn btn-sm btn-danger"
          :modal-id="cancelModalId"
          modal-title="Cancel Ticket "
          centered="true"
          :fields="[{
            name:'reason',
            type:'textarea',
            label:'Reason for Cancellation',
          }]"
          :action="ticketActionUrl('cancelTicket', ticketService.ticket.id)"
          :successCallback="ticketActionSuccess"
        > <i class="bi bi-x-lg"></i> Cancel  </sh-modal-form>
      </div>
    </div>

    <div :class="{'opacity-50': ticketService.ticket.status === 'cancelled'}">
      <div class="d-flex align-items-center gap-5 small mb-2">
        <span class="d-flex">priority :<span v-html="formatPriority(ticketService.ticket.priority)" class="ms-2"></span></span>
        <span class="d-flex">status : <span v-html="formatStatus(ticketService.ticket.status)"></span> </span>
      </div>
      <div class="row">
        <div class="col-md-7">
          <sh-tabs
            :tabs="['details','assignments','items','notes', 'client' ]"
            :shared-data="{ticket:ticketService.ticket, itemToUpdate}"
            :base-url="`/tickets/view/${ticketId}`"
            :tab-counts="{'assignments': counts?.assignments, 'items': counts?.items, 'notes': counts?.notes}"
          />
        </div>
        <div class="col-md-5 mt-4">
          <div class="card border-0 mt-3">
            <div class="card-body">
              <h5 class=""> Conversations & Logs </h5>
              <sh-table :end-point="getActionUrl('getTicketLogs', ticketId)" pagination-style="loadMore">
                <template v-slot:records="slotProps">
                  <ul>
                    <li v-for="log in slotProps.records"  :key="log.id">
                      <small class="text-muted small text-start">  {{ formatDate(log.created_at)}}</small>
                      <span> -  {{ log.log}}</span>
                      <small class="text-end"> : <router-link :to="`/users/view/${log.user_id}`"> {{ log.user.name}}</router-link></small>
                    </li>
                  </ul>
                </template>
              </sh-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <SkeletonFull v-else></SkeletonFull>

</template>

<style scoped>


</style>