import InventoryMain from '@/views/core/inventory/InventoryMain.vue'
import ListProductsCategory from '@/views/core/inventory/products-category/ListProductsCategory.vue'

export default [
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryMain,
    children:[
      {
        path:'products-category',
        component: ListProductsCategory,
      },

    ]
  },
]