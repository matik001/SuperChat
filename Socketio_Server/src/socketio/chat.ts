import { Server } from "socket.io";
import ENV from '../configs/envConfig';
import { Exchanges, publish, Queues, registerConsumer } from "../services/rabbitmq";
let io:Server;

interface Message{
    ServerName: string;
    Username: string;
    Data: string;
    Time: Date;
}

export const configChat = (socketio:Server)=>{
    io = socketio;

    registerConsumer(Queues.Messages, (msgData=>{
        const msg = JSON.parse(msgData!.content.toString()) as Message;
        if(msg.ServerName !== ENV.SERVER_NAME){
            io.emit('messageReceived', {
                name: msg.Username,
                message: msg.Data,
                eventTime: msg.Time,
                serverName: msg.ServerName
            });
        }
    }))

    io.on('connection', client=>{
        let clientName:string;
        client.on('Introduce', data=>{
            clientName = data.name;
            io.emit('userJoined', {
                name: clientName,
                eventTime: new Date(),
                serverName: ENV.SERVER_NAME
            });
        })
        client.on('Send', data=>{
            const message = data.message;
            io.emit('messageReceived', {
                name: clientName,
                message: message,
                eventTime: new Date(),
                serverName: ENV.SERVER_NAME
            });

            const dataForQueue = {
                Username: clientName,
                Data: message,
                ServerName: ENV.SERVER_NAME,
                Time: new Date(),
            } as Message;
            publish("", JSON.stringify(dataForQueue), Exchanges.Messages);
        })
        client.on('disconnect', () => { 
        });

    })
} 

