const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TOKEN;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                { text: `1`, callback_data: "1" },
                { text: `2`, callback_data: "2" },
                { text: `3`, callback_data: "3" },
            ],
            [
                { text: `4`, callback_data: "4" },
                { text: `5`, callback_data: "5" },
                { text: `6`, callback_data: "6" },
            ],
            [
                { text: `7`, callback_data: "7" },
                { text: `8`, callback_data: "8" },
                { text: `9`, callback_data: "9" },
            ],
            [{ text: `0`, callback_data: "0" }],
        ],
    }),
};

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: `Играть ещё раз`, callback_data: "/again" }]],
    }),
};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должна/должен её отгадать.`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: `/start`, description: `Начальное приветствие` },
        { command: `/info`, description: `Получение информации о пользователе` },
        { command: `/game`, description: `Игра угадай цифру` },
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

        if (text === "/game") {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === "/again") {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    });
};

start();
