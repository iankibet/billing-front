<script setup>
import CardLayout from '@/views/layouts/CardLayout.vue'
import { ShModalForm, shRepo, ShTable, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { useRoute } from 'vue-router'
const { getActionUrl, service: usersService } = useStreamline('users')
// const {getActionUrl:accountGroupGetActionUrl, service:accountGroupsService} = useStreamline('accountGroups')
const route = useRoute();
const status = route.params.status

const props = defineProps(['sharedData'])
const editUser = props.sharedData.editUser

</script>



<template>
  <card-layout>
        <sh-table
          :disable-mobile-responsive="true"
          :end-point="getActionUrl('listAdmins', status)"
          :headers="['id', 'name','username', 'phone', 'email',
           {label: 'Department', key: 'role', callBack: (value) => `<a href='/sh-departments'> ${value?.department?.name ?? '--'}<a>`},
           {label: 'User Group', key: 'role', callBack: (value) => value?.user_group?.name},
           'created_at']"
          :links="{
            name: {
              url: '/users/view/{id}',
            }
          }"
          :has-range="true"
          :actions="{
                  label: '&nbsp;',
                  type: 'dropdown-horizontal',
                  actions:[
                      {
                          label: 'View',
                          icon: 'bi bi-eye',
                          permission: 'users.admins.read',
                          path: '/users/view/{id}'
                      },

                      {
                          label: 'Edit',
                          icon: 'bi bi-pencil-square',
                          permission: 'users.admins.write',
                          emits: editUser
                      },
                      {
                          label: 'Delete',
                          icon: 'bi bi-trash',
                          class:'',
                          permission: 'users.admins.write',
                          emits: deleteTicket
                      }

                  ]
                }"
        >
        </sh-table>

  </card-layout>
</template>


<style scoped>

</style>