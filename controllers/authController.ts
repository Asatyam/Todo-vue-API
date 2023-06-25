import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';
import { body, validationResult } from "express-validator";
import passport from "passport";
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { UserType } from "../helpers/Types.js";
const prisma = new PrismaClient();
import { config } from "dotenv";
config();

const index = (req: Request, res: Response) => {
    res.send('The api is live')
}

const signup = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Enter a valid username ')
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { username: value } });
            if (user) {
                console.log(user);
                return Promise.reject(new Error('Username already taken'));
            }
            return true;
        })

    ,

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password must not be empty'),


    body('confirm')
        .trim()
        .custom(async (value: string, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        bcryptjs.hash(req.body.password, 10, async (err: Error, hashedPassword) => {
            if (err) {
                return res.send(err);
            }
            try {


                const result = await prisma.user.create({
                    data: {
                        username: req.body.username,
                        password: hashedPassword,
                        projects: {
                            create: [
                                { name: 'Today' },
                                { name: 'Everyday' }
                            ],
                        }

                    },
                    include: {
                        projects: true,
                    }
                });
                const user = {
                    id: result.id,
                    username: req.body.username,
                    password: hashedPassword,
                }

                req.login(user, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const body = {
                            id: result.id,
                            username: result.username,
                        };
                        const token = jwt.sign(body, process.env.SECRET as string);
                        return res.status(200).json({ message: 'User created', user, token });
                    }
                });
            } catch (err) {
                return next(err);
            }
        });
    },
];

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate('local-login',
            { session: false },
            (err: Error, user: UserType, info: any) => {
                if (err || !user) {
                    return res.status(403).json({ info, err });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        next(err);
                    }
                    const body = {
                        id: user.id,
                        username: user.username,
                    };
                    const token = jwt.sign({ user: body }, process.env.SECRET as any);
                    return res.status(200).json({ body, token });
                });
            }
        )(req, res, next);
    } catch (err) {
        return res.status(403).json({ err });
    }
}


const getUsers = async (req: Request, res: Response) => {

    const result = await prisma.user.findMany({});
    return res.status(200).send({ result });
}

export default {
    index,
    signup,
    getUsers,
    login
}