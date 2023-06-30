import { Strategy as LocalStrategy } from 'passport-local'
import bcryptjs from 'bcryptjs';
import { ExtractJwt as ExtractJWT, Strategy as JWTStrategy } from 'passport-jwt'
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
config();
import { UserType } from './Types.js';

const prisma = new PrismaClient()


export function setUpPassport(passport:any) {

    passport.serializeUser((user: any, done: any) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: UserType['id'], done: Function) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                }
            });
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    passport.use('local-login',
        new LocalStrategy(
            async (username: string, password: string, done,) => {
                try {
                    const user: UserType | null = (await prisma.user.findUnique({ where: { username: username } })) as any;
                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }
                    bcryptjs.compare(password, user.password, (err, res) => {
                        if (res) {
                            return done(null, user);
                        }
                        return done(null, false, { message: 'Incorrect password' });
                    });
                } catch (err) {
                    return done(err, false);
                }
            })
    );

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
    },
        (jwtPayload, done) => done(null, jwtPayload)

    ));

}