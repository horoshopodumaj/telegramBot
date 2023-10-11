const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TOKEN;

const bot = new TelegramApi(token, { polling: true });

const start = () => {
    bot.setMyCommands([
        { command: `/start`, description: `Начальное приветствие` },
        { command: `/info`, description: `Получение информации о пользователе` },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, `https://stickerpacks.ru/wp-content/uploads/2023/08/nabor-stikerov-testirovshhik-oleg-dlja-telegram-11.webp`);
            return bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот`);
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ""}`);
        }

        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
    });
};

start();
