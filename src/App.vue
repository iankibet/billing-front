<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUserStore, ShQueryPopups, ShRoutePopups, useAppStore, shRepo } from '@iankibetsh/shframework'
import { storeToRefs } from 'pinia'
import AuthLayout from '@/views/layouts/AuthLayout.vue'
import AppLayout from '@/views/layouts/AppLayout.vue'
import GeneralLayout from '@/views/layouts/GeneralLayout.vue'
import { onMounted, ref } from 'vue'
import admin from '@/app/menus/admin.js'


const { user } = storeToRefs(useUserStore())
const appStore = useAppStore();
const {appData} = storeToRefs(appStore)

const route = useRoute()

const { refreshKey } = storeToRefs(useAppStore())
const internetConnection = ref(true);
const wasDisconnected = ref(false);
const detectBrowserTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

onMounted(() => {
  if(detectBrowserTheme() && !localStorage.getItem('theme') || localStorage.getItem('theme') === 'dark'){
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    // document.getElementsByTagName('body')[0].classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }


  document.title = appData.value.title ?? 'Pamoja ISP';

  window.shAxionInstance.interceptors.response.use(
    (response) => {
      if(response && response.data){
        const { status, message } = response.data;
        if (status === 'info') {
          shRepo.showToast(message, 'info', { timeout: 5000 });
        } else if (status === 'warning') {
          shRepo.showToast(message, 'warning', { timeout: 5000 });
        } else if (['danger', 'error', 'failed'].includes(status)) {
          shRepo.showToast(message, 'error', { timeout: 5000 });
        }else if (status === 'success' && message) {
          shRepo.showToast(message, 'success', { timeout: 5000 });
        }
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
})

</script>

<template>

  <auth-layout v-if="!user" />
  <template v-else-if="route.path.includes('sh-')">
    <general-layout>
      <template #body>
        <router-view />
      </template>
    </general-layout>
  </template>
  <general-layout :key="refreshKey" v-else />
  <sh-query-popups />
  <sh-route-popups />
</template>

<style scoped></style>
