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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Stack,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"; // 👈 NEW
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';

const statusColors = {
  PLACED: "yellow",
  CONFIRMED: "blue",
  PROCESSING: "orange",
  SHIPPED: "purple",
  OUT_FOR_DELIVERY: "cyan",
  DELIVERED: "green",
  CANCELLED: "red",
};

function AdminPlacedOrdersList() {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // sirf row-wise loader ke liye
  const [updatingId, setUpdatingId] = useState(null);

  // 👇 Modal ke liye states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const authToken =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const fetchOrders = async () => {
    try {
      if (!authToken) return;
      setLoading(true);

      const res = await axios.get(`${baseUrl}/orders/admin/list`, {
        params: {
          status: "PLACED", // 👈 sirf PLACED orders
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Admin fetch placed orders error:", err);
      toast({
        title: "Error loading placed orders",
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
  }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (!authToken) return;

      setUpdatingId(orderId);

      await axios.patch(
        `${baseUrl}/orders/admin/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // ✅ Ye page sirf PLACED dikhata hai
      if (newStatus !== "PLACED") {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }

      toast({
        title: "Order status updated",
        description: `Order marked as ${newStatus}`,
        status: "success",
        position: "top",
        duration: 3000,
      });
    } catch (err) {
      console.error("Admin update placed order status error:", err);
      toast({
        title: "Error updating order",
        status: "error",
        position: "top",
        duration: 3000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const formatMoney = (val) => {
    if (typeof val !== "number") return "0.00";
    return val.toFixed(2);
  };

  // 👇 Modal open helper
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
    setIsDetailsOpen(false);
  };

  return (
    <>
      <Box p="6" mt="20">
        <Flex justify="space-between" align="center" mb="4">
          <Box>
            <Heading size="md">Placed Orders</Heading>
            <Text fontSize="sm" color="gray.500">
              Only orders with status &quot;PLACED&quot;
            </Text>
          </Box>
        </Flex>

        <Box borderWidth="1px" borderRadius="lg" overflowX="auto" bg="white">
          {loading ? (
            <Flex justify="center" align="center" p="10" gap="3">
              <Spinner />
              <Text fontSize="sm">Loading placed orders...</Text>
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
                  <Th>Details</Th>
                  <Th>Update</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr
                    key={order._id}
                    opacity={updatingId === order._id ? 0.6 : 1}
                  >
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
                        ₹ {formatMoney(order.grandTotal)}
                      </Text>
                      {order.totalSavings != null && (
                        <Text fontSize="xs" color="green.500">
                          Saved ₹ {formatMoney(order.totalSavings)}
                        </Text>
                      )}
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

                    {/* 👇 Details eye button */}
                    <Td>
                      <IconButton
                        aria-label="View order details"
                        icon={<FiEye />}
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsModal(order)}
                      />
                    </Td>

                    {/* 👇 Status update select */}
                    <Td>
                      <Select
                        size="xs"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        isDisabled={updatingId === order._id}
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
                      {updatingId === order._id && (
                        <Text fontSize="xx-small" color="gray.500" mt="1">
                          Updating...
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        {/* 🎨 Pagination – centered & pretty (same as AdminOrdersList) */}
        <Flex justify="center" mt="6">
          <Stack spacing={2} align="center">
            <Text fontSize="xs" color="gray.500">
              Showing page <b>{page}</b> of <b>{totalPages}</b> ({total} placed
              orders)
            </Text>

            <HStack
              spacing={3}
              px={4}
              py={2}
              borderRadius="full"
              bg="gray.50"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<ChevronLeftIcon />}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={page === 1 || loading}
              >
                Prev
              </Button>

              <Box
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
                bg="white"
                borderWidth="1px"
                borderColor="pink.200"
                color="pink.600"
                minW="80px"
                textAlign="center"
              >
                Page {page}
              </Box>

              <Button
                size="xs"
                variant="ghost"
                rightIcon={<ChevronRightIcon />}
                onClick={() =>
                  setPage((p) => (p < totalPages ? p + 1 : p))
                }
                isDisabled={page === totalPages || loading}
              >
                Next
              </Button>
            </HStack>
          </Stack>
        </Flex>
      </Box>

      {/* 🔍 Order Details Modal - prettier version */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
        size="4xl"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          overflow="hidden"
          bg="gray.50"
          boxShadow="2xl"
        >
          <ModalHeader
            py={4}
            px={6}
            borderBottomWidth="1px"
            borderColor="gray.100"
            bg="white"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="xs" textTransform="uppercase" color="gray.500">
                  Order Details
                </Text>
                <Text fontWeight="700" fontSize="lg">
                  {selectedOrder?.orderNumber ||
                    (selectedOrder?._id && `#${selectedOrder._id.slice(-8)}`)}
                </Text>
              </Box>

              {selectedOrder && (
                <HStack spacing={2} align="center">
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    colorScheme={statusColors[selectedOrder.status] || "gray"}
                  >
                    {selectedOrder.status}
                  </Badge>

                  {selectedOrder.paymentMethod && (
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      colorScheme={
                        selectedOrder.paymentStatus === "PAID"
                          ? "green"
                          : selectedOrder.paymentStatus === "FAILED"
                          ? "red"
                          : "yellow"
                      }
                    >
                      {selectedOrder.paymentMethod} •{" "}
                      {selectedOrder.paymentStatus}
                    </Badge>
                  )}
                </HStack>
              )}
            </Flex>
          </ModalHeader>

          <ModalCloseButton top="12px" right="12px" />

          <ModalBody p={6} bg="gray.50">
            {selectedOrder && (
              <Stack spacing={5}>
                {/* Top summary strip */}
                <Box
                  p={4}
                  borderRadius="lg"
                  bgGradient="linear(to-r, pink.50, purple.50)"
                  borderWidth="1px"
                  borderColor="pink.100"
                >
                  <Flex justify="space-between" align="center" gap={4}>
                    <Box>
                      <Text fontSize="xs" color="gray.700">
                        Placed On
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                    </Box>

                    <Box textAlign="right">
                      <Text fontSize="xs" color="gray.700">
                        Grand Total
                      </Text>
                      <Text fontSize="lg" fontWeight="700">
                        ₹ {formatMoney(selectedOrder.grandTotal)}
                      </Text>
                      {selectedOrder.discountTotal > 0 && (
                        <Text fontSize="xs" color="green.700">
                          You saved ₹{" "}
                          {formatMoney(selectedOrder.discountTotal)}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>

                {/* Grid: Order + Customer + Amount */}
                <Grid templateColumns={{ base: "1fr", md: "2fr 1.4fr" }} gap={4}>
                  {/* Left: Customer & Shipping */}
                  <GridItem>
                    <Box
                      bg="white"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.100"
                      p={4}
                    >
                      <Text fontSize="sm" fontWeight="700" mb={2}>
                        Customer & Shipping
                      </Text>
                      <Divider mb={3} />

                      <Stack spacing={1}>
                        <Text fontSize="sm">
                          <strong>Name:</strong>{" "}
                          {selectedOrder.shippingAddress?.name ||
                            selectedOrder.user?.name}
                        </Text>

                        {selectedOrder.shippingAddress?.phone && (
                          <Text fontSize="sm">
                            <strong>Phone:</strong>{" "}
                            {selectedOrder.shippingAddress.phone}
                          </Text>
                        )}

                        {selectedOrder.user?.email && (
                          <Text fontSize="sm">
                            <strong>Email:</strong> {selectedOrder.user.email}
                          </Text>
                        )}
                      </Stack>

                      <Box mt={3}>
                        <Text fontSize="sm" fontWeight="600" mb={1}>
                          Shipping Address
                        </Text>
                        <Box
                          fontSize="xs"
                          color="gray.700"
                          p={3}
                          borderRadius="md"
                          bg="gray.50"
                          borderWidth="1px"
                          borderColor="gray.100"
                        >
                          <Text>
                            {selectedOrder.shippingAddress?.addressLine1}
                            {selectedOrder.shippingAddress?.addressLine2 && (
                              <>
                                , {selectedOrder.shippingAddress.addressLine2}
                              </>
                            )}
                          </Text>
                          {selectedOrder.shippingAddress?.landmark && (
                            <Text>
                              {selectedOrder.shippingAddress.landmark}
                            </Text>
                          )}
                          <Text>
                            {selectedOrder.shippingAddress?.city},{" "}
                            {selectedOrder.shippingAddress?.state} -{" "}
                            {selectedOrder.shippingAddress?.pincode}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </GridItem>

                  {/* Right: Amount + Payment + IDs */}
                  <GridItem>
                    <Box
                      bg="white"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.100"
                      p={4}
                    >
                      <Text fontSize="sm" fontWeight="700" mb={2}>
                        Amount Summary
                      </Text>
                      <Divider mb={3} />

                      <Stack spacing={1}>
                        <Flex justify="space-between" fontSize="sm">
                          <Text>Items Total</Text>
                          <Text>₹ {formatMoney(selectedOrder.itemsTotal)}</Text>
                        </Flex>

                        <Flex justify="space-between" fontSize="sm">
                          <Text>MRP Total</Text>
                          <Text>₹ {formatMoney(selectedOrder.mrpTotal)}</Text>
                        </Flex>

                        <Flex justify="space-between" fontSize="sm">
                          <Text>Discount</Text>
                          <Text>
                            - ₹ {formatMoney(selectedOrder.discountTotal)}
                          </Text>
                        </Flex>

                        <Flex justify="space-between" fontSize="sm">
                          <Text>Shipping Fee</Text>
                          <Text>₹ {formatMoney(selectedOrder.shippingFee)}</Text>
                        </Flex>

                        <Divider my={2} />

                        <Flex
                          justify="space-between"
                          fontSize="md"
                          fontWeight="700"
                        >
                          <Text>Grand Total</Text>
                          <Text>₹ {formatMoney(selectedOrder.grandTotal)}</Text>
                        </Flex>
                      </Stack>

                      {/* Payment + IDs */}
                      <Box mt={4}>
                        {selectedOrder.paymentMethod && (
                          <Text fontSize="sm">
                            <strong>Payment:</strong>{" "}
                            {selectedOrder.paymentMethod} /{" "}
                            {selectedOrder.paymentStatus}
                          </Text>
                        )}
                        {selectedOrder.paymentId && (
                          <Text fontSize="xs" color="gray.600">
                            <strong>Payment ID:</strong>{" "}
                            {selectedOrder.paymentId}
                          </Text>
                        )}
                        {selectedOrder.razorpayOrderId && (
                          <Text fontSize="xs" color="gray.600">
                            <strong>Gateway Order ID:</strong>{" "}
                            {selectedOrder.razorpayOrderId}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>

                {/* Items list */}
                <Box
                  bg="white"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.100"
                  p={4}
                >
                  <Text fontSize="sm" fontWeight="700" mb={2}>
                    Items ({selectedOrder.items?.length || 0})
                  </Text>
                  <Divider mb={3} />

                  <Box maxH="260px" overflowY="auto">
                    <Table size="sm" variant="simple">
                      <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th>Product</Th>
                          <Th>Color</Th>
                          <Th>Size</Th>
                          <Th isNumeric>Qty</Th>
                          <Th isNumeric>Line Total</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
  {selectedOrder.items?.map((item) => (
    <Tr key={item._id || item.product}>
      <Td>
        <Text fontSize="sm" fontWeight="500">
          {item.name}
        </Text>
        <Text fontSize="xs" color="gray.500">
          ID: {item.product}
        </Text>
      </Td>

      {/* 🔴 Color as a dot, not code */}
      <Td>
        {item.color ? (
          <HStack spacing={2}>
            <Box
              w="18px"
              h="18px"
              borderRadius="full"
              borderWidth="1px"
              borderColor="gray.200"
              bg={item.color}
            />
          </HStack>
        ) : (
          <Text fontSize="sm">—</Text>
        )}
      </Td>

      <Td>
        <Text fontSize="sm">{item.size || "—"}</Text>
      </Td>
      <Td isNumeric>
        <Text fontSize="sm">{item.quantity}</Text>
      </Td>
      <Td isNumeric>
        <Text fontSize="sm">
          ₹ {formatMoney(item.lineTotal || item.salePrice || 0)}
        </Text>
      </Td>
    </Tr>
  ))}
</Tbody>

                    </Table>
                  </Box>
                </Box>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminPlacedOrdersList;
