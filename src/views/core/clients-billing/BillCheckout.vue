<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { computed, onMounted, ref, watch } from 'vue'
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
const months = ref(1)
const selectedMonthOption = ref(1)
const newAmount = computed(()=>{
  return bill.value.amount * months.value
})
const monthOptions = [1,6,12]

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
    payment_method_id: selectedMethodId.value,
    months: selectedMonthOption.value
  }
  shApis.doPost(getActionUrl('proceedToPayment'), payLoad).then((response)=>{
    if(response.status === 200){
      shRepo.showToast(response.data.message)
      router.push('/my-plan')
    }
  })
}

const amountAfterDiscount = (months) => {
  if(months > 1) {
    if (bill.value.plan.annual_discount <= 0) {
      return bill.value.amount * months;
    } else {
      if (bill.value.plan.annual_discount_type === 'percentage') {
        return  (bill.value.amount * months) - ((bill.value.amount * months) * (bill.value.plan.annual_discount / 100))
      } else {
        return (bill.value.amount * months) - (bill.value.plan.annual_discount * months)
      }
    }
  }
  return  bill.value.amount
}
const calculateDiscount = (months) => {
  if (months > 1 && bill.value.plan.annual_discount > 0) {
    if (bill.value.plan.annual_discount_type === 'percentage') {
      return (
        (bill.value.amount * months * bill.value.plan.annual_discount) / 100
      );
    } else {
      return bill.value.plan.annual_discount * months;
    }
  }
  return 0;
};

const monthsAmountAfterDiscount = computed(()=>{
  return monthOptions.map((months)=>({
    months,
    amount: amountAfterDiscount(months),
    discount: calculateDiscount(months)
  }))
})

const totalAmount = computed(()=>{
  return monthsAmountAfterDiscount.value.find((month)=> month.months === selectedMonthOption.value).amount
})

</script>

<template>
 <SkeletonFull v-if="loading && !bill" />
  <div class="row" v-else>

    <div class="col-md-4">
      <CardLayout >
        <h4>Bill ID #{{bill.id}}</h4>
        <p>Plan : {{bill.plan.name}}</p>
        <p>Amount : ${{bill.amount}}</p>
        <p>Months : {{bill.months}}</p>
      </CardLayout>
    </div>
    <div class="col-md-4">
      <CardLayout v-if="paymentMethods.length > 0">
        <h6>Choose Your payment method</h6>
        <hr class="mt-0">
        <div class="choose-months">
          <p class="mb-0 fw-bold text-secondary">Select Number of Months</p>
          <div class="form-check py-2" v-for="months in monthsAmountAfterDiscount" :key="months.months">
            <input class="form-check-input"  type="radio" :value="months.months" v-model="selectedMonthOption" :id="months.months" >
            <label class="form-check-label" :for="months.months">
              {{months.months}} Month - ${{months.amount}}  <span class="text-warning" v-if="months.discount > 0">  -  SAVE ${{months.discount}})</span>
            </label>
          </div>
        </div>

       <div class="methods mt-4">
         <p class="text-secondary fw-bold mb-0" >Choose your preferred payment Method</p>
         <div class="form-check py-2" v-for="(method, index) in paymentMethods" :key="method.id">
           <input class="form-check-input"  type="radio" :value="method.id" v-model="selectedMethodId"  :id="method.id">
           <label class="form-check-label" :for="method.id">
             {{ method.name}}
           </label>
         </div>
       </div>
        <div class="d-flex gap-3 align-items-center mt-3">
          <h5 class="fw-light">Total amount: </h5>
          <strong class="text-primary"> ${{ totalAmount}}</strong>
        </div>
        <button class="btn btn-success" @click="proceedToPayment">Proceed to pay</button>
      </CardLayout>
      <div v-else class="alert alert-warning text-center">
        No Payment method found!
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>
