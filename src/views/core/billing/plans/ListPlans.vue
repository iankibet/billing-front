<script setup>
import { ref, useId } from 'vue'
import { ShConfirmAction, ShModalForm, shRepo, ShTable, useAppStore, useUserStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { formatAnyDate, formatDate, formatStatus } from '@/utils/helpers.js'
import CheckBox from '@/components/form-components/CheckBox.vue'
import { storeToRefs } from 'pinia'

const {getActionUrl} = useStreamline('billing/plans')
const plan = ref(null)
const storePlanModalId = useId();
const appStore = useAppStore()
const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const planStored = (res) => {
  shRepo.showToast(res.message, 'success', );
  appStore.refresh(2000)
}
const deletePlan = plan => {
  shRepo.runPlainRequest(getActionUrl('deletePlan', plan.id)).then((res) => {
    shRepo.showToast('Plan deleted successfully', 'success')
    appStore.refresh(2000)
  })
}
const editPlan = (row) => {
  plan.value = row
  if (plan.value) {
    shRepo.showModal(storePlanModalId)
  }
}

const fields = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'plan_type',
    type:'select',
    label: 'Plan Type',
    required: 'true',
    options: [
      {label: 'Public', value: 'public'},
      {label: 'Private', value: 'private'}
      ]
  },
  {
    label: 'Is Popular',
    type: 'checkbox',
    component: CheckBox,
    name: 'is_popular',
  },
  {
    name: 'amount',
    label: 'Amount',
    required: true,
    type: 'number',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
  }
]

</script>

<template>
  <main>
    <sh-modal-form
      :modal-id="storePlanModalId"
      modal-title="Plans  Form "
      :fields="fields"
      :current-data="plan"
      :action="getActionUrl('storePlan')"
      :successCallback="planStored"
      class="btn btn-primary btn-sm mb-2"
    >
      <i class="bi bi-plus-circle"></i>
      ADD PLANS
    </sh-modal-form>
    <div class="table-responsive ">
      <sh-table
        :disable-mobile-responsive="true"
        pagination-style="loadMore"
        :hide-search="true"
        :end-point="getActionUrl('listPlans')"
        :headers="[
        'id',
        'name',
        'plan_type',
        'amount',
        {
          label: 'Is Popular',
          key: 'is_popular',
          callback:(row)=>row.is_popular ? 'Yes' : 'No'
        },
        'description',

      ]"
        :actions="{
         label: '&nbsp;',
         type: 'dropdown-horizontal',
         icon: 'bi bi-three-dots',
         actions:[
                  {
                      label: 'View',
                      icon: 'bi bi-eye',
                      path: '/billing/plans/{id}'
                  },
                  {
                      label: 'Edit',
                      icon: 'bi bi-pencil-square',
                      permission: 'billing.plans.add',
                      emits: editPlan,
                  },
                  {
                      label: 'Delete',
                      icon: 'bi bi-trash',
                      class:'',
                      permission: 'billing.plans.delete',
                      emits: deletePlan,
                  },

          ]

      }"

      >
      </sh-table>
    </div>
  </main>

</template>

<style scoped>

</style>
