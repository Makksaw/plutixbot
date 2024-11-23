require('dotenv').config();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const url = require('url');

const bot = new Telegraf(process.env.BOT_TOKEN);

const weatherAPI = process.env.WEATHER_API_KEY;

bot.start((ctx) =>
    ctx.reply(
        `Hello @${ctx.chat.username}. Enter the city name, and I will try to fetch weather of it.`
    )
);

bot.on(message('text'), (ctx) => {
    const city = ctx.message.text;

    const params = {
        q: city,
        appid: weatherAPI,
        units: 'metric',
    };

    const formatURL = url.format({ query: params });

    fetch(`https://api.openweathermap.org/data/2.5/weather${formatURL}`)
        .then((response) => response.json())
        .then((data) => {
            const weatherInfo = `Weather in ${data.name}:\n- Temperature: ${data.main.temp} °C\n- Humidity: ${data.main.humidity}%\n- Condition: ${data.weather[0].description}`;
            ctx.reply(weatherInfo);
        })
        .catch((err) =>
            ctx.reply(
                `Oops... Looks like you typed wrong city. Try again...\n${err}`
            )
        );
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
