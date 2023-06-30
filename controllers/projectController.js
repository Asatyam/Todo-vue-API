import { body, validationResult } from "express-validator";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const projects = async (req, res) => {
    try {
        const temp = req.user;
        const currUser = temp.user;
        const projects = await prisma.project.findMany({ where: { userId: currUser.id } });
        return res.status(200).json({ projects });
    }
    catch (err) {
        return res.status(404).json({ err });
    }
};
const getProjectTodos = async (req, res) => {
    try {
        const projectid = Number(req.params.projectid);
        const todos = await prisma.todo.findMany({ where: { projectId: projectid } });
        return res.status(200).send({ todos });
    }
    catch (err) {
        return res.status(404).send({ err });
    }
};
const createProject = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name cannot be empty'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const alreadyExist = await prisma.project.findFirst({ where: { name: req.body.name } });
            if (!alreadyExist) {
                const currUser = req.user;
                const newProject = await prisma.project.create({
                    data: {
                        name: req.body.name,
                        userId: currUser.user.id,
                    }
                });
                return res.status(200).json({ message: 'Project created successfully', newProject });
            }
        }
        catch (err) {
            return res.status(400).send({ err });
        }
    }
];
const deleteProject = async (req, res) => {
    try {
        const projectid = Number(req.params.projectid);
        const result = await prisma.project.delete({ where: { id: projectid } });
        return res.status(200).json({ message: 'Project deleted' });
    }
    catch (err) {
        return res.status(404).json({ message: 'Project could not be deleted', err });
    }
};
const updateProjectName = async (req, res) => {
    try {
        const id = Number(req.params.projectid);
        const result = await prisma.project.update({ where: { id: id }, data: { name: req.body.name } });
        return res.status(200).json({ message: 'Project name updated', result });
    }
    catch (err) {
        return res.status(404).json({ message: 'Something went wrong', err });
    }
};
export default {
    getProjectTodos,
    createProject,
    deleteProject,
    projects,
    updateProjectName
};
