import { io } from 'socket.io-client/socket.io.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);
app.locals.io = socketServer;
const socket = io ();
app.locals.io = socketServer;

socket.emit('message', "me estoy comunicando desde un websocket")
