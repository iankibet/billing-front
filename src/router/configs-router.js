import ListAccountGroups from '@/views/core/configs/ListAccountGroups.vue'
import ConfigMain from '@/views/core/configs/ConfigMain.vue'

export  default [
  {
    path: '/configs',
    component:ConfigMain,
    children:[
      {
        path: 'accountgroups',
        component:ListAccountGroups,
      }
    ]
  }
]