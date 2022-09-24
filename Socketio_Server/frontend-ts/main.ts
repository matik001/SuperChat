import {io, Socket} from 'socket.io-client';

const formatDateTime = (dateStr: string)=>{
    const date = new Date(dateStr);
    const options = {
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
      } as Intl.DateTimeFormatOptions;
    let dateFormatted = new Intl.DateTimeFormat('pl', options).format(date);
    dateFormatted = `<b style="color: #4D5656;">${dateFormatted}</b>`;
    return dateFormatted;
}

const formatServerName = (serverName: string)=>{
    const color = (serverName === 'SignalR' ? 'orange' : 'darkblue');
    serverName = `<b style="color: ${color}">[${serverName}]</b>`;
    return serverName;
}

class ChatIo{
    socket!: Socket;
    constructor(){
        this.socket = io();
    }
    introduce(name:string){
        this.socket.emit('Introduce', {
            name: name
        });
    }
    
    send(msg:string){
        this.socket.emit('Send', {
            message: msg
        });
    }

    onMsgReceived(handler: (username:string, msg:string, date:string, serverName:string)=>void){
        this.socket.on('messageReceived', data=>{
            handler(data.name, data.message, data.eventTime, data.serverName);
        });
    }
    onUserJoined(handler: (username:string, date:string, serverName:string)=>void){
        this.socket.on('userJoined', data=>{
            handler(data.name, data.eventTime, data.serverName);
        });
    }
}

$(()=>{
    const myUsername = prompt("What's your name?", 'quest') as string;

    const chat = $('#chat');
    const msgInput = $('#msgInput');
    const sendBtn = $('#sendBtn');

    const chatio = new ChatIo();
    chatio.introduce(myUsername);
    

    chatio.onMsgReceived((username, msg, date, serverName)=>{
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} <b>${username}</b>: ${msg}`);
    });
    chatio.onUserJoined((username, date, serverName)=>{
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} User ${username} just joined!`);
    });

    const sendMsgHandler = ()=>{
        const msg = msgInput.val() as string ?? "";
        msgInput.val("");
        if(msg !== "")
            chatio.send(msg);
    }
    sendBtn.on('click', sendMsgHandler);
    msgInput.on('keypress', e=>{
        if(e.which === 13)
            sendMsgHandler();
    });

});