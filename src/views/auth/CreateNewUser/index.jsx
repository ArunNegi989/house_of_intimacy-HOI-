import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
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

function SignUp() {
  const textColor = useColorModeValue("navy.700", "black");
  const textColorSecondary = useColorModeValue("gray.500", "black");
  const textColorDetails = useColorModeValue("gray.600", "black");
  const textColorBrand = useColorModeValue("brand.500", "black");
  const brandStars = useColorModeValue("brand.500", "brand.300");
  const inputTextColor = useColorModeValue("navy.700", "white");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = watch("password");

 const onSubmit = async (data) => {
  try {
    const { confirmPassword, ...payload } = data;

    // 1) Call API to send OTP
    const res = await axios.post(`${baseUrl}/auth/register/send-otp`, payload);

    toast({
      title: "OTP sent",
      description: res.data?.message || "Check your email for the code.",
      status: "success",
      duration: 3000,
    });

    // 2) Go to OTP verify page and pass email
    navigate("/auth/verify-email", { state: { email: payload.email } });
  } catch (err) {
    toast({
      title: "Registration failed",
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
            Create an Account
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400">
            Enter your details to sign up!
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
            Sign up with Google
          </Button>

          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ⭐⭐ ROW 1 → NAME + EMAIL ⭐⭐ */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm">
                    Name <Text as="span" color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    variant="auth"
                    color={inputTextColor}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 3, message: "At least 3 characters" },
                    })}
                  />
                  {errors.name && (
                    <Text color="red.400" fontSize="xs" mt="1">
                      {errors.name.message}
                    </Text>
                  )}
                </FormControl>
              </div>

              <div className="col-md-6 mb-3">
                <FormControl>
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
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <Text color="red.400" fontSize="xs" mt="1">
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>
              </div>
            </div>

            {/* ⭐⭐ ROW 2 → PHONE + ADDRESS ⭐⭐ */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm">
                    Phone Number <Text as="span" color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    variant="auth"
                    color={inputTextColor}
                    {...register("phone", {
                      required: "Phone is required",
                      minLength: { value: 10, message: "Min 10 digits" },
                    })}
                  />
                  {errors.phone && (
                    <Text color="red.400" fontSize="xs" mt="1">
                      {errors.phone.message}
                    </Text>
                  )}
                </FormControl>
              </div>

              <div className="col-md-6 mb-3">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm">
                    Address <Text as="span" color={brandStars}>*</Text>
                  </FormLabel>
                  <Textarea
                    placeholder="Enter your address"
                    variant="auth"
                    color={inputTextColor}
                    resize="vertical"
                    minH="80px"
                    {...register("address", {
                      required: "Address is required",
                      minLength: { value: 5, message: "Min 5 characters" },
                    })}
                  />
                  {errors.address && (
                    <Text color="red.400" fontSize="xs" mt="1">
                      {errors.address.message}
                    </Text>
                  )}
                </FormControl>
              </div>
            </div>

            {/* ⭐⭐ ROW 3 → PASSWORD + CONFIRM PASSWORD ⭐⭐ */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm">
                    Password <Text as="span" color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      variant="auth"
                      color={inputTextColor}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "At least 8 characters",
                        },
                      })}
                    />
                    <InputRightElement>
                      <Icon
                        as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={() => setShowPassword(!showPassword)}
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
              </div>

              <div className="col-md-6 mb-3">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm">
                    Confirm Password <Text as="span" color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      variant="auth"
                      color={inputTextColor}
                      {...register("confirmPassword", {
                        required: "Confirm your password",
                        validate: (value) =>
                          value === passwordValue || "Passwords do not match",
                      })}
                    />
                    <InputRightElement>
                      <Icon
                        as={
                          showConfirmPassword
                            ? RiEyeCloseLine
                            : MdOutlineRemoveRedEye
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        cursor="pointer"
                        color={textColorSecondary}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirmPassword && (
                    <Text color="red.400" fontSize="xs" mt="1">
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </FormControl>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              w="100%"
              h="50px"
              variant="brand"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>
          </form>

          <Text color={textColorDetails} mt="20px">
            Already have an account?
            <NavLink to="/login">
              <Text as="span" color={textColorBrand} ms="5px" fontWeight="500">
                Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
