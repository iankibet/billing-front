<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@iankibetsh/shframework'
const userStore = useUserStore()
userStore.setUser()
const { user } = storeToRefs(userStore)
const route = useRoute()
const router = useRouter()

const currentTheme = ref(localStorage.getItem('theme') || 'light');

onMounted(async () => {
  await userStore.setUser()
  if (route.path !== '/sh-auth' && !user.value) {
    router.push('/login')
  } else {
    // router.push('/admin')
  }
})

const toggleDarkMode = () => {
  if ( currentTheme.value === 'light') {
    currentTheme.value = 'dark';
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    currentTheme.value = 'light';
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}
</script>
<template>
  <main :class="currentTheme">
    <div class="container">
      <div class="row mt-3 float-end">
        <div class="div text-end d-flex align-items-center">
          <i class="bi bi-brightness-high "></i>
          <div class="form-check form-switch ms-3 me-4">
            <input
              class="form-check-input theme_toggle"
              type="checkbox"
              role="switch"
              :checked="currentTheme === 'dark'"
              id="flexSwitchCheckChecked"
              @click="toggleDarkMode"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="">
      <section class="section  min-vh-100 py-4 d-flex w-100 align-items-center">
        <div class="container mx-auto">
          <div class="row justify-content-center w-100 mx-auto">
            <div class="col-md-6 col-sm-12 ">
              <div class="d-flex justify-content-center pb-2">
                <router-link to="/" class="logos d-flex align-items-center w-auto">
<!--                   <img src="@/assets/images/pamoja-white.png"  width="200px" alt="">-->
                  <h4> Authentication</h4>
                </router-link>
              </div>
              <!-- End Logo -->

              <div class="bg-primary bg-opacity-10 px-3 rounded-2 shadow-sm mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <router-view />
                  </div>
                </div>
              </div>

<!--              <div class="credits">-->
<!--                MADE WITH LOVE-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  <!-- End #main -->
</template>

<style scoped></style>
