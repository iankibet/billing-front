<script setup>

import { ShTabs, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute();
const accountId = route.params.id;
const {service, loading} = useStreamline('accounts', accountId )
const appStore = useAppStore();
const  {appData} = storeToRefs(appStore)
onMounted(() => {
 appStore.setItem('title', 'Account Title')
})
</script>

<template>

  <template v-if="!loading && service.account">
    <div class="mt-3">
      <sh-tabs
        :tabs="['details','location', 'client' ]"
        :shared-data="{account: service.account}"
        :base-url="`/accounts/view/${service.account.id}`"
        :tab-counts="tabCounts"
      />
    </div>
  </template>
  <SkeletonFull v-else />

</template>

<style scoped>

</style>