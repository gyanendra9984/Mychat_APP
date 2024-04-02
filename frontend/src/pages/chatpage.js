import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/Chatprovider";
import SideDrawer from "../component/miscellaneous/SideDrawer";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Chatpage = () => {
  const { user, setuser } = ChatState();
  const [fetchagain, setfetchagain] = useState(false);
  const history = useHistory();
  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    setuser(userInfo);
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        width="100%"
        h="91.5vh"
        p="6px"
      >
        {user && (
          <MyChats fetchagain={fetchagain} />
        )}
        {user && (
          <ChatBox fetchagain={fetchagain} setfetchagain={setfetchagain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
