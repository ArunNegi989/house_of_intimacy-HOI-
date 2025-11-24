import React from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";

// FIXED: default import (not named)
import HorizonLogo from "../../../../assets/images/House_of_intimacy_logo.webp";

import { HSeparator } from "../../../../components/Dashboard/separator/Separator";

export function SidebarBrand() {
  const logoColor = useColorModeValue("navy.700", "white");
  const bgColor = useColorModeValue("white", "navy.800");

  return (
    <Flex
      align="center"
      direction="column"
      bg={bgColor}
      borderRadius="12px"
      py="20px"
      w="100%"
    >
      <img
        src={HorizonLogo}
        alt="HOI Logo"
        style={{ height: "86px", width: "225px" }}
      />

      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
