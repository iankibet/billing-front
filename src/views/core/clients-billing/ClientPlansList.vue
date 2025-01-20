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
  shRepo.confirmAction('Do you want to select this plan?').then(res =>{
    if(res.isConfirmed){
      service.createUserPlan(planId).then((res) => {
        shRepo.showToast('Plan selected successfully', 'success')
        router.push('/checkout/'+ res.data.id)
      })
    }
  })
}
</script>

<template>

 <SkeletonFull v-if="loading && !plans" />
 <div class="container" v-else>
   <div class="row">
       <div class="col-md-4">
         <div class="card"  v-for="plan in plans" :key="plan.key">
           <div class="card-body" >
            <div class="text-center mb-3">
              <span v-if="plan.is_popular" class="badge badge-success">POPULAR</span>
              <p class="card-title fw-bold">{{ plan.name }}</p>
<!--              <p class="card-text">{{ plan.description }}</p>-->
              <h5 class="card-text">{{ plan.amount }}/month</h5>
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
