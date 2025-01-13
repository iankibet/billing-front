<script setup>
import { ref, useId } from 'vue'
import { ShModalForm, shRepo, ShTable, useAppStore, useUserStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { storeToRefs } from 'pinia'

const {getActionUrl} = useStreamline('billing/features')
const billingFeature = ref(null)
const storeFeatureModalId = useId();
const appStore = useAppStore()
const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const billingFeatureStored = (res) => {
  shRepo.showToast(res.message, 'success', );
  appStore.refresh(2000)
}
const deleteBillingFeature = billingFeature => {
  shRepo.runPlainRequest(getActionUrl('deleteBillingFeature', billingFeature.id)).then((res) => {
    shRepo.showToast('Feature deleted successfully', 'success')
    appStore.refresh(2000)
  })
}
const editBillingFeature = (row) => {
  billingFeature.value = row
  if (billingFeature.value) {
    shRepo.showModal(storeFeatureModalId)
  }
}

const fields = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'feature_type',
    type:'select',
    label: 'Feature Type',
    required: 'true',
    options: [
      {label: 'Boolean', value: 'boolean'},
      {label: 'Text', value: 'text'}
    ]
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
      :modal-id="storeFeatureModalId"
      modal-title="Features  Form "
      :fields="fields"
      :current-data="billingFeature"
      :action="getActionUrl('storeFeature')"
      :successCallback="billingFeatureStored"
      class="btn btn-primary btn-sm mb-2"
    >
      <i class="bi bi-plus-circle"></i>
      ADD FEATURE
    </sh-modal-form>
    <div class="table-responsive ">
      <sh-table
        :disable-mobile-responsive="true"
        pagination-style="loadMore"
        :hide-search="true"
        :end-point="getActionUrl('listFeatures')"
        :headers="[
        'id',
        'name',
        'amount',
        'feature_type',
        'description',
      ]"
        :links="{
        name: {
          url: '/billing/features/{id}',
          }
        }"

        :actions="{
         label: '&nbsp;',
         type: 'dropdown-horizontal',
         icon: 'bi bi-three-dots',
         actions:[
                  {
                      label: 'View',
                      icon: 'bi bi-eye',
                      path: '/billing/features/{id}'
                  },
                  {
                      label: 'Edit',
                      icon: 'bi bi-pencil-square',
                      permission: 'billing.features.add',
                      emits: editBillingFeature,
                  },
                  {
                      label: 'Delete',
                      icon: 'bi bi-trash',
                      class:'',
                      permission: 'billing.features.delete',
                      emits: deleteBillingFeature,
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
