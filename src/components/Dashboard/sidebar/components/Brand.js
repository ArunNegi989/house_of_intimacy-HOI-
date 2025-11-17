import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "../../../../components/Dashboard/icons/Icons";
import { HSeparator } from "../../../../components/Dashboard/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  const logoColor = useColorModeValue("navy.700", "white");

  // ⭐ Add background support for dark mode
  const bgColor = useColorModeValue("white", "navy.800");

  return (
    <Flex
      align="center"
      direction="column"
      bg={bgColor}        // ⭐ Background updates in dark mode
      borderRadius="12px" // Optional styling
      py="20px"
      w="100%"
    >
      <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
