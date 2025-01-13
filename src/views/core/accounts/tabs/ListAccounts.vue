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


const route = useRoute();
const status = route.params.status;
const {getActionUrl, loading} = useStreamline('accounts' )

onMounted(() => {

})

</script>

<template>
  <CardLayout v-if="!loading">
    <div class="">
      <sh-table
        :disable-mobile-responsive="true"
        :end-point="getActionUrl('listAccounts', status)"
        :headers="['id',
            {label: 'account_no', key: 'account_no', callBack: (row) => `<a href='/accounts/view/${row.id}'> ${row?.account_no ?? '--'}</a>`},
            {label: 'user', key: 'user', callBack: (row) => `<a href='/accounts/view/${row.user_id}'> ${row?.client ?? '--'}</a>`},
            'expiry_date',
            {label: 'expiry_status', key: 'expiry_status', callBack: (row) => formatStatus(row.expiry_status)},
            {label: 'status', key: 'status', callBack: (row) => formatStatus(row.status)},
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