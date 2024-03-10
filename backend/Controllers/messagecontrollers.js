const asyncHandler = require("express-async-handler");
const Message = require("../models/messagemodel");
const User = require("../models/usermodel");
const Chat = require("../models/chatmodel");

const sendmessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }
  var newmessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newmessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allmessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic")
          .populate("chat");
      res.json(message);
  } catch (error) {
      res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendmessage, allmessage };
