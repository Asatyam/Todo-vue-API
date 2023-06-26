import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
import projectController from '../controllers/projectController.js'
const router = express.Router();

router.get('/', authController.index);

router.post('/signup', authController.signup);

router.get('/users', passport.authenticate('jwt', { session: false }), authController.getUsers)

router.post('/login', authController.login);

router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logout)

router.get('/isAuth', passport.authenticate('jwt', { session: false }), (req, res) => res.send(req.user));

// Project Routes

router.get('/projects/:projectid', passport.authenticate('jwt',{session:false}), projectController.getProjectTodos);

router.post('/project', passport.authenticate('jwt',{session:false}), projectController.createProject);

export default router;