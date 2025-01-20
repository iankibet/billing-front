<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CardLayout from '@/views/layouts/CardLayout.vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const payment = ref(null)
const route = useRoute();
const paymentId = route.query.id

const {service, loading} = useStreamline('clientBilling/billing')

const fetchReceipt = ()=>{
  service.getPaymentReceipt(paymentId).then((response)=>{
    payment.value = response.data
  })
}
onMounted(()=>{
  fetchReceipt()
})
</script>

<template>
  <SkeletonFull v-if="loading " />
  <div class="" v-if="payment">
    <div class="receipt">
      <p>Bill ID : #{{payment.bill_id}}</p>
      <p>Amount : {{payment.amount}}</p>
      <p>Payment Method : {{payment.payment_method.name}}</p>
      <p>Payment Status : {{payment.status}}</p>
      <p>Paid At : {{payment.paid_at}}</p>
      <p>Reference Code: {{payment.reference}}</p>
    </div>
  </div>
  <p v-else> No Payment </p>


</template>

<style scoped>
.receipt p{
  margin-bottom: 5px;
}
</style>
