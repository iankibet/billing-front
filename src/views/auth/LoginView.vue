<script setup>
import CardLayout from '@/views/Layouts/CardLayout.vue'
import {
  ShAutoForm,
  useUserStore,
  shRepo,
  ShModal,
  shApis,
  shStorage,
  ShCanvas, useAppStore
} from '@iankibetsh/shframework'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PasswordInput from '@/components/form-components/PasswordInput.vue'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const appStore = useAppStore()

const userLoggedIn = (res) => {
  userStore.setAccessToken(res.token)
  userStore.setUser()
  shRepo.showToast('Login successful', 'success')
  useAppStore().setItem('title', 'Dashboard')
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 100)
}
const fields = [
  {
    field: 'email',
    label: 'Email',
  },
  {
    field: 'password',
    component: PasswordInput
  }
]
</script>

<template>
  <!--  <CardLayout>-->
  <div class="py-2 pt-3">
    <sh-auto-form
      :fields="fields"
      action="/auth/login"
      submit-btn-class="btn app-yellow-btn btn-block mt-3 mb-4"
      :successCallback="userLoggedIn"
    />
    <p class="text-center mt-3 d-flex justify-content-between">
      <router-link to="/forgot-password"  class="not-link"> Forgot password? </router-link>
      <span> | </span>
      <router-link  to="/register" class="not-link"
      >No account? Register
      </router-link>
    </p>
  </div>

  <!--  </CardLayout>-->
</template>

<style scoped>

</style>
