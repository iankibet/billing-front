let supportMenus = [];
supportMenus = supportMenus.concat( [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'bi-house',
    permission: 'dashboard',
    type: 'single'
  },
  {
    path: '/my-tickets/tab/assigned',
    label: 'Assigned',
    icon: 'bi-ticket',
    permission: 'assigned',
    type: 'single'
  },
  {
    path: '/my-tickets/tab/working',
    label: 'Working',
    icon: 'bi-tools',
    permission: 'working',
    type: 'single'
  },
  {
    path: '/my-tickets/tab/closed',
    label: 'Closed',
    icon: 'bi-ui-checks',
    permission: 'closed',
    type: 'single'
  },

])

export default supportMenus;