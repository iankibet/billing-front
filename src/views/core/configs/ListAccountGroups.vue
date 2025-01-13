<script setup>
import { ShTable, ShModalForm, useAppStore, shRepo } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
const { getActionUrl, service: accountGroupsService } = useStreamline('accountGroups')

import CardLayout from '@/views/layouts/CardLayout.vue'
import { onMounted, ref, useId } from 'vue'
const appStore = useAppStore()
const accountGroupSaved = (res) => {
  shRepo.showToast(res.message);
  appStore.refresh(2000)
}
const saveModalId = useId();
const accountGroup = ref(null)

const editAccountGroup = (row)=>{
  if(row){
    accountGroup.value = row
    shRepo.showModal(saveModalId)
  }
}
const deleteAccountGroup = (row)=>{
  shRepo.runPlainRequest(getActionUrl('deleteAccountGroup', row.id)).then((res) => {
    res.isConfirmed && res.value.success && shRepo.showToast('User Group deleted')
    res.isConfirmed && res.value.success &&  appStore.refresh(1000)
    res.isConfirmed && !res.value.success && shRepo.showToast(res.value.error, 'error')
  })
}



</script>

<template>
  <div class="row mb-2">
    <div class="">
      <div class="d-flex ">
        <sh-modal-form
          class="btn btn-primary btn-sm"
          modal-title="User Group Form"
          :fields="['name','description']"
          :action="getActionUrl('saveAccountGroup')"
          @success="accountGroupSaved"
          :v-if-user-can="'config.add_user_group'"
          :modal-id="saveModalId"
          :current-data="accountGroup"
          @click="()=>accountGroup = null"
        >
          <i class="bi bi-plus-lg"></i>
         Add Account Group
        </sh-modal-form>
      </div>
    </div>
  </div>
  <card-layout>
    <sh-table
      :disable-mobile-responsive="true"
      :end-point="getActionUrl('listAccountGroups', 'active')"
      :headers="['id', 'name', 'description', 'created_at']"
      :links="{
          name: {
            url: '/accountgroups/{id}',
          }
        }"
      :actions="{
        label: 'Actions',
        actions: [
          {
            label: 'View',
            path: '/accountgroups/view/{id}',
            class: 'btn btn-xs btn-dark me-1 ',
          },

          {
            label: 'Edit',
            icon: 'bi-pencil-square',
            emits: editAccountGroup,
            class: 'btn btn-xs btn-primary me-1 ',
            permission: 'configs.account_groups.write'
          },
          {
            label: 'Delete',
            icon: 'bi-trash',
            emits: deleteAccountGroup,
            class: 'btn btn-xs btn-danger',
            permission: 'configs.account_groups.write'

          }
        ]
      }"
    >
    </sh-table>
  </card-layout>

</template>

<style scoped>

</style>