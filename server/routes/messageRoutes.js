import express from 'express';
import { protectRoute} from "../middleware/auth.js"
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRoute = express.Router();

messageRoute.get('/users', protectRoute, getUsersForSidebar)
messageRoute.get('/:id', protectRoute, getMessages)
messageRoute.put('/mark/:id', protectRoute, markMessageAsSeen) //using this route to update the data
messageRoute.post("/send/:id", protectRoute, sendMessage) 

export default messageRoute;