"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const signalR = __importStar(require("@microsoft/signalr"));
const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
    };
    let dateFormatted = new Intl.DateTimeFormat('pl', options).format(date);
    dateFormatted = `<b style="color: #4D5656;">${dateFormatted}</b>`;
    return dateFormatted;
};
const formatServerName = (serverName) => {
    const color = (serverName === 'SignalR' ? 'orange' : 'darkblue');
    serverName = `<b style="color: ${color}">[${serverName}]</b>`;
    return serverName;
};
class ChatHubClient {
    connect(username) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl('/chat')
                .withAutomaticReconnect()
                .build();
            yield this.connection.start();
            yield this.connection.invoke("Introduce", username);
        });
    }
    send(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.send('Send', msg);
        });
    }
    startReceivingMessages(handler) {
        this.connection.on('messageReceived', handler);
    }
    onUserJoined(handler) {
        this.connection.on('userJoined', handler);
    }
}
$(() => __awaiter(void 0, void 0, void 0, function* () {
    const myUsername = prompt("What's your name?", 'quest');
    const chat = $('#chat');
    const sendBtn = $('#sendBtn');
    const msgInput = $('#msgInput');
    const chatHub = new ChatHubClient();
    yield chatHub.connect(myUsername);
    chatHub.startReceivingMessages((username, msg, date, serverName) => {
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} <b>${username}</b>: ${msg}`);
    });
    chatHub.onUserJoined((username, date, serverName) => {
        const dateFormatted = formatDateTime(date);
        const serverNameFormatted = formatServerName(serverName);
        chat.html(`${chat.html()} <br />${serverNameFormatted} ${dateFormatted} User ${username} just joined!`);
    });
    const sendMsgHandler = () => {
        var _a;
        const msg = (_a = msgInput.val()) !== null && _a !== void 0 ? _a : "";
        msgInput.val("");
        if (msg !== "")
            chatHub.send(msg);
    };
    sendBtn.on('click', sendMsgHandler);
    msgInput.on('keypress', e => {
        if (e.which === 13)
            sendMsgHandler();
    });
}));
//# sourceMappingURL=main.js.map