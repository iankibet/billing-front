<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { ref, watch } from 'vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { shRepo } from '@iankibetsh/shframework'
import { useRouter } from 'vue-router'
const {getActionUrl, service, loading,props} = useStreamline('clientBilling/billing')
const plans = ref({});
const router = useRouter();
watch(()=>props.plans, ()=>{
  if(props.plans){
    plans.value = props.plans
  }
})

const createUserPlan = (planId) => {
  service.createUserPlan(planId).then((res) => {
    if(res.status == 'info'){
      // shRepo.showToast(res.message, 'info')
      router.push('/my-plan')
      return
    }
    shRepo.showToast('Plan selected successfully', 'success')
    router.push('/checkout/'+ res.data.id)
  })
}
</script>

<template>

 <SkeletonFull v-if="loading && !plans" />
 <div class="" v-else>
   <div class="row">
       <div class="col-md-4 " v-for="plan in plans" :key="plan.key">
         <div class="card h-100">
           <div class="card-body" >
            <div class="text-center">
              <span v-if="plan.is_popular" class=" badge bg-success ">Popular</span>
              <p class="card-title fw-bold">{{ plan.name }}</p>
<!--              <p class="card-text">{{ plan.description }}</p>-->
              <h5 class="card-text">{{ plan.amount }}/month</h5>
              <p v-if="plan.annual_discount > 0" class="mb-1 text-warning">
                <i class="bi-tags"></i> Annual Discount {{ plan.annual_discount}}<span v-if="plan.annual_discount_type=='percentage'">%</span>
              </p>
              <button class="btn btn-sm btn-primary" @click="createUserPlan(plan.id)"> Get Started</button>
            </div>
             <hr>
             <ul>
               <li v-for="feature in plan.billing_features" :key="feature.id">
                 {{ feature.name }}
               </li>
             </ul>

           </div>

         </div>
       </div>
   </div>
 </div>

</template>

<style scoped>

</style>
