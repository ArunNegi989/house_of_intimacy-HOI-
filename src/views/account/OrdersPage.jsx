import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
} from '@chakra-ui/react';

const dummyOrders = [
  {
    id: 'ORD-1001',
    date: '2025-11-18',
    total: '₹3,499',
    status: 'Delivered',
  },
  {
    id: 'ORD-1002',
    date: '2025-11-19',
    total: '₹1,899',
    status: 'Processing',
  },
];

export default function OrdersPage() {
  return (
    <Box maxW="900px" mx="auto" px={{ base: 4, md: 6 }} py={10}>
      <Heading fontSize="2xl" mb={6}>
        My Orders
      </Heading>

      {dummyOrders.length === 0 ? (
        <Text color="gray.500">You have not placed any orders yet.</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dummyOrders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.date}</Td>
                <Td>{order.total}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      order.status === 'Delivered'
                        ? 'green'
                        : order.status === 'Processing'
                        ? 'orange'
                        : 'gray'
                    }
                  >
                    {order.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
