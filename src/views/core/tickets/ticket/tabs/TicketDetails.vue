<script setup>
import { computed, ref } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { formatDateTime, formatPriority, formatStatus } from '../../../../../utils/helpers.js'
import { shRepo } from '@iankibetsh/shframework'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const props = defineProps(['sharedData'])
const ticket = computed(() => props.sharedData?.ticket)

</script>

<template>
  <CardLayout v-if="ticket && ticket.id">
    <h6 class="h6"> #{{ticket.id}} {{ ticket.name}}</h6>
    <div class="d-block flex-wrap">
      <p class="d-flex col-12 gap-2 col-md-6 mb-1">
        <span class="t_title">Account:</span>
        <router-link :to="`/accounts/view/${ticket?.account_id}`">
          {{ ticket?.account?.account_no }}
        </router-link>
      </p>
    </div>

    <div class="d-block gap-2">
      <p class="d-flex gap-2 col-12 col-md-6 mb-1">
        <span class="t_title">Status:</span>
        <span v-html="formatStatus(ticket.status)"></span>
      </p>
      <p class="d-flex gap-2 col-12 col-md-6 mb-1">
        <span class="t_title">Priority:</span>
        <span v-html="formatPriority(ticket.priority)"></span>
      </p>
    </div>

    <div class="d-block gap-2">
      <p class="d-flex gap-2 col-12 col-md-6 mb-1">
        <span class="t_title">Verify Support Distance:</span>
        <span>{{ ticket.verify_distance ? 'Yes' : 'No' }}</span>
      </p>

    </div>

    <div class="d-block gap-2">
      <p class="d-flex col-12 gap-2 col-md-6 mb-1">
        <span class="t_title">Team Lead:</span>
        <router-link :to="`/users/view/${ticket?.team_lead?.id}`">
          {{ ticket?.team_lead?.name }}
        </router-link>
      </p>
      <p class="d-flex col-12 gap-2 col-md-6 mb-1">
        <span class="t_title">Created by:</span>
        <router-link :to="`/users/view/${ticket?.created_by?.id}`">
          {{ ticket?.created_by?.name }}
        </router-link>
      </p>

      <p class="d-flex  col-12 gap-2 col-md-6 mb-1">
        <span class="t_title">Created at:</span>
        <span>{{ formatDateTime(ticket?.created_at) }}</span>
      </p>
      <p class="d-flex gap-2 col-12 col-md-6 mb-1">
        <span class="t_title">Scheduled start at:</span>
        <span>{{ formatDateTime(ticket?.start_at) }}</span>
      </p>

      <p class="d-flex gap-2 col-12 col-md-6 mb-1">
        <span class="t_title">Started at:</span>
        <span>{{formatDateTime(ticket?.assignment?.started_at) }}</span>
      </p>
    </div>
    
    <template v-if="ticket.description || ticket?.assignment?.instructions">
      <div class="accordion" id="ticketCollapse mt-3">
        <template v-if="ticket.description">
          <div class="accordion-item">
            <h2 class="accordion-header" id="descriptionHeading">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ticketDescription" aria-expanded="true" aria-controls="ticketDescription">
               Ticket Description
              </button>
            </h2>
            <div id="ticketDescription" class="accordion-collapse collapse show" aria-labelledby="descriptionHeading" data-bs-parent="#ticketCollapse">
              <div class="accordion-body">
                {{ ticket.description}}
              </div>
            </div>
          </div>
        </template>
        <template v-if="ticket?.assignment?.instructions">
          <div class="accordion-item mt-3">
            <h2 class="accordion-header" id="instructionsHeading">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#assignmentInstructions" aria-expanded="false" aria-controls="assignmentInstructions">
                Assignment Instructions
              </button>
            </h2>
            <div id="assignmentInstructions" class="accordion-collapse collapse" aria-labelledby="instructionsHeading" data-bs-parent="#ticketCollapse">
              <div class="accordion-body">
                {{ ticket?.assignment?.instructions}}
              </div>
            </div>
          </div>
        </template>
    </div>
    </template>


  </CardLayout>
  <SkeletonFull v-else />

</template>

<style scoped>
.ttitle{
  opacity: .8;
}
.t_title{
  opacity: .8;
  //font-weight: bold;
  margin-right: 10px;
}

</style>