<script setup>
import { ref } from 'vue'
import { shRepo } from '@iankibetsh/shframework'

const props = defineProps(['item', 'field', 'name'])
</script>

<template>
    <span> {{ shRepo.formatDate(item[field])}}</span>
</template>

<style scoped>

</style>