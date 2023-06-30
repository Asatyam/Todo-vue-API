import { Request, Response, NextFunction, response } from "express"
import { body, validationResult } from "express-validator";
import { PrismaClient, Project } from '@prisma/client';
import { ProjectType, TodoType, UserType } from "../helpers/Types.js";
const prisma = new PrismaClient();


const getTodo = async (req: Request, res: Response) => {
    try {
        const todoid = Number(req.params.todoid);
        const result = await prisma.todo.findMany({ where: { id: todoid } });
        return res.status(200).json({ result });
    } catch (err) {
        return res.status(404).json({ message: 'Something went wrong', err });
    }
}

const createTodos = [

    body('title', 'Title cannot be empty')
        .trim()
        .notEmpty(),

    body('priority', 'Priority cannot be empty')
        .trim()
        .notEmpty(),

    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors });
        }
        try {
            const projectid = Number(req.params.projectid);
            const result = await prisma.todo.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    completed: req.body.completed,
                    dueDate: req.body.dueDate,
                    priority: req.body.priority,
                    projectId: projectid,
                }
            });

            return res.status(200).json({ message: 'Todo added successfully', result });

        } catch (err) {
            return res.status(200).json({ err });
        }
    }]

const updateTodos = [

    body('title', 'Title cannot be empty')
        .trim()
        .notEmpty(),

    body('priority', 'Priority cannot be empty')
        .trim()
        .notEmpty(),

    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors });
        }
        try {
            const projectid = Number(req.params.projectid);

            const result = await prisma.todo.update({
                where: {
                    id: Number(req.params.todoid),
                },

                data: {
                    title: req.body.title,
                    description: req.body.description,
                    completed: req.body.completed,
                    dueDate: req.body.dueDate,
                    priority: req.body.priority,
                }
            });

            return res.status(200).json({ message: 'Todo Updated successfully', result });

        } catch (err) {
            return res.status(200).json({ err });
        }
    }
]

const deleteTodo = async (req: Request, res: Response) => {
    try {
        const todoid = Number(req.params.todoid);
        const result = await prisma.todo.delete({ where: { id: todoid } });

        return res.status(200).json({ message: 'Deleted todo successfully', result });
    } catch (err) {
        return res.status(400).json({ message: 'Something went wrong', err });
    }

}

export default {
    getTodo,
    createTodos,
    updateTodos,
    deleteTodo,

}