import { EditIcon } from "@chakra-ui/icons";
import {
    Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/Chatprovider";
import Userbadgeitem from "../Useravatar/Userbadgeitem"
import axios from "axios";
import Userlistitem from "../Useravatar/Userlistitem";

const Updategroupchatmodel = ({ fetchagain, setfetchagain,fetchmessages }) => {
  const { user, selectedchat, setselectedchat } = ChatState();
  const [Groupchatname, setGroupchatname] = useState();
  const [search, setsearch] = useState();
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setrenameloading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const handledelete= async(usertoremove) => {
         if (selectedchat.groupAdmin._id !== user._id && user._id !== usertoremove._id ) {
           toast({
             title: "only admin can can remove",
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "bottom",
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

          const { data } = await axios.put(
            "/api/chat/groupremove",
            {
              chatId: selectedchat._id,
              userId: usertoremove._id,
            },
            config
            );
            usertoremove._id === user._id ? setselectedchat() : setselectedchat(data);
            setfetchagain(!fetchagain);
            fetchmessages();
          setloading(false);
        } catch (error) {
          toast({
            title: "error occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
    }
    const handleadduser = async(usertoadd) => {
        if (selectedchat.users.find((u) => u._id === usertoadd._id)){
          toast({
            title: "User already added",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        if (selectedchat.groupAdmin._id !== user._id) {
          toast({
            title: "only admin can add",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
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

           const { data } = await axios.put(
             "/api/chat/groupadd",
             {
               chatId: selectedchat._id,
               userId: usertoadd._id,
             },
             config
            );  
            setselectedchat(data);
            setfetchagain(!fetchagain);
            setloading(false);
        } catch (error) {
             toast({
               title: "error occured!",
               description: error.response.data.message,
               status: "error",
               duration: 5000,
               isClosable: true,
               position: "bottom",
             });
        }
    };
    const handlerename = async() => {
        if (!Groupchatname) return;
        try {
            setrenameloading(true)
            const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/chat/rename",
          {
            chatId: selectedchat._id,
            chatName:Groupchatname,
          },
          config
            );
            setselectedchat(data);
            setfetchagain(!fetchagain);
            setrenameloading(false);
        } catch (error) {
            toast({
              title: "error occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
        }
     };
    const handlesearch = async (query) => {
        ;
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
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<EditIcon />}
        onClick={onOpen}
      />
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedchat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems="center"
            justifyContent={"center"}
          >
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedchat.users.map((u) => (
                <Userbadgeitem
                  key={user._id}
                  user={u}
                  handlefunction={() => handledelete(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={Groupchatname}
                onChange={(e) => setGroupchatname(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handlerename}
              >
                update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="add user to group"
                mb={1}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div>loading</div>
            ) : (
              searchresult
                ?.map((user) => (
                  <Userlistitem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleadduser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handledelete(user)} colorScheme="red">
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Updategroupchatmodel;
