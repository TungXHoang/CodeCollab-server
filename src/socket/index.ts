// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost:3000"],
// 		methods: ["GET", "POST"],
// 	},
// });

// // export const getReceiverSocketId = (receiverId) => {
// // 	return userSocketMap[receiverId];
// // };

// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
// 	console.log("a user connected", socket.id);

// 	socket.on("newEdit", (senderId, edit) => {
// 	})
// 	// const userId = socket.handshake.query.userId;
// 	// if (userId != "undefined") userSocketMap[userId] = socket.id;

// 	// // io.emit() is used to send events to all the connected clients
// 	// io.emit("getOnlineUsers", Object.keys(userSocketMap));

// 	// // socket.on() is used to listen to the events. can be used both on client and server side
// 	// socket.on("disconnect", () => {
// 	// 	console.log("user disconnected", socket.id);
// 	// 	delete userSocketMap[userId];
// 	// 	io.emit("getOnlineUsers", Object.keys(userSocketMap));
// 	// });
// });

// export { app, io, server };

import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { logger } from "../logger";
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

/**
 * This service mainly takes care of events other than yjs document
 * i.e. 
 * 1. participant joining a room
 * 2. client changing the language in the code room
 */
export class SocketIOService {
	io: Server;
	constructor(httpServer: HttpServer) {
		this.io = new Server(httpServer, {
			cors: {
					origin: `http://localhost:3001`,
			},
			transports: ['websocket'],
		});
		this.io.on('connection', (socket) => {
			logger.info("Connected via socket IO");
			// setupWSConnection
			
				/**
				 * Participant add event
				 */
				// socket.on('participant:add', (data) => {
				// 		logger.info("Participant add " + data);
				// })

				// /**
				//  * Language change event
				//  */
				// socket.on('language:change', (data) => {
				// 		socket.broadcast.emit('language:change', data)
				// })
		});
	}

    // public emitParticipantJoin(room: IRoom) {
    //     this.io.emit('participant:add', room);
    // }

	// public getSocketServer(): Server {
	// 	return this.io;
	// }
}  