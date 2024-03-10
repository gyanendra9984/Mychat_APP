import {
    Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/Chatprovider";
import axios from "axios";
import  Userlistitem  from "../Useravatar/Userlistitem";
import  Userbledgeitem  from "../Useravatar/Userbadgeitem";

const Groupchatmodel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Groupchatname, setGroupchatname] = useState();
  const [selectedusers, setselectedusers] = useState([]);
  const [search, setsearch] = useState();
  const [searchresult, setsearchresult] = useState();
  const [loading, setloading] = useState(false);

  const toast = useToast();
    const { user, chats, setchats } = ChatState();
    

    const handlesearch = async (query) => {
        setsearch(query);
        if (!query) {
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
    }
    const handlesubmit = async () => {
      if (!Groupchatname || !selectedusers) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/chat/group",
          {
            name: Groupchatname,
            users: JSON.stringify(selectedusers.map((u) => u._id)),
          },
          config
        );
        setchats([data, ...chats]);
        onClose();
        toast({
          title: "New group chat created",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to create group chat",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    const handlegroup = (usertoadd) => {
        if (selectedusers.includes(usertoadd)) {
            toast({
                title: "User already added",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setselectedusers([...selectedusers, usertoadd]);
    }
  const handledelete = (user) => {
    console.log(user);
    setselectedusers(selectedusers.filter((sel) => sel._id !== user._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupchatname(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: user1, user2, user2"
                mb={1}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedusers.map((u) => (
                <Userbledgeitem
                  key={user._id}
                  user={u}
                  handlefunction={() => handledelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchresult
                ?.slice(0, 4)
                .map((user) => (
                  <Userlistitem
                    key={user?._id}
                    user={user}
                    handleFunction={() => handlegroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handlesubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Groupchatmodel;
