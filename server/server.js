import express from 'express';
import { Server } from "socket.io";
// import cors from 'cors';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import { config as configDotenv } from 'dotenv';
configDotenv();

console.log('XYZ');

import connectDB from './config/db.js';
connectDB();

console.log('XYZ2');

const app = express();
app.use(express.json()); // to accept json data

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);


const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/client/build")));

app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
);
// if (process.env.NODE_ENV === "production") {
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from any origin, replace "*" with your frontend domain in production
        methods: "*" // Allow all HTTP methods
    },
    pingTimeout: 60000
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
