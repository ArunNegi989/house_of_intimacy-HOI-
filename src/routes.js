import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdHome } from 'react-icons/md';
import { FaCartShopping } from 'react-icons/fa6';
import { FaUser, FaClipboardList } from 'react-icons/fa';

// Admin Imports
import MainDashboard from 'views/admin/admin_dashboard';

// Auth / Other Imports
import Home from './components/Homepagecomopents/Home';
import Users from 'pages/management/users';
import Products from 'pages/management/products';
import AddProducts from 'pages/management/products/add-new';
import EditProducts from 'pages/management/products/[id]';

// New Admin Order Pages
import AdminOrdersList from 'views/admin/orders/AdminOrdersList';
import AdminOrderDetail from 'views/admin/orders/AdminOrdersList';
import AdminPlacedOrdersList from 'views/admin/orders/AdminPlacedOrdersList';

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
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <FaUser />,
    component: <Users />,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: <FaCartShopping />,
    component: <Products />,
  },

  // Hidden admin pages
  {
    name: 'Add Product',
    layout: '/admin',
    path: '/products/add-new',
    component: <AddProducts />,
    showInSidebar: false,
  },
  {
    name: 'Edit Product',
    layout: '/admin',
    path: '/products/:id',
    component: <EditProducts />,
    showInSidebar: false,
  },

  // ======================
  // ⭐ NEW: Admin Orders
  // ======================
  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: <FaClipboardList />,
    component: <AdminOrdersList />,
    showInSidebar: true, // sidebar me dikhana hai
  },
  {
    name: 'placed order',
    layout: '/admin',
    path: '/placed-orders',
    icon: <FaClipboardList />,
    component: <AdminPlacedOrdersList />,
    showInSidebar: true, // sidebar me dikhana hai
  },
  {
    name: 'Order Detail',
    layout: '/admin',
    path: '/orders/:id',
    component: <AdminOrderDetail />,
    showInSidebar: false, // hidden
  },
];

export default routes;
