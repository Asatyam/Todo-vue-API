import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { setUpPassport } from './helpers/passport.js';
const app = express();
import { config } from 'dotenv';
import apiRouter from './routes/api.js';
config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
setUpPassport(passport);
app.use(passport.initialize());
passport.use(passport.session());
app.use('/api', cors(), apiRouter);
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
