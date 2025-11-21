import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/admin_dashboard';

// Auth / Other Imports
import Home from 'components/Home';
import Users from 'pages/management/users';
import Products from 'pages/management/products';

const routes = [
  // Home page
  {
    name: 'Main Dashboard',
    layout: '/home',
    path: '/',
    component: <Home />,
  },

  // Admin dashboard (sidebar pe dikh raha)
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/admin_dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },

  // ✅ Users – ab admin sidebar me dikhega
  {
    name: 'Users',
    layout: '/admin',  // ⬅️ /pages se /admin kar diya
    path: '/users',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Users />,
  },
  {
    name: 'Products',
    layout: '/admin',  // ⬅️ /pages se /admin kar diya
    path: '/products',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Products />,
  },
];

export default routes;
