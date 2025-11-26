// src/pages/management/products/index.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Flex,
  Tag,
  TagLabel,
  useToast,
  useColorModeValue,
  Button,
  Image,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import ReactPaginate from "react-paginate";
import "../../../assets/styles/Users.module.css"; // pagination CSS, reuse

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";
// API root (without /v1) for images like /uploads/...
const apiRoot = baseUrl.replace(/\/v1$/, "");

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state (frontend is 0-based, backend is 1-based)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 10;

  const toast = useToast();
  const navigate = useNavigate();

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const headerBg = useColorModeValue("#6B46C1", "#553C9A");
  const headerTextColor = useColorModeValue("white", "white");
  const rowHoverBg = useColorModeValue("gray.100", "gray.700");

  // 👉 FETCH PRODUCTS (with backend pagination)
  const fetchProducts = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const page = pageIndex + 1; // backend page starts from 1

      const res = await axios.get(
        `${baseUrl}/products?page=${page}&limit=${itemsPerPage}`
      );

      console.log("PRODUCTS RESPONSE:", res.data);

      // Try to read products array from various possible keys
      const productsArray =
        res.data.data || res.data.products || res.data.items || [];

      setProducts(productsArray);

      // Try to read totalPages from various possible keys
      const totalPagesFromPagination = res.data.pagination?.totalPages;
      const totalPagesDirect = res.data.totalPages;

      let finalPageCount = 0;

      if (typeof totalPagesFromPagination === "number") {
        finalPageCount = totalPagesFromPagination;
      } else if (typeof totalPagesDirect === "number") {
        finalPageCount = totalPagesDirect;
      } else {
        // Fallback: if backend only sends total count, compute pages
        const totalItems =
          res.data.pagination?.total || res.data.total || productsArray.length;
        finalPageCount = Math.ceil(totalItems / itemsPerPage);
      }

      setPageCount(finalPageCount || 0);
      setCurrentPage(pageIndex);
    } catch (err) {
      console.error("Error loading products:", err);
      toast({
        title: "Error Fetching Products",
        description: err.response?.data?.message || "Error loading products.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = ({ selected }) => {
    fetchProducts(selected);
  };

  // DELETE HANDLER
  const handleDelete = async (productId) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        toast({
          title: "Not logged in",
          description: "Please login again.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Deleting product...",
        description: "Please wait while we remove this product.",
        status: "info",
        duration: 1500,
        isClosable: true,
        position: "bottom-right",
      });

      await axios.delete(`${baseUrl}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Product Deleted",
        description: "Product removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

      // refetch current page
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Delete product error:", err);
      toast({
        title: "Delete Error",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <Box
      bg={pageBg}
      pt={{ base: "150px", md: "120px" }}
      pb={10}
      px={{ base: 4, md: 6 }}
    >
      {/* Top bar: Add Product + Back */}
      <Flex justify="flex-end" align="center" mb={4}>
        <Flex gap={3}>
          <Button
            colorScheme="green"
            onClick={() => navigate("/admin/products/add-new")}
            rounded="full"
            px={6}
            py={2}
            fontWeight="600"
          >
            Add Product
          </Button>

           
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : products.length === 0 ? (
        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          textAlign="center"
          boxShadow="md"
          mt={4}
        >
          <Text>No products found.</Text>
        </Box>
      ) : (
        <>
          <Box
            bg={cardBg}
            p={4}
            rounded="2xl"
            boxShadow="lg"
            border="1px solid"
            mt={2}
          >
            <Table
              className="super-responsive-table"
              style={{ fontSize: "16px" }}
            >
              <Thead>
                <Tr
                  style={{
                    background: headerBg,
                    color: headerTextColor,
                    fontSize: "18px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <Th style={{ padding: "16px", color: "white" }}>S No.</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Image</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Product</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Category</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Brand</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Price</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Stock</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Status</Th>
                  <Th style={{ padding: "16px", color: "white" }}>
                    Created At
                  </Th>
                  <Th style={{ padding: "16px", color: "white" }}>Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {products.map((product, index) => {
                  const priceInfo = product?.price || {};
                  const mrp = priceInfo.mrp ?? 0;
                  const sale = priceInfo.sale ?? mrp ?? 0;
                  const discountPercent = priceInfo.discountPercent ?? null;

                  const imageUrl = product.mainImage
                    ? `${apiRoot}${product.mainImage}`
                    : null;

                  return (
                    <Tr
                      key={product._id}
                      style={{ transition: "0.2s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = rowHoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* S No. */}
                      <Td style={{ padding: "14px", fontWeight: "600" }}>
                        {currentPage * itemsPerPage + index + 1}
                      </Td>

                      {/* Thumbnail Image */}
                      <Td style={{ padding: "14px" }}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            boxSize="60px"
                            objectFit="cover"
                            objectPosition="top" 
                            borderRadius="md"
                            border="1px solid #E2E8F0"
                          />
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            No image
                          </Text>
                        )}
                      </Td>

                      {/* Product Name */}
                      <Td style={{ padding: "14px" }}>
                        <Text fontWeight="600">{product.name}</Text>
                      </Td>

                      {/* Category */}
                      <Td style={{ padding: "14px" }}>
                        {product.category || "-"}
                      </Td>

                      {/* Brand */}
                      <Td style={{ padding: "14px" }}>
                        {product.brand || "-"}
                      </Td>

                      {/* Price */}
                      <Td style={{ padding: "14px" }}>
                        <Text fontWeight="600">₹{sale}</Text>
                        {discountPercent ? (
                          <Text fontSize="xs" color="gray.500">
                            MRP ₹{mrp} • {discountPercent}% off
                          </Text>
                        ) : (
                          mrp > 0 && (
                            <Text fontSize="xs" color="gray.500">
                              MRP ₹{mrp}
                            </Text>
                          )
                        )}
                      </Td>

                      {/* Stock */}
                      <Td style={{ padding: "14px" }}>
                        {typeof product.totalStock !== "undefined"
                          ? product.totalStock
                          : "-"}
                      </Td>

                      {/* Status */}
                      <Td style={{ padding: "14px" }}>
                        <Tag
                          size="md"
                          colorScheme={
                            product.status === "active"
                              ? "green"
                              : product.status === "draft"
                              ? "yellow"
                              : product.status === "out-of-stock"
                              ? "red"
                              : "gray"
                          }
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize="14px"
                          fontWeight="600"
                        >
                          <TagLabel>
                            {product.status ? product.status : "N/A"}
                          </TagLabel>
                        </Tag>
                      </Td>

                      {/* Created At */}
                      <Td style={{ padding: "14px" }}>
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleString()
                          : "-"}
                      </Td>

                      {/* Actions */}
                      <Td
                        style={{
                          padding: "14px",
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          size="sm"
                          colorScheme="blue"
                          px={4}
                          py={2}
                          rounded="full"
                          fontWeight="600"
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                          _hover={{ transform: "scale(1.05)" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          px={4}
                          py={2}
                          rounded="full"
                          fontWeight="600"
                          onClick={() => handleDelete(product._id)}
                          _hover={{ transform: "scale(1.05)" }}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination controls */}
          {pageCount > 0 && (
            <Flex justify="center" mt={6}>
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                disabledClassName="disabled"
                forcePage={currentPage} // keep in sync with state
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default Products;
