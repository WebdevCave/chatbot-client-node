import dotenv from 'dotenv';
import WWJS from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";
import axios from "axios";

dotenv.config();
const { Client, NoAuth } = WWJS;
const API_URL = 'http://localhost:8000/api/message';
const API_TOKEN = process.env.API_TOKEN;
const API_AUTHORIZATION_HEADER = {
    headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
    }
};

const client = new Client({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new NoAuth(),
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', message => {
    if (!message.fromMe) {
        console.log("New message from " + message.from)

        const body = {
            from: message.from,
            message: message.body,
        };
        axios.post(
            API_URL,
            body,
            API_AUTHORIZATION_HEADER
        ).then(response => {
            if (response.data.message) {
                console.log(`Sending answer to ${message.from}`, response.data.message);
                client.sendMessage(message.from, response.data.message);
                return;
            }

            console.log("No answer available");
        }, error => {
            console.log({error});
        })
    }
});

client.initialize();
