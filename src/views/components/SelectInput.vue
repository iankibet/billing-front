<script setup>
import { ref } from 'vue'
import { shRepo } from '@iankibetsh/shframework'

const props = defineProps(['item', 'field', 'name'])
</script>

<template>
  <input type="checkbox" value="{{ field }}">
</template>

<style scoped>

</style>