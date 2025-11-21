import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.webp";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

export default function VerifyEmail() {
  const textColor = useColorModeValue("navy.700", "black");
  const textColorSecondary = useColorModeValue("gray.500", "black");

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from SignUp
  const emailFromState = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: emailFromState },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        otp: data.otp,
      };

      const res = await axios.post(
        `${baseUrl}/auth/register/verify-otp`,
        payload
      );

      toast({
        title: "Email verified",
        description: res.data?.message || "Account created successfully.",
        status: "success",
        duration: 3000,
      });

      navigate("/login");
    } catch (err) {
      toast({
        title: "Verification failed",
        description: err.response?.data?.message || "Something went wrong",
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
        minH="calc(100vh - 140px)"
        alignItems="start"
        justifyContent="center"
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "10vh" }}
        pb="80px"
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Verify your Email
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400">
            We sent a 6-digit code to your email. Enter it below.
          </Text>
        </Box>

        <Flex direction="column" w={{ base: "100%", md: "420px" }} maxW="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb="4">
              <FormLabel color={textColor} fontSize="sm">
                Email
              </FormLabel>
              <Input
                type="email"
                variant="auth"
                isReadOnly={!!emailFromState}
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

            <FormControl mb="6">
              <FormLabel color={textColor} fontSize="sm">
                OTP Code
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                variant="auth"
                maxLength={6}
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 4, message: "Minimum 4 digits" },
                })}
              />
              {errors.otp && (
                <Text color="red.400" fontSize="xs" mt="1">
                  {errors.otp.message}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              w="100%"
              h="50px"
              variant="brand"
              isLoading={isSubmitting}
            >
              Verify & Create Account
            </Button>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
