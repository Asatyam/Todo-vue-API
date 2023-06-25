import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
const router = express.Router();

router.get('/', authController.index);

router.post('/signup', authController.signup);

router.get('/users', passport.authenticate('jwt', { session: false }), authController.getUsers)

router.post('/login', authController.login);

router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logout)

router.get('/isAuth', passport.authenticate('jwt', { session: false }), (req, res) => res.send(req.user));

export default router;