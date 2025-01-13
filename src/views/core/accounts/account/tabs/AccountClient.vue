<script setup>

import { formatStatus } from '@/utils/helpers.js'
import SkeletonCard from '@/views/layouts/skeletons/SkeletonCard.vue'
import { ref } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'

const props = defineProps(['sharedData'])
const account = ref(props.sharedData.account)
const user = ref(account.value.user)
</script>

<template>
  <CardLayout v-if="user.name && !loading">
    <h6 class="h5 text-primary">Client Details</h6>
    <div class="ms-1" >
        <p class="mb-2"><span class="fw-bold">Name:</span> {{user.name ?? '--'}}</p>
        <p class="mb-2"><span class="fw-bold">Email:</span> {{user.email ?? '--'}}</p>
        <p class="mb-2"><span class="fw-bold">Phone:</span> {{user.phone ?? '--'}}</p>
        <p class="mb-2"><span class="fw-bold">Phone 2:</span> {{ user.phone2 ?? '--'}}</p>
        <router-link :to="`/users/view/${user.id}`" class="btn btn-dark btn-sm my-3"><i class="bi bi-eye"></i> View Client</router-link>
    </div>

  </CardLayout>
  <SkeletonCard v-else />
</template>

<style scoped>

</style>