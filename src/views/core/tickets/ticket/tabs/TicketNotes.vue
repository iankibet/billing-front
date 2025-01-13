<script setup>
import {
  ShConfirmAction,
  ShTable,
  ShCanvas,
  shRepo,
  useAppStore,
  ShModalForm, useUserStore
} from '@iankibetsh/shframework'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { onMounted, ref, useId, watchEffect } from 'vue'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { formatAnyDate, formatDate, formatStatus } from '@/utils/helpers.js'
import getSupportDistance from '@/utils/getSupportDistance.js'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { storeToRefs } from 'pinia'

const { getActionUrl, service: ticketService, loading } = useStreamline('ticket')

const props = defineProps(['sharedData'])
const ticket = ref(props.sharedData.ticket)

const client = ref(ticket.value.user)

const addTicketNote = useId()
const note = ref(null)
const appStore = useAppStore()
const userStore = useUserStore();
const {user} = storeToRefs(userStore)

const editNote = (row) => {
  note.value = row
  if (note.value) {
    shRepo.showModal(addTicketNote)
  }
}

const deleteNote = (row) => {
  shRepo.runPlainRequest(getActionUrl('deleteNote', row.id)).then((res) => {
    shRepo.showToast('note deleted successfully', 'success')
    appStore.refresh(1000)
  })
}

const noteCreated = (res) => {
  shRepo.showToast('Note added successfully', 'success')
  appStore.refresh(2000)
}


const notesField = [
  {
    name: 'title',
    label: 'Note Title',
    required: true
  },
  {
    name: 'note',
    type: 'textarea',
    label: 'Note'
  }
]
</script>

<template>
  <CardLayout v-if="ticket.id">
    <sh-modal-form
      :modal-id="addTicketNote"
      modal-title="Ticket Note Form "
      :fields="notesField"
      :current-data="note"
      :action="getActionUrl('addTicketNote', ticket.id)"
      :successCallback="noteCreated"
      class="btn btn-primary btn-sm mb-2"
    >
      <i class="bi bi-plus-circle"></i>
      ADD NOTES
    </sh-modal-form>
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
  </CardLayout>
  <SkeletonFull v-else />
</template>

<style scoped></style>
