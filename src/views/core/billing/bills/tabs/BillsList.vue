<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import {ShTable} from '@iankibetsh/shframework'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { useRoute } from 'vue-router'

const route = useRoute();
const {getActionUrl, loading} = useStreamline('billing/bills/bills')

const status = route.params.status


</script>

<template>
  <SkeletonFull v-if="loading" />
  <div class="table-responsive" v-else>
    <sh-table :end-point="getActionUrl('listBills', status)"
              :headers="['id', 'amount','months', 'status',  'payment_status','from', 'to', 'created_at']"
              has-range="true"
              :actions="{
                label:'&nbsp',
                actions:[
                  {label:'View', url:'/billing/bills/view', icon:'bi-eye', class:'btn btn-dark btn-xs', path:'/billing/bills/bill/{id}'},
                ]
              }"
    />
  </div>

</template>

<style scoped>

</style>
