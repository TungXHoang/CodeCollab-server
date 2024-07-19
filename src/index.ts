import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/users";

import express from "express";
import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import IORedis from "ioredis";
import RedisStore from "connect-redis";
import session from "express-session";
import passport from "passport";

import userRoutes from "./routes/users";
import compilerRoutes from "./routes/compiler"
import projectRoutes from "./routes/project"
import docRoutes from "./routes/doc";
import guestRoutes from "./routes/guest"

dotenv.config();

const app = express();
const port =  8080;
const DbUrl = process.env.DB_URL!


// Connect to database
mongoose.connect(DbUrl);
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("DB connected");
})

// Middleware for request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to redis
const redisClient = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

// Config redis client
redisClient.on('error', function (err) {
	console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function () {
	console.log('Connected to redis successfully');
});

// Session Management 
const sessionConfig: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    // name: process.env.SESS_COOKIE,
    secret: process.env.SECRET as string ,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));


// Initialize and config passport
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy 

passport.use(new LocalStrategy({
	usernameField: 'email'
}, User.authenticate()));

// use static serialize and deserialize of model for passport session support

passport.serializeUser(User.serializeUser());
passport.deserializeUser( User.deserializeUser());


// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.locals.currentUser = req.user; //
//   next();
// });34

app.use("/api/users", userRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/projects", projectRoutes); 
app.use("/api/docs", docRoutes); 
app.use("/api/guests", guestRoutes)

app.listen(port, () => {
  console.log(`Example app listening port ${port}`)
})