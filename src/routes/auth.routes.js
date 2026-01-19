import express from "express";
import { login } from "../modules/users/users.controller.js";

export const router = express.Router();

router.post("/login", login);

