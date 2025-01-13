export default [

  {
    path: '/configs',
    label: 'Configs',
    icon: 'bi-sliders',
    permission: 'configs',
    type: 'many',
    children: [
      {
        path: '/configs/accountgroups',
        label: 'Account Groups',
        permission: 'account_groups',
        type:'single',
      }
    ]
  }

]