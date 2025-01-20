<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { shApis, shRepo } from '@iankibetsh/shframework'
import router from '@/router/index.js'


const route  = useRoute();
const billId = route.params.id
const {getActionUrl, service, loading,props} = useStreamline('clientBilling/billing',billId )
const {getActionUrl: getPaymentMethodsUrl, service:paymentMethodsService} = useStreamline('billing/paymentMethods/paymentMethods')

const bill = ref(null)
const paymentMethods = ref([])
const selectedMethodId = ref(null)

watch(()=>props.bill, ()=>{
  if(props.bill){
    bill.value = props.bill
  }
})

const getPaymentMethods = ()=>{
  paymentMethodsService.getPaymentMethods().then((methods)=>{
    paymentMethods.value = methods
    if(methods.length > 0){
      selectedMethodId.value = methods[0].id
    }
  })
}
onMounted(()=>{
  getPaymentMethods()
})

const proceedToPayment = ()=>{
  const payLoad = {
    bill_id: bill.value.id,
    payment_method_id: selectedMethodId.value
  }
  shApis.doPost(getActionUrl('proceedToPayment'), payLoad).then((response)=>{
    if(response.status === 200){
      shRepo.showToast(response.data.message)
      router.push('/my-bills')
    }
  })
}

</script>

<template>
 <SkeletonFull v-if="loading && !bill" />
  <div class="row" v-else>
    <div class="col-md-4">
      <CardLayout >
        <h4>Bill ID #{{bill.id}}</h4>
        <p>Plan : {{bill.plan.name}}</p>
        <p>Amount : {{bill.amount}}</p>
        <p>Months : {{bill.months}}</p>
      </CardLayout>
    </div>
    <div class="col-md-4">
      <CardLayout v-if="paymentMethods.length > 0">
        <h6>Choose Your payment method</h6>
       <div class="methods">
         <div class="form-check py-2" v-for="(method, index) in paymentMethods" :key="method.id">
           <input class="form-check-input"  type="radio" :value="method.id" v-model="selectedMethodId"  :id="method.id">
           <label class="form-check-label" :for="method.id">
             {{ method.name}}
           </label>
         </div>
       </div>
        <button class="btn btn-success" @click="proceedToPayment">Proceed to Payment</button>
      </CardLayout>
      <div v-else class="alert alert-warning text-center">
        No Payment method found!
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>
