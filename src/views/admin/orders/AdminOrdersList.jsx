// src/admin/pages/AdminOrdersList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

const statusColors = {
  PLACED: "yellow",
  CONFIRMED: "blue",
  PROCESSING: "orange",
  SHIPPED: "purple",
  OUT_FOR_DELIVERY: "cyan",
  DELIVERED: "green",
  CANCELLED: "red",
};

function AdminOrdersList() {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);

  const authToken =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const fetchOrders = async () => {
    try {
      if (!authToken) return;
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/orders/admin/list`, {
        params: { status: statusFilter, page, limit },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Admin fetch orders error:", err);
      toast({
        title: "Error loading orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (!authToken) return;
      setLoading(true);

      await axios.patch(
        `${API_BASE_URL}/orders/admin/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // local update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );

      toast({
        title: "Order status updated",
        description: `Order marked as ${newStatus}`,
        status: "success",
        position: "top",
        duration: 3000,
      });
    } catch (err) {
      console.error("Admin update order status error:", err);
      toast({
        title: "Error updating order",
        status: "error",
        position: "top",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <Box p="6">
      <Flex justify="space-between" align="center" mb="4">
        <Box>
          <Heading size="md">Orders</Heading>
          <Text fontSize="sm" color="gray.500">
            View and manage all customer orders
          </Text>
        </Box>

        {/* FILTER BY STATUS */}
        <Flex align="center" gap="3">
          <Text fontSize="sm" color="gray.600">
            Filter by status:
          </Text>
          <Select
            size="sm"
            maxW="220px"
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="ALL">All</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </Flex>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto" bg="white">
        {loading ? (
          <Flex justify="center" align="center" p="10">
            <Spinner />
          </Flex>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th isNumeric>Total</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th>Date</Th>
                <Th>Update</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order._id}>
                  <Td>
                    <Text fontWeight="600" fontSize="sm">
                      {order.orderNumber || order._id.slice(-8)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {order.items?.length || 0} items
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {order.shippingAddress?.name ||
                        order.user?.name ||
                        "Customer"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {order.user?.email}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Text fontSize="sm">
                      ₹ {order.grandTotal?.toFixed(2)}
                    </Text>
                    <Text fontSize="xs" color="green.500">
                      Saved ₹ {order.totalSavings?.toFixed(2)}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={statusColors[order.status] || "gray"}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        order.paymentStatus === "PAID"
                          ? "green"
                          : order.paymentStatus === "FAILED"
                          ? "red"
                          : "yellow"
                      }
                    >
                      {order.paymentMethod} / {order.paymentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="xs">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Td>
                  <Td>
                    <Select
                      size="xs"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">
                        OUT_FOR_DELIVERY
                      </option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" align="center" mt="4">
        <Text fontSize="xs" color="gray.500">
          Showing page {page} of {totalPages} ({total} orders)
        </Text>
        <Flex gap="2">
          <Button
            size="xs"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1}
          >
            Prev
          </Button>
          <Button
            size="xs"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default AdminOrdersList;
