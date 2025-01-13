<script setup>
import usePapaParse from '@/utils/usePapaParse.js'
import { shRepo } from '@iankibetsh/shframework'
import { useRoute } from 'vue-router'
import { useStreamline } from '@iankibetsh/vue-streamline'
import ShowLoading from '@/views/layouts/skeletons/ShowLoading.vue'

const {getActionUrl} = useStreamline('accounts')

const url = getActionUrl('importAccounts')
const {file,setFile,isCounting,rowCount,fieldMaps,sampleRows,startImport,progress, importing,postedRows} = usePapaParse({
  username: '',
  id: '',
  name: '',
  address: '',
  city: '',
  phone: '',
  alternate_phone: '',
  email:'',
  plan: '',
  expiry: '',
  created_at: '',
  created_by: '',
  status: '',
  account_status: '',

}, url)

</script>

<template>
<div class="row mx-1">
  <div class="col-md-12 card shadow">
    <div class="card-body">
      <input v-if="!file" accept="text/csv" type="file" @change="setFile" />
      <show-loading v-else-if="isCounting"></show-loading>
     <div class="table-responsive" v-else>
       <table  class="table table-bordered ">
         <tbody>
         <tr>
           <td>Rows</td>
           <td>
             {{ rowCount }}
           </td>
         </tr>
         <tr>
           <td>File</td>
           <td>
             {{ file.name }}
           </td>
         </tr>
         <tr>
           <th colspan="2">Field Mapping</th>
         </tr>
         <tr v-for="key in Object.keys(fieldMaps)">
           <th>{{ key }}</th>
           <td>
             <select :disabled="importing" v-model="fieldMaps[key]">
               <option value="">Select...</option>
               <option v-for="(field,index) in sampleRows[0]" :key="field" :value="index">{{ field }}</option>
             </select>
           </td>
         </tr>
         <tr>
           <th colspan="2">Sample Data</th>
         </tr>
         <tr>
           <td colspan="2">
             <table class="table table-bordered">
               <tbody>
               <tr>
                 <th>&nbsp;</th>
                 <th v-for="key in Object.keys(fieldMaps)">{{ key }}</th>
               </tr>
               <template v-for="(row,index) in sampleRows">
                 <tr v-if="index > 0">
                   <td>{{ index }}</td>
                   <td v-for="key in Object.keys(fieldMaps)">{{ row[fieldMaps[key]] }}</td>
                 </tr>
               </template>

               </tbody>
             </table>
           </td>
         </tr>
         </tbody>
       </table>
     </div>
    </div>
  </div>
  <div class="col-md-12 ps-1" v-if="fieldMaps.phone">
    <div class="card shadow rounded w-100">
      <div class="card-body">
        <div class="my-1">
          <div class="progress">
            <div class="progress-bar" :class="importing ? 'progress-bar-striped progress-bar-animated':'bg-success'"  role="progressbar" :style="{width:progress+'%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
              {{ progress }}%
            </div>
          </div>
          <small class="text-success" v-if="progress == 100">
            <i class="bi-check-all"/>{{ shRepo.formatNumber(postedRows) }} rows imported
          </small>
          <span v-else>
               {{ postedRows }}/{{ rowCount }}
          </span>
        </div>
        <button v-if="progress < 100" @click="startImport" class="btn btn-primary" :disabled="importing">
          <span v-if="importing">Importing...</span>
          <span v-else>Start Import</span>
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
