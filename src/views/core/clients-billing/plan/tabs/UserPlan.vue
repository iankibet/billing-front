<script setup>
import CardLayout from '@/views/layouts/CardLayout.vue'

const myProps = defineProps(['sharedData'])
const userPlan = myProps.sharedData.userPlan
</script>

<template>

 <CardLayout v-if="userPlan">
   <div >
     <h5> {{ userPlan.plan.name}}</h5>
     <p>{{ userPlan.plan.description }}</p>
     <p> ${{userPlan.amount }}/<small>month</small></p>
   </div>
   <div cla>
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
