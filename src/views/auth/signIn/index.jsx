import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { HSeparator } from "../../../components/Dashboard/separator/Separator";
import DefaultAuth from "layouts/auth/Default";

import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

import axios from "axios";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "black");
  const textColorSecondary = useColorModeValue("gray.500", "black");
  const textColorDetails = useColorModeValue("gray.600", "black");
  const textColorBrand = useColorModeValue("brand.500", "black");
  const brandStars = useColorModeValue("brand.500", "brand.300");
  const inputTextColor = useColorModeValue("navy.700", "white");

  const [show, setShow] = React.useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // rememberMe aayega, but abhi hum token storage ke liye use nahi kar rahe
      const { rememberMe, ...loginPayload } = data;

      const res = await axios.post(`${baseUrl}/auth/login`, loginPayload);

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data || {};

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // 🔐 ALWAYS use localStorage → new tab me bhi login rahega
      localStorage.setItem("authToken", token);

      if (user.name) {
        localStorage.setItem("userName", user.name);
      }

      if (user.role) {
        localStorage.setItem("userRole", user.role);
      }

      // (Optional) rememberMe ko bhi save kar sakte ho agar aage use karna ho
      localStorage.setItem("rememberMe", rememberMe ? "1" : "0");

      toast({
        title: "Login Successful",
        status: "success",
        duration: 2000,
      });

      const normalizedRole = (user.role || "").toLowerCase().trim();
      const isAdmin = normalizedRole === "admin";

      if (isAdmin) {
        navigate("/admin/admin_dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
      });
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
        alignItems="start"
        justifyContent="center"
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "0vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400">
            Enter your email and password to sign in!
          </Text>
        </Box>

        <Flex direction="column" w={{ base: "100%", md: "420px" }} maxW="100%">
          <Button
            mb="26px"
            h="50px"
            borderRadius="16px"
            bg="gray.300"
            color="black"
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Sign in with Google
          </Button>

          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb="20px">
              <FormLabel color={textColor} fontSize="sm">
                Email <Text as="span" color={brandStars}>*</Text>
              </FormLabel>

              <Input
                type="email"
                placeholder="mail@example.com"
                variant="auth"
                color={inputTextColor}
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <Text color="red.400" fontSize="xs" mt="1">
                  {errors.email.message}
                </Text>
              )}
            </FormControl>

            <FormControl mb="24px">
              <FormLabel color={textColor} fontSize="sm">
                Password <Text as="span" color={brandStars}>*</Text>
              </FormLabel>

              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  variant="auth"
                  color={inputTextColor}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />

                <InputRightElement>
                  <Icon
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={() => setShow(!show)}
                    cursor="pointer"
                    color={textColorSecondary}
                  />
                </InputRightElement>
              </InputGroup>

              {errors.password && (
                <Text color="red.400" fontSize="xs" mt="1">
                  {errors.password.message}
                </Text>
              )}
            </FormControl>

            <Flex justifyContent="space-between" mb="24px" align="center">
              <Checkbox
                colorScheme="brandScheme"
                {...register("rememberMe")}
              >
                Keep me logged in
              </Checkbox>

              <NavLink to="/auth/forgot-password">
                <Text color={textColorBrand} fontWeight="500" fontSize="sm">
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>

            <Button
              type="submit"
              w="100%"
              h="50px"
              variant="brand"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <Text color={textColorDetails} mt="20px">
            Not registered yet?
            <NavLink to="/auth/create_new_user">
              <Text as="span" color={textColorBrand} ms="5px" fontWeight="500">
                Create an Account
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
