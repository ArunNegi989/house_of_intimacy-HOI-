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
  Tag,
  TagLabel,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  // 🎨 Colors (ALL HOOKS MUST BE HERE — TOP LEVEL ONLY)
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const accent = useColorModeValue("pink.500", "pink.300");
  const cardBorderColor = useColorModeValue("gray.100", "whiteAlpha.200");

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
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

  // 🔄 Loading UI
  if (loading) {
    return (
      <Flex minH="70vh" align="center" justify="center" bg={pageBg} px={4}>
        <Stack align="center" spacing={3}>
          <Spinner size="lg" />
          <Text color="gray.500">Loading your profile...</Text>
        </Stack>
      </Flex>
    );
  }

  // ❌ No user
  if (!user) {
    return (
      <Flex minH="70vh" align="center" justify="center" bg={pageBg} px={4}>
        <Box textAlign="center">
          <Heading fontSize="xl" mb={2}>
            No Profile Found
          </Heading>
          <Text color="gray.500">
            We couldn&apos;t load your profile details right now.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
  <Box
    bg={pageBg}
   
    pt={{ base: "90px", md: "180px" }} // header ki height ke hisaab se
    pb={10}
    px={{ base: 4, md: 6 }}
  >
      <Box maxW="1200px" mx="auto">
        {/* Page heading */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>My Profile</Heading>
            <Text color="gray.500" mt={1}>
              Manage your personal information and account details.
            </Text>
          </Box>
        </Flex>

        {/* Main Profile Card */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor={cardBorderColor}   
        >
          {/* Top Banner */}
          <Box
            bgGradient="linear(to-r, pink.500, purple.500)"
            px={{ base: 6, md: 8 }}
            py={6}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              gap={5}
            >
              <Avatar
                name={user.name}
                size="xl"
                bg="whiteAlpha.800"
                color="pink.500"
                boxShadow="lg"
                border="3px solid rgba(255,255,255,0.7)"
                src={user.profileimage || undefined}
              />

              <Box color="white">
                <Flex
                  align={{ base: "flex-start", md: "center" }}
                  gap={3}
                  mb={1}
                  direction={{ base: "column", md: "row" }}
                >
                  <Heading fontSize={{ base: "xl", md: "2xl" }}>
                    {user.name}
                  </Heading>

                  {user.role && (
                    <Tag
                      size="sm"
                      borderRadius="full"
                      variant="solid"
                      bg="whiteAlpha.900"
                      color="pink.600"
                    >
                      <TagLabel textTransform="capitalize">
                        {user.role}
                      </TagLabel>
                    </Tag>
                  )}
                </Flex>

                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: 1, sm: 4 }}
                  fontSize="sm"
                  opacity={0.9}
                >
                  <Flex align="center" gap={2}>
                    <Icon as={FiMail} />
                    <Text>{user.email}</Text>
                  </Flex>

                  {user.phone && (
                    <Flex align="center" gap={2}>
                      <Icon as={FiPhone} />
                      <Text>{user.phone}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Body */}
          <Box px={{ base: 6, md: 8 }} py={6}>
            {/* Info grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontSize="xs" textTransform="uppercase" color={labelColor} mb={1}>
                  Full Name
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FiUser} color={accent} />
                  <Text fontWeight="600" color={valueColor}>
                    {user.name}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" textTransform="uppercase" color={labelColor} >
                  Email
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FiMail} color={accent} />
                  <Text fontWeight="500" color={valueColor}>
                    {user.email}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" textTransform="uppercase" color={labelColor} mb={1}>
                  Phone
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FiPhone} color={accent} />
                  <Text fontWeight="500" color={valueColor}>
                    {user.phone || "Not added yet"}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" textTransform="uppercase" color={labelColor} mb={1}>
                  Address
                </Text>
                <Flex align="flex-start" gap={2}>
                  <Icon as={FiMapPin} mt={0.5} color={accent} />
                  <Text fontWeight="500" color={valueColor}>
                    {user.address || "Not added yet"}
                  </Text>
                </Flex>
              </Box>
            </SimpleGrid>

            <Divider my={6} />

            {/* Actions */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={3}
            >
              <Text fontSize="sm" color="gray.500">
                Keep your profile information up to date for a better HOI
                experience.
              </Text>

              <Button
                variant="solid"
                borderRadius="full"
                px={6}
                bg={accent}
                _hover={{ bg: "pink.600" }}
                color="white"
                fontWeight="600"
                fontSize="sm"
              >
                Edit Profile (coming soon)
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
