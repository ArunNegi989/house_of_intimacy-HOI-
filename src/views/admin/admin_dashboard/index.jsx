import React from "react";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

// Assets
import Usa from "assets/img/dashboards/usa.png";

// Custom components
import MiniCalendar from "../../../components/Dashboard/calendar/MiniCalendar";
import MiniStatistics from "../../../components/Dashboard/card/MiniStatistics";
import IconBox from "../../../components/Dashboard/icons/IconBox";

import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";

import CheckTable from "views/admin/admin_dashboard/components/CheckTable";
import ComplexTable from "views/admin/admin_dashboard/components/ComplexTable";
import DailyTraffic from "views/admin/admin_dashboard/components/DailyTraffic";
import PieCard from "views/admin/admin_dashboard/components/PieCard";
import Tasks from "views/admin/admin_dashboard/components/Tasks";
import TotalSpent from "views/admin/admin_dashboard/components/TotalSpent";
import WeeklyRevenue from "views/admin/admin_dashboard/components/WeeklyRevenue";

import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/admin_dashboard/variables/columnsData";
import tableDataCheck from "views/admin/admin_dashboard/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/admin_dashboard/variables/tableDataComplex.json";

export default function UserReports() {
  // Chakra Color Mode values
    const brandColor = useColorModeValue("brand.500", "brand.200");
  const iconBoxBg = useColorModeValue("secondaryGray.300",  'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const cardBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const pageBg = useColorModeValue("gray.50", "navy.900"); // ⭐ new
  const gradientBg = useColorModeValue(
    "linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)", // light
    "linear-gradient(90deg, #1f2933 0%, #020617 100%)" // dark
  );

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      bg={pageBg} 
      color={textColor}
      className="mt-4"
    >
      {/* TOP STATS */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          bg={iconBoxBg}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={iconBoxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Earnings"
          value="$350.4"
        />

        <MiniStatistics
          bg={cardBg}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={iconBoxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdAttachMoney}
                  color={brandColor}
                />
              }
            />
          }
          name="Spend this month"
          value="$642.39"
        />

        <MiniStatistics
          bg={cardBg}
          growth="+23%"
          name="Sales"
          value="$574.34"
        />

        <MiniStatistics
          bg={cardBg}
          endContent={
            <Flex me="-16px" mt="10px">
              <FormLabel htmlFor="balance" mb="0">
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id="balance"
                variant="mini"
                mt="5px"
                me="0px"
                defaultValue="usd"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gba">GBA</option>
              </Select>
            </Flex>
          }
          name="Your balance"
          value="$1,000"
        />

        <MiniStatistics
          bg={cardBg}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={gradientBg}
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="New Tasks"
          value="154"
        />

        <MiniStatistics
          bg={cardBg}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={iconBoxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Total Projects"
          value="2935"
        />
      </SimpleGrid>

      {/* TOTAL SPENT + WEEKLY REVENUE */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        {/* These components usually already use useColorModeValue internally
            in Horizon UI, but you can also pass props if you’ve customized them */}
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>

      {/* TABLE + DAILY TRAFFIC & PIE */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>

      {/* COMPLEX TABLE + TASKS + CALENDAR */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <Tasks />
          <MiniCalendar h="100%" minW="100%" selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
