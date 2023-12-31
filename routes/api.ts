import express from "express";
import passport from "passport";
import authController from "../controllers/authController.js";
import projectController from '../controllers/projectController.js'
import todoController from "../controllers/todoController.js";
const router = express.Router();

router.get('/', authController.index);

router.post('/signup', authController.signup);

router.get('/users', passport.authenticate('jwt', { session: false }), authController.getUsers)

router.post('/login', authController.login);

router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logout)

router.get('/isAuth', passport.authenticate('jwt', { session: false }), (req, res) => res.send(req.user));

// Project Routes
router.get('/projects', passport.authenticate('jwt', { session: false }), projectController.projects);

router.get('/projects/:projectid', passport.authenticate('jwt', { session: false }), projectController.getProjectTodos);

router.post('/projects', passport.authenticate('jwt', { session: false }), projectController.createProject);

router.delete('/projects/:projectid', passport.authenticate('jwt', { session: false }), projectController.deleteProject);

router.patch('/projects/:projectid', passport.authenticate('jwt', { session: false }), projectController.updateProjectName);

// Todo Routes

router.get('/projects/:projectid/todos/:todoid', passport.authenticate('jwt', { session: false }), todoController.getTodo);

router.post('/projects/:projectid/todos', passport.authenticate('jwt', { session: false }), todoController.createTodos);

router.put('/projects/:projectid/todos/:todoid', passport.authenticate('jwt', { session: false }), todoController.updateTodos);

router.delete('/projects/:projectid/todos/:todoid', passport.authenticate('jwt', { session: false }), todoController.deleteTodo);
export default router;