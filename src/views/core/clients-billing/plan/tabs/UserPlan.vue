<script setup>
import CardLayout from '@/views/layouts/CardLayout.vue'

const myProps = defineProps(['sharedData'])
const userPlan = myProps.sharedData.userPlan
</script>

<template>

 <CardLayout v-if="userPlan">
   <div >

     <p class="mb-0">Status: {{userPlan.status}} </p>
     <h5> {{ userPlan.plan.name}} </h5>
     <p>{{ userPlan.plan.description }}</p>
    <div class="d-flex gap-3 ">
      <p> ${{userPlan.amount }}/<small>month</small></p>
      <p> <router-link :to="`/checkout/${userPlan.currentBill.id}`" v-if="userPlan.status != 'active'" class="bi-wallet btn btn-sm btn-primary"> Pay Now </router-link></p>
    </div>

   </div>
   <div >
     <h6>Features</h6>
     <hr class="my-1 w-25">
      <ul>
        <li v-for="feature in userPlan.plan.billing_features" :key="feature.id">
          <span class="">{{ feature.name }}</span>
          <span class="fw-bold" v-if="feature.pivot.value"> - {{ feature.pivot.value }}</span>
        </li>
      </ul>

   </div>
 </CardLayout>

</template>

<style scoped>

</style>
