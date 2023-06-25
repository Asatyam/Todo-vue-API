import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
const router = express.Router();

router.get('/',authController.index);








export default router;