import { Router } from "express";
import { createAddress, createUser, delAddress, getUsers, login, me, register, updateAddress, updateProfile, deleteUser } from "../modules/users/users.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const router = Router();

router.post("/login", login);

router.post("/register", register);

router.get("/me", auth, me);

router.post("/address", auth, createAddress);

router.put("/update-address", auth, updateAddress);

router.get("/", getUsers);

router.post("/", createUser);


router.put("/update-profile", auth, updateProfile);


router.delete("/address", auth, delAddress);


router.get("/", auth, isAdmin, getUsers);

router.delete("/:id", auth, isAdmin, delAddress);

router.get("/", auth, isAdmin, getUsers);

router.delete("/:id", auth, isAdmin, deleteUser);