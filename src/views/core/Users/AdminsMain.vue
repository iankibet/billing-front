<script setup>
import { ShTabs, ShModalForm, useAppStore, shRepo } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { ref, useId } from 'vue'
const appStore = useAppStore();

const {getActionUrl, service: usersService} = useStreamline('users')
const {getActionUrl:accountGroupGetActionUrl, service:accountGroupsService} = useStreamline('accountGroups')

const userSaved = (res) => {
  shRepo.showToast(res.message);
  appStore.refresh(2000)
}
const userModalId = useId()
const userData = ref(null)
const editUser = (user) => {
  userData.value = user
  console.log(user)
 setTimeout(() => {
    shRepo.showModal(userModalId)
  }, 100)

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
    name: 'department_id',
    type: 'select',
    label: 'Department',
    required: true,
    url: getActionUrl('listDepartments'),
    suggest:true
  },
  {
    name: 'phone',
    type: 'phone',
    label: 'Phone',
    required: true,
  },
  {
    name: 'user_group_id',
    type: 'select',
    label: 'User Group',
    required: true,
    url: accountGroupGetActionUrl('listAccountGroups'),
    suggest:true
  },

]

</script>

<template>
  <!--  <button type="button" v-if-user-can="'users.add_user'" class="btn btn-primary" data-toggle="modal" data-target="#adduser"> <i class="bi bi-plus-circle"></i> ADD user </button>-->

  <div class="div" v-if-user-can="'users.admins.write'">
    <sh-modal-form
      :modal-id="userModalId"
      class="btn btn-primary btn-sm"
      modal-title="user Form"
      :fields="fields"
      :current-data="userData"
      :action="getActionUrl('saveAdmin')"
      @success="userSaved"
    >
      <i class="fa-solid fa-plus"></i>
      Add Admin Account

    </sh-modal-form>
  </div>

  <div class="mt-3">
    <sh-tabs
      :tabs="['active', 'inactive' ]"
      base-url="/users/admins"
      :shared-data="{editUser}"
    />

  </div>



</template>

<style scoped>

</style>