<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { useStreamline } from '@iankibetsh/vue-streamline'
import SkeletonCard from '@/views/layouts/skeletons/SkeletonCard.vue'
const {getActionUrl, service: ticketsService, loading} = useStreamline('tickets' )

const props = defineProps(['sharedData'])
const ticket = ref(props.sharedData.ticket)

const client = ref(ticket.value.user)
const account = ref(ticket.value.account)

</script>


<template>

  <CardLayout v-if="!loading && client">
    <div class="div">
      <fieldset class="border p-2 rounded-3">
        <legend class="h5 text-primary float-none px-3 w-auto">Client Details</legend>
        <div class="row">
          <div class="col-md-6">
            <p><span class="fw-bold">Name:</span>   <router-link :to="'/users/view/' + client.id">{{ client.name }}</router-link></p>
            <p><span class="fw-bold">Email:</span> {{client.email}}</p>
            <p><span class="fw-bold">Phone:</span> <a :href="`tel:${client.phone}`"> +{{client.phone}} </a></p>
            <p v-if="client.phone2"><span class="fw-bold">Phone 2:</span>  <a :href="`tel:${client.phone}`"> {{client.phone2}} </a></p>
            <router-link :to="`/users/view/${client.id}`" class="btn btn-dark btn-sm my-3 me-2"><i class="bi bi-eye"></i> View Client</router-link>
            <a :href="`https://maps.google.com/?q=${account.latitude},${account.longitude}&z=8`" target="_blank" class="btn btn-dark btn-sm my-3"><i class="bi bi-geo-alt"></i> Open Location in Maps  </a>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="card-body rounded-sm mt-4">
      <h6 class="fw-bold"> Account Location </h6>
      <iframe
        width="100%"
        class="rounded-3 shadow-sm p-2"
        height="450"
        frameborder="0" style="border:0"
        :src="`https://maps.google.com/maps?q=${account.latitude},${account.longitude}&z=17&output=embed`" allowfullscreen>
      </iframe>
    </div>
  </CardLayout>
  <SkeletonCard v-else />

</template>

<style scoped>
.ttitle{
  font-weight: bold;
}
.col-md-6 p{
  margin-bottom: 5px;
}
 p span.fw-bold{
   margin-right: 10px;
 }
</style>