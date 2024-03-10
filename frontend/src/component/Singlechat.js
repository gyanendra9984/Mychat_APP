import React, { useEffect, useState } from "react";
import { ChatState } from "../context/Chatprovider";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getsender, getsenderfull } from "../config/Chatlogics";
import Profilemodel from "./miscellaneous/Profilemodel";
import Updategroupchatmodel from "./miscellaneous/Updategroupchatmodel";
import axios from "axios";
import Scrollablechat from "./Scrollablechat";
import io from 'socket.io-client'
import Lottie from 'lottie-react'
import animationData from "../animation/typing.json"

const endpoint = "http://localhost:5000";
var socket, selectedchatcompare;
const Singlechat = ({ fetchagain, setfetchagain }) => {
  const { user, selectedchat, setselectedchat, notification, setnotification } =
    ChatState();
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [socketconnected, setsocketconnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);
  const toast = useToast();
  
  const fetchmessages = async () => {
    if (!selectedchat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `/api/message/${selectedchat._id}`,
        config
      );
      setmessages(data);
      setloading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      toast({
        title: "error occured!",
        description: "failed to load message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketconnected(true));
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));

  }, []);

  useEffect(() => {
    fetchmessages();
    selectedchatcompare = selectedchat;
  }, [selectedchat]);

  useEffect(() => {
    socket.on("message recieved", (newmessagerecieved) => {
      if (!selectedchatcompare || (selectedchatcompare._id !== newmessagerecieved.chat._id)) {
        if (!notification.includes(newmessagerecieved)) {
          setnotification([newmessagerecieved, ...notification])
          setfetchagain(!fetchagain);
        }
       
      } else {
        setmessages([...messages, newmessagerecieved]);
      }
    })
  });

  const sendmessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      socket.emit("stop typing", selectedchat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessage,
            chatId: selectedchat._id,
          },
          config
        );
        socket.emit("new message", data);
        setmessages([...messages, data]);
      } catch (error) {
        toast({
          title: "error occured!",
          description: "failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  
  
  const typinghandler = (e) => {
    setnewmessage(e.target.value);
     if (!socketconnected) return;
     if (!typing) {
       settyping(true);
       socket.emit("typing", selectedchat._id);
     }
     var lasttypingtime = new Date().getTime();
     var timerlength = 3000;
     setTimeout(() => {
       var timenow = new Date().getTime();
       var timediff = timenow - lasttypingtime;
       if (timediff >= timerlength && typing) {
         socket.emit("stop typing", selectedchat._id);
         settyping(false);
       }
     }, timerlength);
  };
  return (
    <>
      {selectedchat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "28px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedchat("")}
            />
            {!selectedchat.isGroupchat ? (
              <>
                {getsender(user, selectedchat.users)}
                <Profilemodel user={getsenderfull(user, selectedchat.users)}>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    fontWeight={"bold"}
                    textColor={"white"}
                    name={getsenderfull(user, selectedchat.users).name}
                    src={getsenderfull(user, selectedchat.users).pic}
                    bg="green"
                  />
                </Profilemodel>
              </>
            ) : (
              <>
                {selectedchat.chatName.toUpperCase()}
                <Updategroupchatmodel
                  fetchagain={fetchagain}
                  setfetchagain={setfetchagain}
                  fetchmessages={fetchmessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            h={"100%"}
            w={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                h={"10"}
                w={"10"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                scrollbarWidth="none"
              >
                <Scrollablechat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendmessage} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    animationData={animationData}
                    loop= {true}
                    autoplay= {true}
                    
                    style={{ marginBottom: 15, marginLeft: 0 ,width:70}}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter your message"
                onChange={typinghandler}
                value={newmessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"work sans"}>
            select a user for chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default Singlechat;
