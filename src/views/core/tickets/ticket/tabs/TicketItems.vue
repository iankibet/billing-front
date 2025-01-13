<script setup>
import { ShAutoForm, ShTable, ShCanvas, shRepo, useAppStore, ShModalForm, ShModal } from '@iankibetsh/shframework'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { onMounted, ref, useId, watch, watchEffect } from 'vue'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { formatDate, formatStatus } from '@/utils/helpers.js'
import getSupportDistance from '@/utils/getSupportDistance.js'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const {getActionUrl, service: ticketService, loading} = useStreamline('ticket' )

const props = defineProps(['sharedData'])
const ticket = ref(props.sharedData.ticket)
const itemToUpdate = props.sharedData.itemToUpdate;


const client = ref(ticket.value.user)

const addTicketItem = useId()
const item = ref(null)
const appStore = useAppStore()

const updateItemModal = useId()
const updateUsage = (row) =>{
  item.value = row
  if(item.value ){
    shRepo.showModal(updateItemModal)
  }
}

watchEffect(() => {
  console.log(' received in child:', itemToUpdate);
  if (itemToUpdate) {
    console.log('itemToUpdate received in child:', itemToUpdate);
    item.value = itemToUpdate;
    if(item.value){
      // shRepo.showModal(updateItemModal);
    }
  }
})


// const createdBy = row =>{
//   return `<a href="/users/view/${row.support.id}">${row.support.name}</a>`
// }

const editItem = row =>{
  item.value = row
  if(item.value){
    shRepo.showModal(addTicketItem)
  }
}

const deleteItem = row => {
  shRepo.runPlainRequest(getActionUrl('deleteItem', row.id)).then((res) => {
    shRepo.showToast('item deleted successfully', 'success')
    appStore.refresh(1000)
  })
}

const itemCreated = (res) => {
  shRepo.showToast('Item added successfully', 'success');
  appStore.refresh(2000)
}


const itemsField = [
  {
    name: 'name',
    label: 'Item Name',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    required: true,
  },
  {
    name: 'used',
    label: 'Used',
  },
  {
    name: 'support_id',
    label: 'Choose Support',
    required: true,
    url: getActionUrl('listTicketSupport', ticket.value.id),
    suggest: true
  }
]

</script>



<template>

  <CardLayout v-if="ticket.id">
    <div v-if-user-can="'tickets.items.write'">
      <sh-modal-form
        :modal-id="addTicketItem"
        modal-title="Ticket Item Form "
        :fields="itemsField"
        :current-data="item"
        :action="getActionUrl('addTicketItem', ticket.id)"
        :successCallback="itemCreated"
        class="btn btn-primary btn-sm"
      > <i class="bi bi-plus-circle"></i>
        ADD ITEM
      </sh-modal-form>
    </div>

    <div class="table-responsive ">
      <sh-table
        :disable-mobile-responsive="true"
        :hide-search="true"
        :end-point="getActionUrl('listTicketItems', ticket.id)"
        :headers="[
        'id','name','quantity', 'used',
        {
          label: 'Created By ',
          key: 'created_by',
          callback:row=>row.created_by.name
        },
        {
          label: 'Assigned To ',
          key: 'support_id',
          callback:row=>row.support.name
        },
        {
          label: 'Status',
          key: 'status',
          callback:(row)=>formatStatus(row.status)
        },

      ]"
        :actions="{
         label: '&nbsp;',
         type: 'dropdown-horizontal',
         icon: 'bi bi-three-dots',
         actions:[
                  {
                      label: 'Update Usage',
                      icon: 'bi bi-exposure',
                      class:'',
                      permission: 'tickets.items.update',
                      emits: updateUsage,
                      validator: ticket=>ticket?.assignment?.status == 'working'
                  },
                  {
                      label: 'Edit',
                      icon: 'bi bi-pencil-square',
                      permission: 'tickets.items.write',
                      emits: editItem,
                  },
                  {
                      label: 'Delete',
                      icon: 'bi bi-trash',
                      class:'',
                      permission: 'tickets.items.write',
                      emits: deleteItem,
                  },

          ]

      }"

      >
      </sh-table>
    </div>
    <sh-modal :modal-id="updateItemModal" modal-title="Update Item">
      <template v-if="item">
      <p class="mb-1"> Update used: <span class="text-primary">{{ item.name}}</span></p>
      <p>Quantity : <span class="text-primary h6">{{ item.quantity}}</span></p>

        <sh-auto-form
          :fields="[{
            name: 'used',
            label: 'Used',
            type: 'number',
            required: true,
          },
          {
            name: 'quantity',
            type: 'hidden',
          }

          ]"
          :current-data="item"
          :action="getActionUrl('updateItem', item.id)"
          :successCallback="itemCreated"
        />
      </template>
    </sh-modal>
    <p> {{ itemToUpdate}}</p>
  </CardLayout>

 <SkeletonFull v-else />
</template>

<style scoped>

</style>