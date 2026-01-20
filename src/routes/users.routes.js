import { Router } from "express";
import { createUser, delAddress, getUsers, login, me, register, updateAddress } from "../modules/users/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

export const router = Router();

router.get("/", getUsers);

router.post("/", createUser);

router.get("/me", auth, me);

router.delete("/:id", delAddress);

router.put("/address", auth, updateAddress);

router.post("/login", login);

router.post("/register", register);
