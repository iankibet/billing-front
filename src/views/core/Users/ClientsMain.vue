<script setup>
import { ShTabs, ShModalForm, useAppStore, shRepo, useUserStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { storeToRefs } from 'pinia'
import { ref, useId } from 'vue'
import router from '@/router/index.js'
const appStore = useAppStore();
const userStore = useUserStore();

const {getActionUrl, service: usersService, loading} = useStreamline('users')
const {getActionUrl:accountGroupGetActionUrl, service:accountGroupsService} = useStreamline('accountGroups')
const {user} = storeToRefs(userStore)
const userData = ref(null)

const userSaved = (res) => {
  shRepo.showToast(res.message);
  // console.log(res)
  if(res && res.data.is_not_new == null){
    setTimeout(() => {
      router.push(`/users/view/${res.data.id}/tab/accounts`)
    }, 100)
  }
  appStore.refresh(2000)
}
const userModalId = useId()
const editUser = row => {
  userData.value = row
  // console.log(row)
  if(row){
    setTimeout(() => {
      shRepo.showModal(userModalId)
    }, 100)
  }
}

const fetchUsersFromRadius = () => {
  shRepo.runPlainRequest(getActionUrl('fetchUsersFromRadius')).then(res=>{
    shRepo.showToast('Users fetched ')
    useAppStore().refresh(2000)
  }).catch(err=>{
    shRepo.showToast(err.message, 'error')
  })

}

const fields = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
  },
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    required: true,
  },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    required: true,
    options: [
      {label: 'Client', value: 'client'},
    ]
  },
  {
    name: 'phone',
    type: 'phone',
    label: 'Phone',
    required: true,
  },
  {
    name: 'phone2',
    type: 'phone',
    label: 'Phone 2',
    required: true,
  }

]


</script>

<template>
  <!--  <button type="button" v-if-user-can="'users.add_user'" class="btn btn-primary" data-toggle="modal" data-target="#adduser"> <i class="bi bi-plus-circle"></i> ADD user </button>-->
  <div class="row">
    <div class="d-flex gap-2">
      <router-link v-if-user-can="'users.clients.import'" to="?popup=offcanvas&pos=end&size=lg&comp=ImportPaParse&title=Import Users" class="btn btn-sm btn-primary"> Import Users</router-link>

      <div class="div" v-if-user-can="'users.clients.write'">
        <sh-modal-form
          class="btn btn-sm btn-primary  "
          modal-title="user Form"
          :modal-id="userModalId"
          :fields="fields"
          :current-data="userData"
          :action="getActionUrl('saveUser')"
          @success="userSaved"
        >
          <i class="fa-solid fa-plus"></i>
          Add Customer
        </sh-modal-form>
      </div>

      <button class="btn btn-info btn-sm" v-if-user-can="'users.fetch_from_radius'" @click="fetchUsersFromRadius"> <i class="bi bi-arrow-repeat"></i> Fetch Data From Radius</button>

    </div>

  </div>

  <div class="">
    <sh-tabs
      :tabs="['active', 'inactive' ]"
      base-url="/users/clients"
      :shared-data="{editUser, deleteUser}"
      :active-tab="active"
    />

  </div>



</template>

<style scoped>

</style>