<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import { ref } from 'vue'
import SkeletonList from '@/views/layouts/skeletons/SkeletonList.vue'
import { useRoute } from 'vue-router'
import { ShTabs } from '@iankibetsh/shframework'
const route = useRoute();
const {getActionUrl, service: usersService, loading:userLoadiing} = useStreamline('users', route.params.id )

const user = ref(null)

</script>

<template>

  <template v-if="usersService.user">

    <div class="mt-3">
      <sh-tabs
        :tabs="['details' ]"
        :shared-data="usersService.user"
        :base-url="`/users/view/${usersService.user.id}`"
      />

    </div>

  </template>
  <SkeletonList v-if="userLoadiing"  />

</template>


<style scoped>

</style>
