import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
const router = express.Router();

router.get('/',authController.index);

router.post('/signup', authController.signup);

router.get('/users',authController.getUsers )




export default router;