import { Router } from "express";
import { createUser, delAddress, getUsers, login, updateAddress } from "../modules/users/users.controller.js";

export const router = Router();

router.get("/", getUsers);

router.post("/", createUser);

router.delete("/:id", delAddress);

router.put("/:id", updateAddress);

router.post("/login", login);