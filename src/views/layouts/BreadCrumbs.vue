<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const breadcrumbs = ref([])
const route = useRoute()

watch(()=>route.path, () => {
  updateBreadcrumbs(route)
})
function updateBreadcrumbs(route) {
  breadcrumbs.value = []
  const crumbs = ref(route.meta.breadcrumbs??[])
  if(!crumbs.value.length){
    // check if route is child
    route.matched.forEach((matchedRoute) => {
      if (matchedRoute.path){
        const label = matchedRoute.path.split('/').pop()
        const path = matchedRoute.components ? matchedRoute.path : matchedRoute.redirect
        crumbs.value.push({
          label,
          path
        })
      }
    })
  }
  breadcrumbs.value = crumbs.value.map((breadcrumb, index) => {
    let path = breadcrumb.path
    let label = breadcrumb.label
    const params = route.params
    if(params){
      Object.keys(params).forEach(key => {
        label = label.replace(`:${key}`, key +' '+ params[key])
        path = path?.replace(`:${key}`, params[key])
      })
    }
    return {
      label,
      path,
      active: index === crumbs.value.length - 1
    }
  })
}
</script>
<template>
  <div class="pagetitle">
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
          <router-link v-if="crumb.path " class="text-capitalize" :class="crumb.active? 'active':''" :to="crumb.path">{{ crumb.label }}</router-link>
          <span class="text-capitalize" v-else>{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>
