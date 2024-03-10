import { createContext, useContext, useState} from "react";
// import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const Chatprovider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedchat, setselectedchat] = useState();
  const [chats, setchats] = useState([]);

  return (
    <ChatContext.Provider
      value={{ user, setuser, selectedchat, setselectedchat, chats, setchats }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default Chatprovider;

export const ChatState = () => {
  return useContext(ChatContext);
};