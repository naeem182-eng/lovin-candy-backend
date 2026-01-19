import express from "express";
import { login } from "../modules/users/users.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", createUser); 

export default router;