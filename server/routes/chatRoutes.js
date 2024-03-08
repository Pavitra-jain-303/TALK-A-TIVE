import { Router } from 'express';
const router = Router();

import { protect } from '../middleware/authMiddleware.js';
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from '../controller/chatController.js';

// (api/chats/) for accessing the chat or creating the chat.

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/remove').put(protect, removeFromGroup);
router.route('/add').put(protect, addToGroup);

export default router;