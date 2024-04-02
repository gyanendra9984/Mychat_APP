import React from "react";
import {
  islastmessage,
  issamesender,
  issamesendermargin,
  issameuser,
} from "../config/Chatlogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../context/Chatprovider";
import { useEffect, useRef } from "react";

const Scrollablechat = ({ messages }) => {
  const { user } = ChatState();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{ marginTop:"32px",height: "calc(100% - 24px)", overflowY: "scroll" }}
      ref={scrollContainerRef}
    >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(issamesender(messages, m, i, user._id) ||
              islastmessage(messages, m, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: issamesendermargin(messages, m, i, user._id),
                marginTop: issameuser(messages, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Scrollablechat;
