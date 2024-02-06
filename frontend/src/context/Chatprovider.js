import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const Chatprovider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};
export default Chatprovider;

export const ChatState = () => {
  return useContext(ChatContext);
};