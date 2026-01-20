import { Router } from "express";
import { createUser, delAddress, getUsers, login, me, register, updateAddress } from "../modules/users/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const router = Router();

router.get("/",auth, getUsers);

router.post("/", createUser);

router.get("/me", auth, me);

router.delete("/:id",auth, delAddress);

router.put("/address", auth, updateAddress);

router.post("/login", login);

router.post("/register", register);

router.get("/", auth, isAdmin, getUsers);

router.delete("/:id", auth, isAdmin, delAddress);