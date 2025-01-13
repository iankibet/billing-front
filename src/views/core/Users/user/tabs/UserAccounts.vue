<script setup>
import { onMounted, ref, useId } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import {useStreamline} from '@iankibetsh/vue-streamline'
import { useRoute } from 'vue-router'
import SkeletonCard from '@/views/layouts/skeletons/SkeletonCard.vue'
import { ShModalForm, ShAutoForm, shRepo, ShTable } from '@iankibetsh/shframework'
import PasswordInput from '@/components/form-components/PasswordInput.vue'
import DateTimeInput from '@/components/form-components/DateTimeInput.vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { formatStatus } from '@/utils/helpers.js'


const props = defineProps(['sharedData'])
const user = ref(props.sharedData)
const route = useRoute();
const userId = route.params.id;
const newAccountModalId = useId();
const {getActionUrl, service: userService, loading} = useStreamline('users', userId )
const {getActionUrl : accountActionUrl} = useStreamline('accounts' )

onMounted(() => {
  if(!user.value.name){
    userService.getUser(userId).then((res) => {
      user.value = res
    })
  }
})

const accountFields = [
  {
    name: 'plan_id',
    label: 'Plan',
    type: 'select',
    options: [
      {label: 'Plan 1', value: 1},
      {label: 'Plan 2', value: 2},
      {label: 'Plan 3', value: 3},
    ]
  },
  {
    name: 'expiry_date',
    label: 'Expiry Date',
    component: DateTimeInput
  },
]

const operationSuccess = (res) => {
  if (res.status === 'success') {
    shRepo.showToast('Update successfully', 'success')
  }
}

</script>

<template>
  <CardLayout v-if="!loading">
    <div class="">
      <div class="mb-3">
        <div class="actions d-flex align-items-center gap-2 pb-2">
          <div class="" v-if-user-can="'accounts.write'">
            <sh-modal-form
              class="btn btn-sm btn-primary "
              modal-title=" User Account Form"
              :modal-id="newAccountModalId"
              :fields="accountFields"
              :action="getActionUrl('storeAccount', userId)"
              @success="operationSuccess"
            >
              <i class="bi bi-plus-lg"></i>

              ADD NEW ACCOUNT
            </sh-modal-form>
          </div>
        </div>
      </div>

      <sh-table
        :disable-mobile-responsive="true"
        :end-point="accountActionUrl('listUserAccounts', userId)"
        :headers="['id',
            {label: 'account_no', key: 'account_no', callBack: (row) => `<a href='/accounts/view/${row.id}'> ${row?.account_no ?? '--'}</a>`},
            'expiry_date',
            {label: 'expiry_status', key: 'expiry_status', callBack: (row) => formatStatus(row.status)},
           'created_at']"
        :has-range="true"
        :actions="{
        label: 'Actions',
        actions: [
          {
            label: 'View',
            path: '/accounts/view/{id}',
            class: 'btn btn-xs btn-dark me-1 ',
            icon: 'bi bi-eye'
          }
          ]
        }"
      >
      </sh-table>
    </div>
  </CardLayout>
  <SkeletonFull v-else />

</template>

<style scoped>
.fw-bold{
  margin-right: 5px;
}
</style>