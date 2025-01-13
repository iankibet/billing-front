<script setup>
import CardLayout from '@/views/layouts/CardLayout.vue'
import { onMounted, ref } from 'vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { formatAnyDate, formatStatus, normalDateTime, numberFormat } from '../../../../../utils/helpers.js'
import DateTimeInput from '@/components/form-components/DateTimeInput.vue'
import { ShModalForm, shRepo, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'

const {service, getActionUrl, loading} = useStreamline('accounts' )
const {getActionUrl:accountGroupActionUrl} = useStreamline('accountGroups' )
const appStore = useAppStore();

const props = defineProps(['sharedData'])
const account = ref(props.sharedData.account)
onMounted(() => {
  if(!account.value.account_no){
    account.value = props.sharedData
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
  {
    name: 'account_group_id',
    type: 'select',
    label: 'Account Group',
    url: accountGroupActionUrl('listAccountGroups', 'active'),
    suggest: true
  }
]

const operationSuccess = (res) => {
  if (res.status === 'success') {
    shRepo.showToast('Update successfully', 'success')
  }
  appStore.refresh(2000)
}
</script>

<template>
 <CardLayout v-if="account.account_no">
   <div class="mb-3" v-if-user-can="'accounts.write'">
     <sh-modal-form
       class="btn btn-sm btn-primary "
       modal-title=" User Account Form"
       :modal-id="newAccountModalId"
       :current-data="account"
       :fields="accountFields"
       :action="getActionUrl('storeAccount', account.user_id)"
       @success="operationSuccess"
     >
       <i class="bi bi-pencil-square"></i>

       EDIT ACCOUNT
     </sh-modal-form>
   </div>
  <h5 class="">Account No:  {{ account.account_no}}</h5>
  <div class="d-block flex-wrap">
    <p class="mb-2"><span class="t_title">Expires  at:</span><span>{{ normalDateTime(account.expiry_date) }}</span></p>
    <p class="mb-2 d-flex"><span class="t_title">Status  :</span><span v-html="formatStatus(account.status)"></span></p>
    <p class="mb-2"><span class="t_title">Account Balance  :</span><span>{{ numberFormat(account.account_balance) }}</span></p>
    <p class="mb-2"><span class="t_title">Account Group  :</span><span>{{ account?.account_group?.name }}</span></p>
    <p class="mb-2"><span class="t_title">Created by:</span><router-link :to="`/users/view/${account?.created_by?.id}`"> {{ account?.created_by?.name }} </router-link></p>
    <p class="mb-2"><span class="t_title">Created at:</span><span>{{ normalDateTime(account.created_at) }}</span></p>
    <p class="mb-2"><span class="t_title">Location </span><span>{{ account.location }}</span></p>

  </div>

 </CardLayout>
  <SkeletonFull v-else />
</template>

<style scoped>
.t_title{
  margin-right: 10px;
  font-weight: bold;
}
</style>