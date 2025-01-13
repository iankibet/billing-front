<script setup>
import { useStreamline } from '@iankibetsh/vue-streamline'
import { ShTabs } from '@iankibetsh/shframework'

const {getActionUrl} = useStreamline('accounts')

</script>

<template>
  <div class="">
    <sh-tabs
      :tabs="['active', 'expired' ]"
      base-url="/accounts"
      :shared-data="{}"
      :active-tab="active"
      :tab-counts="getActionUrl('countAccounts')"
    />

  </div>
</template>

<style scoped>

</style>