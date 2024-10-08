import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersByName,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getUsersByName);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
