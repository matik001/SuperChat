import {Channel, connect, Connection, ConsumeMessage, Message, Replies} from 'amqplib';
import ENV from '../configs/envConfig';

export enum Queues {
    Messages = "messages",
}
export enum Exchanges {
    Default = "",
    Messages = "messages",
}
let connection:Connection;
let channel:Channel;
let messagesQueue:Replies.AssertQueue;
export const configureRabbitmq = async ()=>{
    while(true){
        try{
            connection = await connect({
                protocol: 'amqp',
                hostname: `${ENV.RABBITMQ_HOST}`,
                port: 5672,
                username: ENV.RABBITMQ_USER,
                password: ENV.RABBITMQ_PASS
            });
            break;
        }
        catch(err){
            console.error(err);
            console.error("Retrying to connect to rabbitmq");
            await new Promise((resolve)=>setTimeout(resolve, 1000));
        }
    }

    
    channel = await connection.createChannel();
    channel.assertExchange(Exchanges.Messages, 'fanout', {
        durable: false
    })
    messagesQueue = await channel.assertQueue('',{
        exclusive: true
    })
    channel.bindQueue(messagesQueue.queue, Exchanges.Messages, '');
}

const toQueueName = (queue:Queues)=>{
    switch (queue) {
        case Queues.Messages:
            return messagesQueue.queue
        default:
            return queue;
    }
}

export const ack = (message:Message)=>{
    channel.ack(message);
} 

export const publish = (route:string, message:string, exchange:Exchanges = Exchanges.Default)=>{
    const bufffer = Buffer.from(message, 'utf-8');
    channel.publish(exchange, route, bufffer);
} 

export const registerConsumer = async (queue:Queues, onMessage: (msg: ConsumeMessage | null) => void)=>{
    const queueName = toQueueName(queue);
    await channel.consume(queueName, onMessage, {
        noAck: true
    });
} 