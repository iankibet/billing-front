<script setup>
import { ShModalForm, shRepo } from '@iankibetsh/shframework'
import { ref, useId } from 'vue'
import { useStreamline } from '@iankibetsh/vue-streamline'


const {getActionUrl} = useStreamline('inventory/productsCategory')
const categoryModalId = useId();
const category = ref(null);

const categorySaved = (res) => {
  shRepo.showToast('Category saved successfully', 'success')
  shRepo.hideModal(categoryModalId)
}
const editCategory = (row) => {
  category.value = row
  if (category.value) {
    shRepo.showModal(categoryModalId)
  }
}

const fields = [
  {
    name: 'name',
    label: 'Caregory Name',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
]
</script>

<template>
  <div>
    <div class="row">
      <div class="" v-if-user-can="'products_category.write'">
        <sh-modal-form
          :modal-id="categoryModalId"
          modal-title="Save Category"
          :fields="fields"
          :action="getActionUrl('storeCategory')"
          :successCallback="categorySaved"
          class="btn btn-primary  btn-sm"
        > <i class="bi bi-plus-circle me-1"></i>ADD PRODUCT CATEGORY </sh-modal-form>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>