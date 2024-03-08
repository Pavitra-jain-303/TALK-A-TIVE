import { Router } from "express";
import { allMessages, sendMessage } from "../controller/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router;