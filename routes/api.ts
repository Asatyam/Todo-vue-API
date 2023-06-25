import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
const router = express.Router();

router.get('/',authController.index);

router.post('/signup', authController.signup);

router.get('/users',passport.authenticate('jwt',{session:false}),authController.getUsers )

router.post('/login', authController.login);


export default router;