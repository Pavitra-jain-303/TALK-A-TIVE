import express from 'express';
import path from 'path'

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

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}


// ------------------------Deployement-------------------------------------


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);

});