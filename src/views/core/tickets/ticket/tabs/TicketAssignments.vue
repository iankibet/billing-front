<script setup>
import { ShConfirmAction, ShTable, ShCanvas, shRepo, useAppStore, ShModalForm } from '@iankibetsh/shframework'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { onMounted, ref, useId, watchEffect } from 'vue'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { formatAnyDate, formatStatus } from '@/utils/helpers.js'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const {getActionUrl, service: ticketsService, loading} = useStreamline('tickets' )

const props = defineProps(['sharedData'])
const ticket = ref(props.sharedData.ticket)
const client = ref(ticket.value.user)

const assignCanvasId = useId()
const assign = ref(null)
const appStore = useAppStore()

const viewAssign = row =>{
  assign.value = row
  if(assign.value){
    shRepo.showOffCanvas(assignCanvasId)
  }
}

const getAssignedTo = row =>{
 return `<a href="/users/view/${row.support.id}">${row.support.name}</a>`
}

const deleteAssign = row => {
  shRepo.runPlainRequest(getActionUrl('deleteAssign', row.id)).then((res) => {
    shRepo.showToast('Assign deleted successfully', 'success')
    appStore.refresh(1000)
  })
}

const startWorking = () => {
  console.log('start working', assign.value)
}


const commentField = [
  {
    name: 'comment',
    type: 'textarea',
    label: 'Comment',
    required: true,

  }
]

</script>

<template>
  <CardLayout v-if="ticket.id">
  <div class="table-responsive ">
    <sh-table
      :disable-mobile-responsive="true"
      pagination-style="loadMore"
      :hide-search="true"
      :end-point="getActionUrl('listAssigns', ticket.id)"
      :headers="[
        'id',
        {
          label: 'Assigned To',
          key: 'support',
          callback:getAssignedTo
        },
        {
          label: 'Status',
          key: 'status',
          callback:(row)=>formatStatus(row.status)
        },
        {
          label: 'Assigned At',
          kay: 'assigned_at',
          callback:(row)=>formatAnyDate(row.assigned_at, 'DD MMM HH:mm')
        },
        {
          label: 'Started At',
          kay: 'started_at',
          callback:(row)=>formatAnyDate(row.started_at, 'DD MMM HH:mm')
        }

      ]"
      :actions="{
         label: '&nbsp;',
         type: 'dropdown-horizontal',
         icon: 'bi bi-three-dots',
         actions:[
                   {
                      label: 'Start Assignment',
                      icon: 'bi bi-play-circle',
                      class:'',
                      permission: 'tickets.assign',
                      emits: startAssignment,
                      validator: row=>row.status == 'assigned'
                  },
                  {
                      label: 'View More',
                      icon: 'bi bi-eye',
                      permission: 'tickets.read',
                      emits: viewAssign,
                  },
                  {
                      label: 'Edit',
                      icon: 'bi bi-pencil-square',
                      permission: 'tickets.assign',
                      emits: editTicket,
                  },
                  {
                      label: 'Delete',
                      icon: 'bi bi-trash',
                      class:'',
                      permission: 'tickets.assign',
                      emits: deleteAssign,
                  },

          ]

      }"

    >
    </sh-table>
  </div>

  <sh-canvas :canvas-id="assignCanvasId" :canvas-data="ticket" class="md" :canvas-title="`Assign Ticket #${ticket.id} `" side="end">
    <template  v-if="assign">
      <div class="actions d-flex gap-2 flex-wrap">
<!--        <button class="btn btn-primary" v-if="assign.status === 'assigned'" @click="startWorking"> <i class="bi bi-player-circle"></i> Start Working</button>-->
<!--        <button class="btn btn-success" v-if="assign.status === 'working'" @click="completeTicket"> <i class="bi bi-player-circle"></i> Complete Ticket</button>-->
<!--        <button class="btn btn-secondary" v-if="assign.status === 'working'" @click="escalateTicket"> <i class="bi bi-player-circle"></i> Escalate Ticket</button>-->
        <div v-if-user-can="'tickets.assign'">
          <sh-modal-form
            :modal-id="assignModalId"
            modal-title="Cancel Assignment "
            :fields="[{name:'comment', type:'textarea', label:'Comment'}]"
            :current-data="assign"
            :action="getActionUrl('cancelAssignment', assign.id)"
            :successCallback="assignCancelled"
            class="btn btn-danger btn-sm "
          > <i class="bi bi-x-lg"></i> Cancel Assign </sh-modal-form>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table class="table-striped table">
          <tbody>
          <tr>
            <td>Assigned To</td>
            <td>{{ assign.support.name }}</td>
          </tr>
          <tr>
            <td>Status </td>
            <td v-html="formatStatus(assign.status)"></td>
          </tr>
          <tr>
            <td>Assigned At</td>
            <td>{{ shRepo.formatDate(assign.assigned_at) ?? '--' }}</td>
          </tr>
          <tr>
            <td>Start At</td>
            <td>{{ shRepo.formatDate(assign.started_at) ?? '--' }}</td>
          </tr>
          <tr>
            <td>Closed At</td>
            <td>{{ shRepo.formatDate(assign.closed_at) ?? '--' }}</td>
          </tr>
          <tr>
            <td>Turnaround Time</td>
            <td>{{ assign.ttime ?? '--' }}</td>
          </tr>
          <tr>
            <td>Assigned By</td>
            <td>{{ assign.support.name }}</td>
          </tr>
          <tr>
            <td>Rating</td>
            <td>{{ assign.rating ?? '--' }}</td>
          </tr>
          <tr>

            <td>Instructions</td>
            <td>{{ assign.instructions }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </sh-canvas>

</CardLayout>
  <SkeletonFull v-else />
</template>

<style scoped>

</style>