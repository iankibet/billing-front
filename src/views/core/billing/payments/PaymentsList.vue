<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import {ShTable} from '@iankibetsh/shframework'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const {getActionUrl, loading} = useStreamline('billing/payments/payments')
</script>

<template>
  <SkeletonFull v-if="loading" />
  <div class="table-responsive" v-else>
    <sh-table
      :end-point="getActionUrl('listPaidPayments', 'paid')"
      :headers="['id','bill_id','plan','months','amount','discount_applied','client', 'method','paid_at']"
      />
  </div>

</template>

<style scoped>

</style>
