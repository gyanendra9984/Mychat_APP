import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setshow] = useState(false);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const handleClick = () => setshow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/user/login",
        {email, password},
        config
      );
      toast({
        title: "login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch(error){
       toast({
         title: "error occured!",
         description: error.response.data.message,
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl>
        <FormLabel id="email" isrequired="true">
          Email
        </FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel id="password" isrequired="true">
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
      </FormControl>
      <FormControl>
        <Button
          varient="solid"
          colorScheme="red"
          width="100%"
          onClick={() => {
            setemail("guest@example.com");
            setpassword("1234567");
          }}
        >
          Get Guest User Credentials
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Login;
