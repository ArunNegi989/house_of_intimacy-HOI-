import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';
import { FaCartShopping } from 'react-icons/fa6';

// Admin Imports
import MainDashboard from 'views/admin/admin_dashboard';

// Auth / Other Imports
import Home from 'components/Home';
import Users from 'pages/management/users';
import Products from 'pages/management/products';
import AddProducts from 'pages/management/products/add-new';
import { FaUser } from 'react-icons/fa';
import EditProducts from 'pages/management/products/[id]';

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
    // showInSidebar: true,  // optional
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <FaUser />,
    component: <Users />,
    // showInSidebar: true,  // optional
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <FaCartShopping />,
    component: <Products />,
    // showInSidebar: true,  // optional
  },
  // ✅ Hidden page (sirf button se open hoga)
  {
    name: 'Add Product',
    layout: '/admin',
    path: '/products/add-new',
    component: <AddProducts />,
    showInSidebar: false, // 👈 isko sidebar se hide rakhenge
  },
  {
    name: 'Edit Product',
    layout: '/admin',
    path: '/products/:id', // ✅ dynamic route
    component: <EditProducts />,
    showInSidebar: false,
  },
];

export default routes;
