<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import {useStreamline} from '@iankibetsh/vue-streamline'
import admin from '@/app/menus/admin.js'
import { useUserStore, shRepo, useAppStore } from '@iankibetsh/shframework'
import BreadCrumbs from '@/views/layouts/BreadCrumbs.vue'

const { getActionUrl, service } = useStreamline('users')
const theme = ref('');

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const router = useRouter()
const menus = ref([])
const menuForSupport = ref([])
const appStore = useAppStore()

const currentTheme = ref(localStorage.getItem('theme') || 'light');
const detectBrowserTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const menuCounts = ref(null)

onMounted(() => {
  menus.value = admin
  // menuForSupport.value = supportMenus
  // homeService.menuCounts().then((res) => {
  //   menuCounts.value = res
  //   appStore.setItem('menuCounts', res)
  // })

  currentTheme.value = localStorage.getItem('theme') || detectBrowserTheme;
  document.documentElement.setAttribute('data-bs-theme', currentTheme.value);
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


function toggleSidebar() {
  const width = document.documentElement.clientWidth
  if (width < 1200) {
    const elements = document.getElementsByTagName('body')
    elements[0].classList.toggle('toggle-sidebar')
  }
}
function closeToggleSidebar() {
  const width = document.documentElement.clientWidth
  if (width < 1200) {
    const elements = document.getElementsByTagName('body')
    elements[0].classList.remove('toggle-sidebar')
  }
}

function logoutUser() {
  userStore.logOut()
  shRepo.showToast('logout successful')
  router.push('/auth/login')
}
const unreadCount = ref('-')
</script>

<template>
 <div :class="currentTheme">
   <!--<h1>App Layout</h1>-->

   <!-- ======= Header ======= -->
   <header id="header" class="header fixed-top d-flex align-items-center" v-if="user">
     <div class="d-flex align-items-center justify-content-between">
       <router-link to="/" class="logo d-flex align-items-center">
        <h4 class="text-primary">DASHBOARD</h4>
       </router-link>
       <i class="bi bi-list toggle-sidebar-btn" @click="toggleSidebar"></i>
     </div>

     <nav class="header-nav ms-auto d-flex align-items-center">
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
       <ul class="d-flex align-items-center">
         <li class="nav-item dropdown pe-3">
           <a
             class="nav-link nav-profile d-flex align-items-center pe-0"
             href="#"
             data-bs-toggle="dropdown"
           >
             <span class="bi-person"></span>
             <span class="d-none d-md-block dropdown-toggle ps-2">{{ user.name }}</span> </a
           ><!-- End Profile Iamge Icon -->

           <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
             <li class="dropdown-header text-start">
               <router-link to="/user/profile" class="text-decoration-none text-muted">
                 <h6>{{ user.name }}</h6>
                 <p class="mb-0">{{ user.email }}</p>
                 <p class="mb-0">{{ user.role }}</p>
               </router-link>
             </li>
             <li>
               <hr class="dropdown-divider" />
             </li>

             <!--            <li>-->
             <!--              <router-link to="/user/profile" class="dropdown-item d-flex align-items-center">-->
             <!--                <i class="bi bi-person"></i>-->
             <!--                <span>My Profile</span>-->
             <!--              </router-link>-->
             <!--            </li>-->
             <!--            <li>-->
             <!--              <hr class="dropdown-divider" />-->
             <!--            </li>-->
             <!--            <li>-->
             <!--              <hr class="dropdown-divider" />-->
             <!--            </li>-->

             <li>
               <a @click="logoutUser" class="dropdown-item d-flex align-items-center" href="#">
                 <i class="bi bi-box-arrow-right"></i>
                 <span>Sign Out</span>
               </a>
             </li>
           </ul>
           <!-- End Profile Dropdown Items -->
         </li>
         <!-- End Profile Nav -->
       </ul>
     </nav>
     <!-- End Icons Navigation -->
   </header>
   <!-- End Header -->

   <!-- ======= Sidebar ======= -->
   <aside id="sidebar" class="sidebar">
     <ul class="sidebar-nav" id="sidebar-nav" >
       <template v-for="menu in menus" :key="menu.permission" >
         <li
           class="nav-item"
           v-if="user.isAllowedTo(menu.permission) && menu.type === 'single'"
         >
           <router-link class="nav-link collapsed" :to="menu.path">
             <i :class="menu.icon"></i>

             <span class="d-flex justify-content-between gap-3  w-100 align-items-center">
               <span>{{ menu.label }}</span>
               <small class="menu_count small bg-primary-subtle rounded-1 py-0 px-1"  v-if="menuCounts && Object.keys(menuCounts).includes(menu.permission) && menuCounts[menu.permission] > 0 "> {{ menuCounts[menu.permission]}}  </small>
             </span>
           </router-link>
         </li>
         <li class="nav-item" v-if="user.isAllowedTo(menu.permission) && menu.type === 'many'">
           <a
             class="nav-link collapsed text-decoration-none"
             :data-bs-target="'#menu_' + menu.permission"
             data-bs-toggle="collapse"
             href="#"
           >
             <i :class="menu.icon"></i><span>{{ menu.label }}</span
           ><i class="bi bi-chevron-down ms-auto"></i>
           </a>
           <ul
             :id="'menu_' + menu.permission"
             class="nav-content collapse"
             data-bs-parent="#sidebar-nav"
           >
             <template v-for="child in menu.children" :key="child.permission">
               <li
                 @click="toggleSidebar"
                 v-if="user.isAllowedTo(menu.permission + '.' + child.permission)"
               >
                 <router-link :to="child.path">
                   <i class="bi bi-circle text-decoration-none"></i>
                   <span class="d-flex justify-content-between gap-3 fw-200 w-100 align-items-center">
                     <span>{{ child.label }}</span>
                     <small class="menu_count small bg-primary-subtle rounded-1 py-0 px-1"  v-if="menuCounts && Object.keys(menuCounts).includes(child.permission) && menuCounts[menu.permission] > 0 "> {{  menuCounts[child.permission]}}  </small>
                   </span>
                 </router-link>
               </li>
             </template>
           </ul>
         </li>
       </template>

     </ul>
   </aside>
   <!-- End Sidebar-->

   <main id="main" class="main vh-100"  @click="closeToggleSidebar">
     <div class="mobile_padding">
       <bread-crumbs />
       <router-view />
     </div>
   </main>
   <!-- End #main -->
 </div>
</template>

<style scoped>
#footer {
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 20px;
  width: 90%;
}
.menu_count{
  font-size: 0.8rem;
}
.fw-200{
  font-weight: 300;
}
.form-switch{
  font-size: 12px;
}
</style>
