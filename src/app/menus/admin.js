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
    icon: 'bi-wallet2',
    permission: 'billing',
    type: 'many',
    children: [
      {
        path: '/billing/bills',
        label: 'Bills',
        permission: 'bills',
        type:'single',
      },
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
      },
      {
        path: '/billing/payment-methods',
        label: 'Payment Methods',
        permission: 'payment_methods',
        type:'single',
      }
    ]
  },
  {
    path: '/my-plan',
    label: 'My Plan',
    icon:'bi-list',
    permission: 'billing',
    type:'single'
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
