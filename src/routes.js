import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/admin_dashboard';
import Profile from 'views/admin/profile';

// Auth Imports
import Home from 'components/Home';

const routes = [
   {
    name: 'Main Dashboard',
    layout: '/home',
    path: '/',
    component: <Home />,
  },
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/admin_dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  
];

export default routes;
