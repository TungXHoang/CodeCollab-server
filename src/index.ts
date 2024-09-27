import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/users";

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
const Redis = require("ioredis");
import IORedis from "ioredis";
import RedisStore from "connect-redis";
import session from "express-session";
import passport from "passport";

import userRoutes from "./routes/users";
import compilerRoutes from "./routes/compiler"
import projectRoutes from "./routes/project"
import docRoutes from "./routes/doc";
import guestRoutes from "./routes/guest"

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { MongodbPersistence } from 'y-mongodb-provider';
import * as Y from 'yjs';
const yUtils = require("y-websocket/bin/utils");
// import cors from "cors";

dotenv.config();

const backendPort = process.env.BACKEND_PORT || 3000;
const DbUrl = process.env.DB_URL!

// Connect to database
mongoose.connect(DbUrl);
export const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("DB connected");
})


const app = express();
// const allowedOrigins = ['http://localhost:5173'];
// app.use(cors(
//   {
//     origin: allowedOrigins,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: "Content-Type",
//     credentials: true
//   }
// ));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to redis
const redis = new IORedis("redis://127.0.0.1:6379");
redis.on('error', function (err:any) {
	console.log('Could not establish a connection with redis. ' + err);
})

redis.on('connect', function () {
	console.log('Connected to redis successfully');
});


// Session Management 
const sessionConfig: session.SessionOptions = {
	store: new RedisStore({ client: redis }),
	secret: process.env.SESSION_SECRET as string ,
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
passport.use(new LocalStrategy({
	usernameField: 'email'
}, User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// config YJS and web server 
const socketServer = createServer(app);

export const wss = new WebSocketServer({server:socketServer})

wss.on('connection', (ws, req) => {
  yUtils.setupWSConnection(ws, req);
})

//config MongoDB Persistence for YJS
export const mdb = new MongodbPersistence(DbUrl, {
	collectionName: 'transactions',
	flushSize: 100,
	multipleCollections: true,
	
});


yUtils.setPersistence({
	bindState: async (docName: any, ydoc: any) => {
		const persistedYdoc = await mdb.getYDoc(docName);
		// get the state vector so we can just store the diffs between client and server
		const persistedStateVector = Y.encodeStateVector(persistedYdoc);
		const diff = Y.encodeStateAsUpdate(ydoc, persistedStateVector);
		// store the new data in db (if there is any: empty update is an array of 0s)
		if (diff.reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0)
			mdb.storeUpdate(docName, diff);

		// send the persisted data to clients
		Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

		// store updates of the document in db
		ydoc.on('update', async (update:any) => {
			mdb.storeUpdate(docName, update);
		});

		// cleanup memory
		persistedYdoc.destroy();
	},
	writeState: async (docName:any, ydoc:any) => {
	},
});

// yUtils.getPersistence({
// 	bindState: async (docName: any, yDoc: any) => {
// 		const persistedYdoc = await mdb.getYDoc(docName);
// 		console.log("docName from getPerstistence", persistedYdoc);
// 	}
// })

// API endpoint
app.use("/api/users", userRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/projects", projectRoutes); 
app.use("/api/docs", docRoutes); 
app.use("/api/guests", guestRoutes)


socketServer.listen(backendPort, () => {
	console.log(`Backend running at: \x1b[36mhttp://localhost:\x1b[1m${backendPort}/\x1b[0m`);
});

