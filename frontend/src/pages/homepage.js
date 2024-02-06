import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
} from "@chakra-ui/react";
import Login from "../component/Authentication/Login";
import SignUp from "../component/Authentication/SignUp";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="lg" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={1}
        bg="white"
        w="100%"
        m="20px 0 10px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
        fontWeight="bold"
      >
        <Text
          fontSize="3xl"
          fontFamily="Work sans"
          color="black"
          textStyle="bold"
        >
          Mychat_APP
        </Text>
      </Box>
      <Box
        p={2}
        bg="white"
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="0em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
