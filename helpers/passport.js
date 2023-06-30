import { Strategy as LocalStrategy } from 'passport-local';
import bcryptjs from 'bcryptjs';
import { ExtractJwt as ExtractJWT, Strategy as JWTStrategy } from 'passport-jwt';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
config();
const prisma = new PrismaClient();
export function setUpPassport(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                }
            });
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    });
    passport.use('local-login', new LocalStrategy(async (username, password, done) => {
        try {
            const user = (await prisma.user.findUnique({ where: { username: username } }));
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            bcryptjs.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user);
                }
                return done(null, false, { message: 'Incorrect password' });
            });
        }
        catch (err) {
            return done(err, false);
        }
    }));
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
    }, (jwtPayload, done) => done(null, jwtPayload)));
}
