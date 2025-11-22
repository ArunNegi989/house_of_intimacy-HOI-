// src/views/auth/signIn.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Link, Text } from "@chakra-ui/react";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { HSeparator } from "../../../components/Dashboard/separator/Separator";
import DefaultAuth from "layouts/auth/Default";

import illustration from "../../../assets/img/auth/auth.webp";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

import axios from "axios";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("gray.500", "gray.400");
  const textColorDetails = useColorModeValue("gray.400", "gray.400");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${baseUrl}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      // EXPECTED RESPONSE:
      // { success: true, token: "...", user: { name, email, role } }
      const { token, user } = res.data || {};

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // ⚡ Keep me logged in → localStorage, otherwise sessionStorage
      const storage = values.rememberMe ? localStorage : sessionStorage;

      storage.setItem("authToken", token);
      storage.setItem("userRole", (user.role || "user").toLowerCase());
      storage.setItem("userName", user.name || "");
      storage.setItem("userEmail", user.email || "");

      toast({
        title: "Login successful",
        description:
          user.role && user.role.toLowerCase() === "admin"
            ? "Welcome, Admin!"
            : "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // 🧭 Redirect based on role
      const role = (user.role || "").toLowerCase().trim();

      if (role === "admin") {
        navigate("/admin/admin_dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while logging in.";

      toast({
        title: "Login failed",
        description: msg,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="center"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Welcome Back
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>

        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          {/* Google Button (Optional) */}
          <Button
            fontSize="sm"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg="white"
            color="gray.600"
            fontWeight="500"
            _hover={{ bg: "gray.100" }}
            leftIcon={<Icon as={FcGoogle} w="20px" h="20px" />}
          >
            Sign in with Google
          </Button>

          <HSeparator mb="26px" />

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            <FormControl mb="24px" isInvalid={errors.email}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color="brand.500">*</Text>
              </FormLabel>
              <Input
                type="email"
                placeholder="mail@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <Text color="red.400" fontSize="xs" mt={1}>
                  {errors.email.message}
                </Text>
              )}
            </FormControl>

            {/* PASSWORD */}
            <FormControl mb="24px" isInvalid={errors.password}>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color="brand.500">*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <InputRightElement
                  onClick={() => setShowPassword((prev) => !prev)}
                  cursor="pointer"
                >
                  <Icon
                    as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color="red.400" fontSize="xs" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </FormControl>

            {/* REMEMBER ME + FORGOT */}
            <Flex justifyContent="space-between" align="center" mb="24px">
              <Checkbox
                colorScheme="brand"
                {...register("rememberMe")}
                defaultChecked
              >
                <Text color={textColorDetails} fontSize="sm">
                  Keep me logged in
                </Text>
              </Checkbox>

              <NavLink to="/auth/forgot-password">
                <Text fontSize="sm" textAlign="right" mt={2}>
  <Link as={RouterLink} to="/forgot-password" color="pink.500">
    Forgot password?
  </Link>
</Text>
              </NavLink>
            </Flex>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              fontSize="sm"
              variant="solid"
              colorScheme="brand"
              w="100%"
              h="50"
              mb="24px"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* REGISTER LINK */}
          <Flex justifyContent="center" align="center">
            <Text color={textColorDetails} fontSize="sm" me="4px">
              Not registered yet?
            </Text>
            <NavLink to="/auth/create_new_user">
              <Text
                color="brand.500"
                fontSize="sm"
                fontWeight="500"
                textDecoration="underline"
              >
                Create an account
              </Text>
            </NavLink>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
