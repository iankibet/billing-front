<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { ref, watch } from 'vue'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import {ShTabs} from '@iankibetsh/shframework'
import AvailablePlansList from '@/views/core/clients-billing/AvailablePlansList.vue'

const {getActionUrl, loading, props} = useStreamline('clientBilling/userPlan')


const userPlan = ref(null)
watch(()=>props.userPlan, ()=>{
  if(props.userPlan){
    userPlan.value = props.userPlan
  }
})

</script>

<template>
  <SkeletonFull v-if="loading" />
  <div v-if="userPlan">

    <div class="d-flex gap-2 align-items-center">
      <h5> {{ userPlan.plan.name}} </h5>
      <router-link to="/available-plans" class="btn btn-warning btn-sm"><i class="bi bi-chevron-double-up"></i> Upgrade</router-link>
    </div>
    <sh-tabs
      base-url="/my-plan"
      :tabs="['plan', 'bills', 'payment_details']"
      :shared-data="{userPlan}"
    />
  </div>
  <AvailablePlansList v-else />


</template>

<style scoped>

</style>
