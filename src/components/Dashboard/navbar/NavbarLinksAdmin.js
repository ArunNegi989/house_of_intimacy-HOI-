// Chakra Imports
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";

// Custom Components
import { SearchBar } from "../../../components/Dashboard/navbar/searchBar/SearchBar";
import PropTypes from "prop-types";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Icons
import { MdNotificationsNone } from "react-icons/md";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { FiMenu } from "react-icons/fi";

// Routes
import routes from "routes";

export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  const menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  // 🔐 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    navigate("/login");
  };

  // Only admin routes that should show in sidebar
  const adminRoutes = routes.filter(
    (r) => r.layout === "/admin" && r.showInSidebar !== false
  );

  return (
    <>
      {/* TOP BAR */}
      <Flex
        w="100%"
        alignItems="center"
        justify="space-between"
        bg={menuBg}
        p="10px 16px"
        borderRadius="30px"
        boxShadow={shadow}
        gap={3}
      >
        {/* LEFT: Hamburger + Brand */}
        <HStack spacing={3}>
          {/* Hamburger - mobile only */}
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            onClick={onOpen}
            display={{ base: "inline-flex", md: "none" }}
            variant="ghost"
            fontSize="20px"
          />

          {/* Brand text - hide on very small screens if you want */}
         
        </HStack>

        {/* CENTER: Search bar */}
        <Box flex="1" mx={{ base: 2, md: 6 }}>
          <SearchBar
            mb={() => {
              if (secondary) {
                return { base: "10px", md: "unset" };
              }
              return "unset";
            }}
            borderRadius="30px"
          />
        </Box>

        {/* RIGHT: Actions */}
        <HStack spacing={3}>
          

          {/* Notifications (dummy) */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              variant="ghost"
              icon={<MdNotificationsNone size={20} />}
            />
            <MenuList bg={menuBg} border="none" boxShadow={shadow}>
              <MenuItem>
                <Text fontSize="sm">No new notifications</Text>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* User menu */}
          <Menu>
            <MenuButton p="0px">
              <Avatar
                _hover={{ cursor: "pointer" }}
                color="white"
                name="HOI Admin"
                bg="#11047A"
                size="sm"
                w="40px"
                h="40px"
              />
            </MenuButton>
            <MenuList
              boxShadow={shadow}
              p="0px"
              mt="10px"
              borderRadius="20px"
              bg={menuBg}
              border="none"
            >
              <Flex w="100%" mb="0px">
                <Text
                  ps="20px"
                  pt="16px"
                  pb="10px"
                  w="100%"
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  fontSize="sm"
                  fontWeight="700"
                  color={textColor}
                >
                  👋&nbsp; Hey, Admin
                </Text>
              </Flex>
              <Flex flexDirection="column" p="10px">
               
                
                <MenuItem
                  _hover={{ bg: "none" }}
                  _focus={{ bg: "none" }}
                  color="red.400"
                  borderRadius="8px"
                  px="14px"
                  onClick={handleLogout}
                >
                  <Text fontSize="sm">Log out</Text>
                </MenuItem>
              </Flex>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* 📱 MOBILE DRAWER NAV */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={menuBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            HOI Admin
          </DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={1} mt={2}>
              {adminRoutes.map((route) => (
                <NavLink
                  key={route.layout + route.path}
                  to={route.layout + route.path}
                  style={{ textDecoration: "none" }}
                  onClick={onClose} // ✅ auto-close drawer on navigation
                >
                  {({ isActive }) => (
                    <Flex
                      align="center"
                      px={3}
                      py={2.5}
                      borderRadius="lg"
                      bg={isActive ? "pink.500" : "transparent"}
                      color={isActive ? "white" : textColor}
                      _hover={{
                        bg: isActive ? "pink.600" : "pink.50",
                        color: isActive ? "white" : "pink.500",
                      }}
                      transition="all 0.15s ease"
                    >
                      {route.icon && (
                        <Box
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          mr={3}
                        >
                          {route.icon}
                        </Box>
                      )}
                      <Text fontWeight="500" fontSize="sm">
                        {route.name}
                      </Text>
                    </Flex>
                  )}
                </NavLink>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
