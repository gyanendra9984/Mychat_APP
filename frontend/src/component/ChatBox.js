import React from "react";
import { ChatState } from "../context/Chatprovider";
import { Box } from "@chakra-ui/react";
import Singlechat from "./Singlechat";

const ChatBox = ({fetchagain,setfetchagain}) => {
  const { selectedchat } = ChatState();
  return (
    <Box
      display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Singlechat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  );
};

export default ChatBox;
