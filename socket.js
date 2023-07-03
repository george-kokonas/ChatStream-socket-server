require("dotenv").config();
const port = process.env.PORT || 8080;

const io = require("socket.io")(port, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS.split(","),
  },
});

//FUNCTIONS USED BY SOCKET LISTENERS TO UPDATE ONLINE USERS ARRAY

let onlineUsers = [];

//add user to onlineUsers array when connected
const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

//remove user from onlineUsers array when disconnected
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

//get a user from onlineUsers array
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

//LISTENERS AND EMMITTERS

// Handle client connections
io.on("connection", (socket) => {

  //get userId and socketId from client and add user to the users array
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  //exchange messages
  socket.on(
    "sendMessage",
    ({ _id, roomId, senderId, receiverId, text, isSeen, createdAt }) => {
      const receiver = getUser(receiverId);
      io.to(receiver?.socketId).emit("getMessage", {
        _id,
        roomId,
        senderId,
        receiverId,
        text,
        isSeen,
        createdAt,
      });
    }
  );

  //inform the user that someone is typing
  socket.on("userTyping", ({ senderUsername, receiverId, currentRoomId }) => {
    const receiver = getUser(receiverId);
    io.to(receiver?.socketId).emit("isTyping", {
      currentRoomId,
      senderUsername,
    });
  });

  //remove user from users array when logged out
  socket.on("logout", () => {
    removeUser(socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  //remove user from users array when disconnected
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
