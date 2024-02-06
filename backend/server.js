const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
// Define a route to send the chats array
app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);

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

const port = process.env.PORT||5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});