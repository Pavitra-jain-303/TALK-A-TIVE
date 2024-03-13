import express from 'express';
import { Server } from "socket.io";
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

import { config as configDotenv } from 'dotenv';
configDotenv();

import connectDB from './config/db.js';
connectDB();

const app = express();
app.use(express.json()); // to accept json data

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

// ------------------------Deployement-------------------------------------

const corsOptions = {
    origin: process.env.client_Uri,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Include cookies and HTTP authentication headers '', 
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("API is running..");
});

// ------------------------Deployement-------------------------------------


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);

});

const io = new Server(server, {
    pingTimeout: 60000,
    // cors: {
    //     origin: process.env.client_Uri,
    //     // credentials: true,
    // },
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

})