import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  SimpleGrid,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

const ResetPassword = () => {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const toast = useToast();
  const navigate = useNavigate();

  // 👉 State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pageBg = useColorModeValue(
    "linear-gradient(135deg, #fff5f7, #ffe4ec)",
    "linear-gradient(135eg, #141214, #211624)"
  );
  const cardBg = useColorModeValue("rgba(255,255,255,0.92)", "rgba(26,32,44,0.96)");
  const subtleText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("pink.100", "pink.500");

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/reset-password`, {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast({
        title: "Password updated",
        description:
          res.data?.message || "Your password has been reset successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset();
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Token is invalid or expired. Please try again.";

      toast({
        title: "Error",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      bg={pageBg}
      align="center"
      justify="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 8, md: 10 }}
    >
      <Box
        maxW="920px"
        w="100%"
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        backdropFilter="blur(18px)"
        overflow="hidden"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          {/* LEFT SIDE */}
          <Flex
            direction="column"
            justify="space-between"
            bgGradient="linear(to-br, pink.500, purple.500)"
            color="white"
            p={{ base: 7, md: 8 }}
          >
            <Box>
              <Text
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="0.2em"
                mb={2}
                opacity={0.9}
              >
                Secure Account
              </Text>

              <Heading size="xl" mb={4}>
                Reset your password
              </Heading>

              <Text fontSize="md" opacity={0.9}>
                Choose a strong new password to keep your HOI account safe.
              </Text>
            </Box>

            <Box mt={10} fontSize="sm" opacity={0.9}>
              <Text>
                Tip: Use at least 8 characters with numbers & symbols for best security.
              </Text>
            </Box>
          </Flex>

          {/* RIGHT SIDE FORM */}
          <Box p={{ base: 6, md: 8 }}>
            <Heading size="lg" mb={2}>
              Create new password
            </Heading>

            <Text fontSize="md" color={subtleText} mb={6}>
              Enter and confirm your new password below.
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* PASSWORD FIELD */}
              <FormControl mb={4} isInvalid={errors.password}>
                <FormLabel fontSize="md">New Password</FormLabel>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdLock} color="pink.400" boxSize={5} />
                  </InputLeftElement>

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    fontSize="md"
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.800")}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px #ED64A6",
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />

                  {/* 👁️ Show/Hide Button */}
                  <InputRightElement onClick={() => setShowPassword(!showPassword)} cursor="pointer">
                    <Icon as={showPassword ? MdVisibilityOff : MdVisibility} color="pink.400" />
                  </InputRightElement>
                </InputGroup>

                {errors.password && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
              </FormControl>

              {/* CONFIRM PASSWORD FIELD */}
              <FormControl mb={4} isInvalid={errors.confirmPassword}>
                <FormLabel fontSize="md">Confirm Password</FormLabel>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdLock} color="pink.400" boxSize={5} />
                  </InputLeftElement>

                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    fontSize="md"
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.800")}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px #ED64A6",
                    }}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />

                  {/* 👁️ Show/Hide Button */}
                  <InputRightElement onClick={() => setShowConfirm(!showConfirm)} cursor="pointer">
                    <Icon as={showConfirm ? MdVisibilityOff : MdVisibility} color="pink.400" />
                  </InputRightElement>
                </InputGroup>

                {errors.confirmPassword && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                width="100%"
                size="lg"
                fontSize="md"
                isLoading={isSubmitting}
                loadingText="Updating..."
                colorScheme="pink"
                borderRadius="full"
                mt={2}
              >
                Update Password
              </Button>

              <Flex align="center" my={4}>
                <Divider />
                <Text mx={2} fontSize="sm" color={subtleText}>
                  or
                </Text>
                <Divider />
              </Flex>

              <Button variant="ghost" width="100%" size="md" fontSize="md" onClick={() => navigate("/login")}>
                Back to login
              </Button>
            </form>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default ResetPassword;
