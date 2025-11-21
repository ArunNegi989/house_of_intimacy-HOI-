// src/pages/management/users/index.jsx
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
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import ReactPaginate from "react-paginate";
import "../../../assets/styles/Users.module.css"; // pagination CSS

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

const Products = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // per page users

  const toast = useToast();
  const navigate = useNavigate();

  // PRE-CALCULATED COLORS
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const headerBg = useColorModeValue("#6B46C1", "#553C9A");
  const headerTextColor = useColorModeValue("white", "white");
  const rowHoverBg = useColorModeValue("gray.100", "gray.700");

  // DELETE HANDLER
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

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
        });
        navigate("/login");
        return;
      }

      const res = await axios.delete(`${baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.success) {
        toast({
          title: "User Deleted",
          description: "User removed successfully.",
          status: "success",
          duration: 3000,
        });

        // update list + fix page if last item removed
        setUsers((prev) => {
          const updated = prev.filter((u) => u._id !== userId);
          const totalPages = Math.ceil(updated.length / itemsPerPage);
          if (currentPage >= totalPages && currentPage > 0) {
            setCurrentPage(currentPage - 1);
          }
          return updated;
        });
      }
    } catch (err) {
      toast({
        title: "Delete Error",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        duration: 4000,
      });
    }
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        toast({
          title: "Not logged in",
          description: "Please login to view users list.",
          status: "warning",
          duration: 3000,
        });
        navigate("/login");
        return;
      }

      const res = await axios.get(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast({
        title: "Error Fetching Users",
        description: err.response?.data?.message || "Error loading users.",
        status: "error",
      });

      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // client-side pagination logic
  const pageCount = Math.ceil(users.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentUsers = users.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Box
      bg={pageBg}
      pt={{ base: "90px", md: "120px" }} // header ki height ke hisaab se
      pb={10}
      px={{ base: 4, md: 6 }}
    >
      {/* Top bar: Title + Back button (right side) */}
     <Flex justify="end" align="center" mb={4}>
 

  <Flex gap={3}>
    <Button
      colorScheme="green"
     onClick={() => navigate("/admin/products/add-new")} // 🔥 yahan change
      rounded="full"
      px={6}
      py={2}
      fontWeight="600"
    >
      Add Products
    </Button>

    <Button
      colorScheme="purple"
      onClick={() => navigate(-1)}
      rounded="full"
      px={6}
      py={2}
      fontWeight="600"
    >
      Back
    </Button>
  </Flex>
</Flex>


      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : users.length === 0 ? (
        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          textAlign="center"
          boxShadow="md"
          mt={4}
        >
          <Text>No users found.</Text>
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
                  <Th style={{ padding: "16px", color: "white" }}>Name</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Email</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Phone</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Address</Th>
                  <Th style={{ padding: "16px", color: "white" }}>Role</Th>
                  <Th style={{ padding: "16px", color: "white" }}>
                    Created At
                  </Th>
                  <Th style={{ padding: "16px", color: "white" }}>Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {currentUsers.map((user, index) => (
                  <Tr
                    key={user._id}
                    style={{ transition: "0.2s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = rowHoverBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Td style={{ padding: "14px", fontWeight: "600" }}>
                      {offset + index + 1}
                    </Td>

                    <Td style={{ padding: "14px" }}>{user.name}</Td>
                    <Td style={{ padding: "14px" }}>{user.email}</Td>
                    <Td style={{ padding: "14px" }}>{user.phone}</Td>
                    <Td style={{ padding: "14px" }}>{user.address}</Td>

                    <Td style={{ padding: "14px" }}>
                      <Tag
                        size="md"
                        colorScheme={
                          user.role === "admin"
                            ? "purple"
                            : user.role === "moderator"
                            ? "blue"
                            : "green"
                        }
                        px={3}
                        py={1}
                        rounded="full"
                        fontSize="14px"
                        fontWeight="600"
                      >
                        <TagLabel>{user.role}</TagLabel>
                      </Tag>
                    </Td>

                    <Td style={{ padding: "14px" }}>
                      {new Date(user.createdAt).toLocaleString()}
                    </Td>

                    <Td
                      style={{
                        padding: "14px",
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* EDIT BUTTON */}
                      <Button
                        size="sm"
                        colorScheme="blue"
                        px={4}
                        py={2}
                        rounded="full"
                        fontWeight="600"
                        onClick={() =>
                          navigate(`/management/users/edit/${user._id}`)
                        }
                        _hover={{ transform: "scale(1.05)" }}
                      >
                        Edit
                      </Button>

                      {/* DELETE BUTTON */}
                      <Button
                        size="sm"
                        colorScheme="red"
                        px={4}
                        py={2}
                        rounded="full"
                        fontWeight="600"
                        onClick={() => handleDelete(user._id)}
                        _hover={{ transform: "scale(1.05)" }}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination controls */}
          {pageCount > 1 && (
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
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default Products;
