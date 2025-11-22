import React from "react";
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
  Divider,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const toast = useToast();
  const navigate = useNavigate();

  const pageBg = useColorModeValue(
    "linear-gradient(135deg, #fff5f7, #ffe4ec)",
    "linear-gradient(135deg, #141214, #211624)"
  );
  const cardBg = useColorModeValue("rgba(255,255,255,0.92)", "rgba(26,32,44,0.96)");
  const subtleText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("pink.100", "pink.500");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/forgot-password`, {
        email: data.email,
      });

      toast({
        title: "Check your email",
        description:
          res.data?.message ||
          "If this email exists, we've sent a password reset link.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      reset();
    } catch (err) {
      console.error("Forgot password error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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
          {/* Left side */}
          <Flex
            direction="column"
            justify="space-between"
            bgGradient="linear(to-br, pink.500, purple.500)"
            color="white"
            p={{ base: 7, md: 8 }}
          >
            <Box>
              <Text
                fontSize="sm" // increased
                textTransform="uppercase"
                letterSpacing="0.2em"
                mb={2}
                opacity={0.9}
              >
                Secure Account
              </Text>

              <Heading size="xl" lineHeight="1.2" mb={4}>
                Forgot your password?
              </Heading>

              <Text fontSize="md" opacity={0.9}>
                No worries. Enter your registered email and we&apos;ll send you a
                secure link to reset your password.
              </Text>
            </Box>

            <Box mt={8} fontSize="sm" opacity={0.9}>
              <Text>Tip: Use a strong unique password that you don&apos;t use elsewhere.</Text>
            </Box>
          </Flex>

          {/* Right side form */}
          <Box p={{ base: 6, md: 8 }}>
            <Heading
              as="h1"
              size="lg"
              mb={2}
              textAlign={{ base: "center", md: "left" }}
            >
              Reset access to your account
            </Heading>

            <Text
              fontSize="md"
              color={subtleText}
              mb={6}
              textAlign={{ base: "center", md: "left" }}
            >
              We&apos;ll email you a password reset link if the account exists.
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4} isInvalid={errors.email}>
                <FormLabel fontSize="md">Email address</FormLabel>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdEmail} color="pink.400" boxSize={5} />
                  </InputLeftElement>

                  <Input
                    type="email"
                    fontSize="md" // increased
                    placeholder="you@example.com"
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.800")}
                    _focus={{
                      borderColor: "pink.400",
                      boxShadow: "0 0 0 1px #ED64A6",
                      bg: useColorModeValue("white", "gray.800"),
                    }}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </InputGroup>

                {errors.email && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                width="100%"
                mt={2}
                isLoading={isSubmitting}
                loadingText="Sending..."
                colorScheme="pink"
                borderRadius="full"
                size="lg" // increased
                fontSize="md" // increased
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
              >
                Send reset link
              </Button>

              <Flex align="center" my={4}>
                <Divider />
                <Text mx={2} fontSize="sm" color={subtleText}>
                  or
                </Text>
                <Divider />
              </Flex>

              <Button
                variant="ghost"
                width="100%"
                size="md"
                fontSize="md" // increased
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            </form>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
