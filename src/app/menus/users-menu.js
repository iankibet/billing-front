export default [

  {
    path: '/users',
    label: 'Users',
    icon: 'bi-people',
    permission: 'users',
    type: 'many',
    children: [
      {
        path: '/users/clients',
        label: 'Clients',
        permission: 'clients.read',
        type:'single',
      },
      {
        path: '/users/admins',
        label: 'Admins',
        permission: 'admins.read',
        type:'single',
      }
    ]
  }

  ]