const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messsageRoutes");
const path = require("path");


const app = express();
dotenv.config();
connectDB();
app.use(express.json());
// Define a route to send the chats array
// app.get('/', (req, res) => {
//     res.send("API is running");
// });

app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ---------------------------deployment--------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.resolve(__dirname1, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "..","frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}



// ---------------------------deployment--------------------------------


app.use((req, res, next) => {
  const error = new Error(`Not Found-${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Generic error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});

const io = require("socket.io")(server, {
  PingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userdata) => {
    socket.join(userdata._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newmessagerecieved)=> {
    var chat = newmessagerecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newmessagerecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newmessagerecieved);
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userdata._id);
  });
})

