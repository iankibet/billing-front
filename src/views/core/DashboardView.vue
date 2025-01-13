<script setup>

import AdminDash from '@/views/core/AdminDash.vue'
import TechnicianDash from '@/views/core/TechnicianDash.vue'
</script>

<template>
  <div v-if-user-can="'dashboard.admin_dash'" >
    <admin-dash />
  </div>
  <div v-if-user-can="'dashboard.technician_dash'">
    <technician-dash />
  </div>
</template>

<style scoped>

</style>