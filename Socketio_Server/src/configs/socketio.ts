import express from 'express';
import { create } from 'express-handlebars';
import { Server } from "socket.io";
import { configChat } from '../socketio/chat';
import { Server as HttpServer } from 'http';

const configureSocketio = (server:HttpServer)=>{
    const io = new Server(server);
    configChat(io);
}

export default configureSocketio;