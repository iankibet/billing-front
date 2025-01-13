export default [
  {
    path: '/inventory',
    label: 'Inventory',
    icon: 'bi-people',
    permission: 'inventory',
    type: 'many',
    children: [
      {
        path: '/inventory/products-category',
        label: 'Products Category',
        permission: 'products_category.read',
        type:'single',
      },
      {
        path: '/inventory/products',
        label: 'Products',
        permission: 'products.read',
        type:'single',
      },
      {
        path: '/inventory/product-usage',
        label: 'Product Usage',
        permission: 'products.read',
        type:'single',
      }
    ]
  }
]