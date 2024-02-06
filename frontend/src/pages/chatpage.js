import { Box, Button } from "@chakra-ui/react";
import { ChatState } from "../context/Chatprovider";
import SideDrawer from "../component/miscellaneous/SideDrawer";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Chatpage = () => {
  const { user, setUser } = ChatState();
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    setUser(userInfo);
    if (!userInfo) {
      history.push("/");
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        width="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
