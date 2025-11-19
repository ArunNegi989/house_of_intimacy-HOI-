import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Button,
  Stack,
  Divider,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      // agar token hi nahi → login page
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/users/userdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Profile load error:", err);

        if (err.response?.status === 401) {
          // token invalid / expired → logout and redirect
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          localStorage.removeItem("userName");

          toast({
            title: "Session expired",
            description: "Please log in again.",
            status: "warning",
            duration: 3000,
          });

          navigate("/login");
        } else {
          toast({
            title: "Failed to load profile",
            description:
              err.response?.data?.message || "Something went wrong.",
            status: "error",
            duration: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <Box
        maxW="800px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={10}
        textAlign="center"
      >
        <Spinner />
        <Text mt={3} color="gray.500">
          Loading your profile...
        </Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        maxW="800px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={10}
        textAlign="center"
      >
        <Text color="gray.500">No profile data found.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }} py={10}>
      <Heading fontSize="2xl" mb={6}>
        My Profile
      </Heading>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        align={{ base: "flex-start", md: "center" }}
      >
        <Avatar
          name={user.name}
          size="xl"
          bg="pink.400"
          color="white"
          shadow="md"
          src={user.profileimage || undefined}
        />

        <Box flex="1">
          <Stack spacing={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Full Name
              </Text>
              <Text fontWeight="600">{user.name}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Email
              </Text>
              <Text fontWeight="500">{user.email}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Phone
              </Text>
              <Text fontWeight="500">{user.phone}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">
                Address
              </Text>
              <Text fontWeight="500">{user.address}</Text>
            </Box>
          </Stack>

          <Divider my={6} />

          <Button variant="outline" borderRadius="full">
            Edit Profile (coming soon)
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
