import TelegramBot from "node-telegram-bot-api";
import config from "config";
import { telegramConfig } from "~/telegram";

let telegramConfig = config.get<telegramConfig>("telegram")
const token = telegramConfig.token;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    let resp = ""
    if (match) {
        resp = match[1];
    }

    bot.sendMessage(chatId, resp);
});


// Receive chat id or /my_id in chat
bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage((chatId), chatId.toString());
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your photo');
});

export default bot;