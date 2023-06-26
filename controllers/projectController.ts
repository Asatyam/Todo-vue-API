import { Request, Response, NextFunction } from "express"
import { body, validationResult } from "express-validator";
import { PrismaClient, Project } from '@prisma/client';
import { ProjectType, UserType } from "../helpers/Types.js";
const prisma = new PrismaClient();


const getProjectTodos = async (req: Request, res: Response) => {
    try {
        const projectid = Number(req.params.projectid)
        const todos = await prisma.todo.findMany({ where: { projectId: projectid } });
        return res.status(200).send({ todos });

    } catch (err) {
        return res.status(404).send({ err: 'Something went wrong' });
    }
}

const createProject = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name cannot be empty'),

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const alreadyExist = await prisma.project.findFirst({ where: { name: req.body.name } });
            console.log(alreadyExist);
            if (!alreadyExist) {
                console.log('hey');
                const currUser = req.user as UserType;
                console.log(currUser, 'hey');
                const newProject = await prisma.project.create({
                    data: {
                        name: req.body.name,
                        userId: currUser.id,
                    }
                });
                console.log(currUser, typeof newProject,'hello');
                return res.status(200).json({ message: 'Project created successfully', newProject });
            }

        } catch (err) {
            return res.status(400).send({err});
        }
    }
]





export default {
    getProjectTodos,
    createProject

}