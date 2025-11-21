import React from "react";

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Content from "../../../components/Dashboard/sidebar/components/Content";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "../../../components/Dashboard/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";

// Assets
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
  const { routes } = props;

  // 👉 sirf woh routes jo sidebar mein dikhne chahiye
  const visibleRoutes = routes?.filter(
    (route) => route.showInSidebar !== false // undefined = dikhao, false = hide
  );

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";

  return (
    <Box display={{ sm: "none", xl: "block" }} w="100%" position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          {/* 👇 ab Content ko filtered routes milenge */}
          <Content routes={visibleRoutes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props) {
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { routes } = props;

  // 👇 yahan bhi sidebar mein sirf visible routes bhejo
  const visibleRoutes = routes?.filter(
    (route) => route.showInSidebar !== false
  );

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={visibleRoutes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

// PROPS
Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
