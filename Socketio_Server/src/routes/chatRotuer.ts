import { Router } from "express";
import { getChat } from "../controllers/chatController";

const chatRouter = Router();
chatRouter.get('/', getChat);

export default chatRouter;