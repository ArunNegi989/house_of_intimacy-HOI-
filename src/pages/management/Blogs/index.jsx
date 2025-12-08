// src/pages/management/blogs/index.jsx
import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import ReactPaginate from 'react-paginate';
import '../../../assets/styles/Users.module.css'; // pagination CSS

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
// API root (without /v1) for images like /uploads/...
const apiRoot = baseUrl.replace(/\/v1$/, '');

export const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state (frontend 0-based, backend 1-based)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 10;

  const toast = useToast();
  const navigate = useNavigate();

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const headerBg = useColorModeValue('#D63384', '#97266D');
  const headerTextColor = useColorModeValue('white', 'white');
  const rowHoverBg = useColorModeValue('gray.100', 'gray.700');

  // 👉 FETCH BLOGS (public route, but we optionally send token)
  const fetchBlogs = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const page = pageIndex + 1; // backend page starts from 1

      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      const config = {};
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await axios.get(
        `${baseUrl}/myblogs/allblogs?page=${page}&limit=${itemsPerPage}`,
        config,
      );

      console.log('BLOGS RESPONSE:', res.data);

      // Backend returns: { blogs, total, page, pages }
      const blogsArray = res.data.blogs || [];
      setBlogs(blogsArray);

      const pages = res.data.pagination?.totalPages || res.data.pages || 0;

      setPageCount(pages || 0);
      setCurrentPage(pageIndex);
    } catch (err) {
      console.error('Error loading blogs:', err);
      toast({
        title: 'Error Fetching Blogs',
        description: err.response?.data?.message || 'Error loading blogs.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageClick = ({ selected }) => {
    fetchBlogs(selected);
  };

  // DELETE HANDLER (protected: needs token)
  const handleDelete = async (blogId) => {
    try {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (!token) {
        toast({
          title: 'Not logged in',
          description: 'Please login again.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
        navigate('/login');
        return;
      }

      toast({
        title: 'Deleting blog...',
        description: 'Please wait while we remove this blog.',
        status: 'info',
        duration: 1500,
        isClosable: true,
        position: 'bottom-right',
      });

      await axios.delete(`${baseUrl}/myblogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Blog Deleted',
        description: 'Blog removed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });

      // refetch current page
      fetchBlogs(currentPage);
    } catch (err) {
      console.error('Delete blog error:', err);
      toast({
        title: 'Delete Error',
        description: err.response?.data?.message || 'Server error.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <Box
      bg={pageBg}
      pt={{ base: '150px', md: '120px' }}
      pb={10}
      px={{ base: 4, md: 6 }}
    >
      {/* Top bar: Add Blog */}
      <Flex justify="flex-end" align="center" mb={4}>
        <Flex gap={3}>
          <Button
            colorScheme="pink"
            onClick={() => navigate('/admin/blogs/add-new')}
            rounded="full"
            px={6}
            py={2}
            fontWeight="600"
          >
            Add Blog
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : blogs.length === 0 ? (
        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          textAlign="center"
          boxShadow="md"
          mt={4}
        >
          <Text>No blogs found.</Text>
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
              style={{ fontSize: '16px' }}
            >
              <Thead>
                <Tr
                  style={{
                    background: headerBg,
                    color: headerTextColor,
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Th style={{ padding: '16px', color: 'white' }}>S No.</Th>
                  <Th style={{ padding: '16px', color: 'white' }}>Image</Th>
                  <Th style={{ padding: '16px', color: 'white' }}>Title</Th>
                  <Th style={{ padding: '16px', color: 'white' }}>Slug</Th>
                  <Th style={{ padding: '16px', color: 'white' }}>Status</Th>
                  <Th style={{ padding: '16px', color: 'white' }}>
                    Created At
                  </Th>
                  <Th style={{ padding: '16px', color: 'white' }}>Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {blogs.map((blog, index) => {
                  const featureImageUrl = blog.featureImage
                    ? `${apiRoot}${blog.featureImage}`
                    : null;

                  const isDraft = blog.status === 'draft';

                  return (
                    <Tr
                      key={blog._id}
                      style={{ transition: '0.2s' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = rowHoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      {/* S No. */}
                      <Td style={{ padding: '14px', fontWeight: '600' }}>
                        {currentPage * itemsPerPage + index + 1}
                      </Td>

                      {/* Thumbnail Image */}
                      <Td style={{ padding: '14px' }}>
                        {featureImageUrl ? (
                          <Image
                            src={featureImageUrl}
                            alt={blog.mainHeading}
                            boxSize="70px"
                            objectFit="cover"
                            objectPosition="center"
                            borderRadius="md"
                            border="1px solid #E2E8F0"
                          />
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            No image
                          </Text>
                        )}
                      </Td>

                      {/* Title */}
                      <Td style={{ padding: '14px' }}>
                        <Text fontWeight="600">
                          {blog.mainHeading || 'Untitled blog'}
                        </Text>
                      </Td>

                      {/* Slug */}
                      <Td style={{ padding: '14px' }}>
                        <Text fontSize="sm" color="gray.700">
                          {blog.slug || '-'}
                        </Text>
                      </Td>

                      {/* Status */}
                      <Td style={{ padding: '14px' }}>
                        <Tag
                          size="md"
                          colorScheme={isDraft ? 'yellow' : 'green'}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize="14px"
                          fontWeight="600"
                        >
                          <TagLabel>{isDraft ? 'Draft' : 'Published'}</TagLabel>
                        </Tag>
                      </Td>

                      {/* Created At */}
                      <Td style={{ padding: '14px' }}>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleString()
                          : '-'}
                      </Td>

                      {/* Actions */}
                      <Td
                        style={{
                          padding: '14px',
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Button
                          size="sm"
                          colorScheme="blue"
                          px={4}
                          py={2}
                          rounded="full"
                          fontWeight="600"
                          onClick={() => navigate(`/admin/blogs/${blog._id}`)}
                          _hover={{ transform: 'scale(1.05)' }}
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
                          onClick={() => handleDelete(blog._id)}
                          _hover={{ transform: 'scale(1.05)' }}
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
                forcePage={currentPage}
              />
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default AllBlogs;
