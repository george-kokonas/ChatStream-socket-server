# ChatStream - Socket Server

This repository contains the socket server for ChatStream, a real time chat Application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO. The socket server is responsible for handling real-time communication between clients.

## Project Overview
This repository is part of a larger project that includes the following components as well:
- [Express Server](https://github.com/george-kokonas/ChatStream-express-server): The Express server component handles API requests and database operations for the ChatStream application, including authorization-authentication.
- [React Client](https://github.com/george-kokonas/ChatStream-react-client): The React client component provides the user interface for ChatStream, allowing users to interact with the application.

You can explore these repositories to learn more about the other components of the project.

Click [here](https://chatstream.netlify.app) to see ChatStream running!

## Features
- Real-time messaging: Clients can send and receive messages in real time.
- User status: Track online/offline status of users.
- Typing indicator: Display typing indicators when users are composing messages.
- Notifications: Notify users about unread messages while they are using the app.

## Prerequisites
To run the socket server locally, you need to have the following installed on your system:
- Node.js (version >= 14)
- npm (Node Package Manager)

If you don't have Node.js or npm installed, you can visit the [Node.js](https://nodejs.org/) website for further guidance on installation.

## Dependencies
The following dependencies are required for running the socket server:
- [dotenv](https://www.npmjs.com/package/dotenv): A module for loading environment variables from a .env file into process.env, simplifying configuration management. 
- [Socket.IO](https://socket.io/) (^4.6.1) : a JavaScript library that enables real-time, bidirectional communication between clients and servers. Socket.IO simplifies the process of building real-time applications, such as chat systems, gaming platforms, collaborative tools, and live dashboards. It offers features like event-based communication, room-based messaging, and automatic reconnection.

## Installation
### 1. Clone the repository:
```
git clone git@github.com:george-kokonas/ChatStream-socket-server.git

```

### 2. Navigate to the project directory:
```
cd ChatStream-socket-server
```

### 3. Install the dependencies:
- Using npm:
```
npm install
```
- Using Yarn:
```
yarn install
```

### 4. Create the `.env` file:
- In the root directory of the socket server, create a new file called .env 
- Open the .env file and add the following content:
```js
ALLOWED_ORIGINS=https://chatstream.netlify.app,http://localhost:3000
```
By default, React applications run on port 3000. If you have modified the port, replace the value `3000` of `http://localhost:3000` with the port number where your React application is running.   


### 5. Start the server:
- Using npm:
```
npm start
```
- Using yarn:
```
yarn start:
```
The server will be running at `http://localhost:8080` by default, or you can specify a different port if needed
in `socket.js` file.

## Event-Based Communication
The socket server uses event-based communication to handle real-time interactions between clients. Below are the key events and their purposes:

- `connection:` The connection event is triggered when a client successfully establishes a connection with the socket server. Inside the connection event handler, you can perform any necessary setup or initialization for the client connection.
- `disconnect:` Triggered by the client when a user disconnects from the server. The server removes the user from the online user list and notifies all clients about the updated list of online users.
- `addUser:` Triggered by the client to inform the server that a new user has connected. The server adds the user to the online users list and notifies all clients about the updated list of online users.
- `sendMessage:` Triggered by the client to the server to exchange messages. The server broadcasts the message to the appropriate recipient's socket, allowing real-time message exchange between users.
- `userTyping:` Triggered by the client to inform the server that the user is currently typing a message. The server relays this information to the recipient's socket, allowing the recipient to display a typing indicator.
- `logout:` Triggered by the client when a user logs out of the chat application. Similar to the disconnect event, the server removes the user from the online user list and notifies all clients about the updated list of online users.


## Usage Examples

```js
// Handle client connections
io.on("connection", (socket) => {
  console.log("a user connected");

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
});

```

## Feedback and Contributions

Any feedback, ideas, suggestions, or bug reports you may have regarding this project are welcome! If you would like to contribute to the development of this application, please contact me. Together, we can make ChatStream better!

For any inquiries or direct communication, you can reach out to me via email at [g.kokwnas@gmail.com](mailto:g.kokwnas@gmail.com).

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/).

You are free to use, modify, and distribute this project for personal or commercial purposes. Please see the [LICENSE](LICENSE) file for more details.

