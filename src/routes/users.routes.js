import { Router } from "express";
import { createUser, delAddress, getUsers, login, updateAddress } from "../modules/users/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.get("/", getUsers);

router.post("/", createUser);

router.delete("/:id", auth, delAddress);

router.put("/address", auth, updateAddress);

router.post("/login", login);

router.get("/", auth, getUsers);