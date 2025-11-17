import React from "react";

// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import BarChart from "../../../../components/Dashboard/charts/BarChart";

// Custom components
import Card from "../../../../components/Dashboard/card/Card";
import {
  barChartDataDailyTraffic,
  barChartOptionsDailyTraffic,
} from "variables/charts";

// Assets
import { RiArrowUpSFill } from "react-icons/ri";

export default function DailyTraffic(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "blackAlpha.900");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "blackAlpha.900");
  const cardBg = useColorModeValue("white",  'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');

  return (
    <Card
      align="center"
      direction="column"
      w="100%"
      bg={cardBg}      // 🔹 card background light/dark
      {...rest}
    >
      <Flex justify="space-between" align="start" px="10px" pt="5px">
        <Flex flexDirection="column" align="start" me="20px">
          <Flex w="100%">
            <Text
              me="auto"
              color={textColorSecondary}   // 🔹 muted text color
              fontSize="sm"
              fontWeight="500"

            >
              Daily Traffic
            </Text>
          </Flex>
          <Flex align="end">
            <Text
              color={textColor}           // 🔹 main text color
              fontSize="34px"
              fontWeight="700"
              lineHeight="100%"
            >
              2.579
            </Text>
            <Text
              ms="6px"
              color={textColorSecondary}
              fontSize="sm"
              fontWeight="500"
            >
              Visitors
            </Text>
          </Flex>
        </Flex>
        <Flex align="center">
          <Icon as={RiArrowUpSFill} color="green.500" />
          <Text color="green.500" fontSize="sm" fontWeight="700">
            +2.45%
          </Text>
        </Flex>
      </Flex>
      <Box h="240px" mt="auto">
        <BarChart
          chartData={barChartDataDailyTraffic}
          chartOptions={barChartOptionsDailyTraffic}
        />
      </Box>
    </Card>
  );
}
