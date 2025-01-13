let menus = [];

menus = menus.concat( [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'bi-dice-6-fill',
    permission: 'dashboard',
    type: 'single'
  },
  {
    path: '/billing',
    label: 'Billing',
    icon: 'bi-people',
    permission: 'billing',
    type: 'many',
    children: [
      {
        path: '/billing/plans',
        label: 'Plans',
        permission: 'plans',
        type:'single',
      },
      {
        path: '/billing/features',
        label: 'Billing Features',
        permission: 'features',
        type:'single',
      }
    ]
  },
  {
    path: '/sh-departments',
    label: 'Departments',
    icon: 'bi-key',
    permission: 'departments',
    type: 'single',
  },

])



export default menus;
