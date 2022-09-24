import * as signalR from "@microsoft/signalr";

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
class ChatHubClient{
    connection!: signalR.HubConnection;
    async connect(username:string){
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/chat')
            .withAutomaticReconnect()
            .build();
        await this.connection.start();
        await this.connection.invoke("Introduce", username);
    }

    async send(msg:string){
        await this.connection.send('Send', msg);
    }

    startReceivingMessages(handler: (username:string, msg:string, date:string, serverName:string)=>void){
        this.connection.on('messageReceived', handler);
    }
    
    onUserJoined(handler: (username:string, date: string, serverName:string)=>void){
        this.connection.on('userJoined', handler);
    }
}
$(async () => {
    const myUsername = prompt("What's your name?", 'quest') as string;

    const chat = $('#chat');
    const sendBtn = $('#sendBtn');
    const msgInput = $('#msgInput');


    const chatHub = new ChatHubClient();
    await chatHub.connect(myUsername);
    chatHub.startReceivingMessages((username, msg, date, serverName)=>{
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} <b>${username}</b>: ${msg}`);
    });
    chatHub.onUserJoined((username, date, serverName)=>{
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} User ${username} just joined!`);
    });

    const sendMsgHandler = ()=>{
        const msg = msgInput.val() as string ?? "";
        msgInput.val("");
        if(msg !== "")
            chatHub.send(msg);
    }
    sendBtn.on('click', sendMsgHandler);
    msgInput.on('keypress', e=>{
        if(e.which === 13)
            sendMsgHandler();
    });
    
});
