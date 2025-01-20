<script setup>
import {useStreamline} from '@iankibetsh/vue-streamline'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'
import { shRepo, ShTable, ShCanvas } from '@iankibetsh/shframework'
import { useRoute } from 'vue-router'
import { ref, useId, watch } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'


const {getActionUrl, service,  loading, props} = useStreamline('clientBilling/billing')

const myProps = defineProps(['sharedData'])
const userPlan = myProps.sharedData.userPlan


</script>

<template>
  <SkeletonFull v-if="loading && !userPlan " />
  <CardLayout v-else >
    <div v-if="userPlan.plan">
      <div class="table-responsive">
        <sh-table :end-point="getActionUrl('listBills', userPlan.id )"
                  :headers="['id','bill_id','amount','status','created_at']"
                  :actions="{
                label:'&nbsp;',
                actions:[
                  {
                    label:'PAY NOW',
                    icon:'bi-wallet',
                    class:'btn btn-sm btn-success me-1',
                    url:'/checkout/{id}',
                    validator: (row) => row.status === 'unpaid'
                  },

                  {
                    label:'View Receipt',
                    icon:'bi-receipt',
                    class:'btn btn-sm btn-dark',
                    link:'?popup=offcanvas&side=end&component=PaymentReceipt&id={id}&title=Payment Receipt',
                  }
                ]
              }"
        />
      </div>
    </div>
  </CardLayout>

</template>

<style scoped>

</style>
