import express from 'express';
import "dotenv/config";
import cors from 'cors'; // Import cors for handling cross-origin requests
import http from 'http'; // Import http module for creating a server
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRoute from './routes/messageRoutes.js';
import { Server } from 'socket.io';

//Create Express app and HTTP server
const app = express();
const server = http.createServer(app); // we r using http.createServer because socket.io requires an HTTP server

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: '*'}
})

// Store online users
export const userSocketMap = {}; //data of all the online user will store in form of { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

// Middleware setup
app.use(express.json({limit: '4mb'})) //limit the size of JSON payloads
app.use(cors())

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live")); // Simple endpoint to check server status
app.use("/api/auth", userRouter); // User authentication routes
app.use("/api/messages", messageRoute) 

//connect to the MongoDB database
await connectDB(); 
if(process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000
    server.listen(PORT, () => console.log("Server is running on port " + PORT));
}

export default server; // Export server for versel
