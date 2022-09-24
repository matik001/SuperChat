import express from "express"
import configureHandlebars from "./configs/handlebars";
import configureSocketio from "./configs/socketio";
import chatRouter from "./routes/chatRotuer";
import { configureRabbitmq } from "./services/rabbitmq";

const app = express()

configureHandlebars(app);
app.set('views', './views');

app.use('/static', express.static('static'));
app.use('/', chatRouter);

const server = app.listen(3000)
configureRabbitmq().then(()=>{
    configureSocketio(server);
})