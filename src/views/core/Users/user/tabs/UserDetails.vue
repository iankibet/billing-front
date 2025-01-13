<script setup>
import { onMounted, ref } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import {useStreamline} from '@iankibetsh/vue-streamline'
import { useRoute } from 'vue-router'
import SkeletonCard from '@/views/layouts/skeletons/SkeletonCard.vue'
import { ShModalForm, ShAutoForm, shRepo, useAppStore } from '@iankibetsh/shframework'
import PasswordInput from '@/components/form-components/PasswordInput.vue'
import { formatStatus } from '@/utils/helpers.js'

const props = defineProps(['sharedData'])
const user = ref(props.sharedData)
const route = useRoute();
const userId = route.params.id;
const appStore = useAppStore()

const {getActionUrl, service: userService, loading} = useStreamline('users', userId )
const getUser = () => {
  userService.getUser(userId).then((res) => {
    user.value = res
  })
}
onMounted(() => {
  if(!user.value.name){
    getUser()
  }
})

const passwordFields = [
  {
    name: 'password',
    label: 'New Password',
    component: PasswordInput
  },
  {
    name: 'password_confirmation',
    label: 'Confirm Password',
    component: PasswordInput
  },
]

const userRolesFields = [
  {
    name:'role',
    type: 'select',
    label: 'Role',
    options: [
      {label: 'Admin', value: 'admin'},
      {label: 'Client', value: 'client'},
    ]
  },
  {
    name:'id',
    type: 'hidden',
  },
  {
    name: 'department_id',
    type: 'select',
    label: 'Department',
    url: getActionUrl('listDepartments'),
    suggest: true,
  }
]


const updatedSuccess = (res) => {
  if (res.status === 'success') {
    shRepo.showToast('User updated successfully', 'success')
    appStore.refresh(2000)
  }
}

</script>

<template>
  <CardLayout>
    <div class="">
      <div class="mb-3">
        <div class="actions d-flex align-items-center gap-2 pb-2">
          <div class="" v-if-user-can="'users.reset_password'">
            <sh-modal-form
              class="btn btn-sm btn-primary "
              modal-title="Reset User Password"
              :fields="passwordFields"
              :action="getActionUrl('updateUserPassword', userId)"
              @success="updatedSuccess"
            >
              <i class="bi bi-unlock"></i>
              Reset Password
            </sh-modal-form>
          </div>
          <div class="" v-if-user-can="'users.change_role'">
            <sh-modal-form
              class="btn btn-sm btn-primary "
              modal-title="Change User Role and Department"
              :fields="userRolesFields"
              :action="getActionUrl('changeRole', userId)"
              @success="updatedSuccess"
            >
              <i class="bi bi-person-vcard"></i>
              Change Role
            </sh-modal-form>
          </div>
<!--          <div class="" v-if-user-can="'users.edit_profile'">-->
<!--            <sh-modal-form-->
<!--              class="btn btn-sm btn-primary "-->
<!--              modal-title="Update User Details"-->
<!--              :current-data="user"-->
<!--              :fields="userFields"-->
<!--              :action="getActionUrl('updateUserPassword', userId)"-->
<!--              @success="updatedSuccess"-->
<!--            >-->
<!--              <i class="bi bi-unlock"></i>-->
<!--              Edit Profile-->
<!--            </sh-modal-form>-->
<!--          </div>-->
        </div>
      </div>

      <div class="col-md-6">
        <fieldset class="border p-2 rounded-3">
          <legend class="h5 text-primary float-none px-3 w-auto">Client Details</legend>
          <div class="row" v-if="user.name && !loading">
            <div class="col-md-12">
              <p><span class="fw-bold">Name:</span> {{user.name ?? '--'}}</p>
              <p><span class="fw-bold">Email:</span> {{user.email ?? '--'}}</p>
              <p><span class="fw-bold">Phone:</span> {{user.phone ?? '--'}}</p>
              <p v-if="user.phone2"><span class="fw-bold">Al:</span> {{user.phone2 ?? '--'}}</p>
              <p><span class="fw-bold">Username:</span> {{user.username ?? '--'}}</p>
              <p><span class="fw-bold">Role:</span> {{ user.role ?? '--'}}</p>
              <p class="d-flex"><span class="fw-bold">Status:</span> <span v-html="formatStatus(user.status)"></span></p>
              <p><span class="fw-bold" v-if="user.role==='admin'">Department:</span> {{ user.department?.name }}</p>
            </div>
          </div>
          <SkeletonCard v-else />
        </fieldset>
      </div>
    </div>
  </CardLayout>

</template>

<style scoped>
.fw-bold{
  margin-right: 5px;
}
</style>