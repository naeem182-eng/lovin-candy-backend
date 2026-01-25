import { Router } from "express";
import {
  createUser,
  getUsers,
  login,
  me,
  register,
  updateAddress,
  updateProfile,
  deleteUser,
  createAddress,
  delAddress,
} from "../modules/users/users.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

export const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/me", auth, me);

router.post("/address", auth, createAddress);
router.put("/update-address", auth, updateAddress);
router.delete("/address", auth, delAddress);

router.put("/update-profile", auth, updateProfile);

router.get("/", auth, isAdmin, getUsers);
router.post("/", auth, isAdmin, createUser);
router.delete("/:id", auth, isAdmin, deleteUser);
