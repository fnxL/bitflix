import "reflect-metadata";
import express from "express";
import { LoginValidation, SignUpValidation } from "./authValidations";
import { login, signUp, generateKey, getKeys, logout, createAdmin, token } from "./authController";

const router = express.Router();

/** Create a new account */
router.post("/signup", SignUpValidation, signUp);

/** Login a user */
router.post("/login", LoginValidation, login);

/** Get accessToken */
router.post("/token", token);

router.delete("/logout", logout);

/* Generate an Invite key */
router.get("/keys/generate", generateKey);

/* Get All Keys */
router.get("/keys", getKeys);

/* Create admin user */
router.get("/create-admin", createAdmin);

export default router;
