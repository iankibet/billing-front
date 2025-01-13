<script setup>
// import CardLayout from '@/views/layouts/CardLayout.vue'
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
      :end-point="getActionUrl('listClients', status)"
      :headers="['id', 'name', 'username', 'phone','phone2', 'email','accounts_count',
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
                          permission: 'users.clients.read',
                          path: '/users/view/{id}'
                      },

                      {
                          label: 'Edit',
                          icon: 'bi bi-pencil-square',
                          permission: 'users.clients.write',
                          emits: editUser
                      },
                      {
                          label: 'Delete',
                          icon: 'bi bi-trash',
                          class:'',
                          permission: 'users.clients.write',
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