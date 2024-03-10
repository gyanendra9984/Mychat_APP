import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  IconButton,
  Badge,
} from "@chakra-ui/react";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/spinner";

import React, { useState } from "react";
import { ChatState } from "../../context/Chatprovider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Profilemodel from "./Profilemodel";
import { useToast } from "@chakra-ui/react";

import axios from "axios";
import Chatloading from "../Chatloading";
import Userlistitem from "../Useravatar/Userlistitem";
import { getsender } from "../../config/Chatlogics";
//  import NotificationBadge from "react-notification-badge";
//  import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingchat, setloadingchat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setselectedchat,
    chats,
    setchats,
    notification,
    setnotification,
  } = ChatState();
  const history = useHistory();
  const toast = useToast();
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  //   setUser(userInfo);
  //   if (!userInfo) {
  //     history.push("/");
  //   }
  // }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setloading(false);
      setsearchresult(data);
    } catch (error) {
      toast({
        title: "error occured!",
        description: "failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userid) => {
    try {
      setloadingchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat`,
        { userId: userid },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);
      setselectedchat(data);
      setloadingchat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const badgeStyle = {
    backgroundColor: "#ED4337",
    display: "flex",
    color: "white",
    width: "20px", // Adjust the width and height as needed
    height: "20px",
    borderRadius: "50%",
    fontSize: "12px",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center", // Optional: to horizontally center the content
    top: "-4px",
    right: "-4px",
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user in chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }}>Searsh User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          MY_CHAT_APP
        </Text>
        <div>
          <Menu>
            {notification.length > 0 ? (
              <MenuButton
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginRight: "20px",
                }}
              >
                <span style={badgeStyle}>{notification.length}</span>
                <BellIcon fontSize={"2xl"} m={1} />
              </MenuButton>
            ) : (
              <MenuButton>
                <BellIcon fontSize={"2xl"} m={1} />
              </MenuButton>
            )}

            <MenuList pl={2}>
              {!notification.length && "No notification"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setselectedchat(notif.chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isgroupchat
                    ? `new message in ${notif.chat.chatName}`
                    : `new message from ${getsender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profilemodel user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profilemodel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchresult?.map((user) => (
                <Userlistitem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingchat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
