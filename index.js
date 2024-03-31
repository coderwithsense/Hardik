import {Telegraf} from "telegraf";
import dotenv from "dotenv";
import {getTokenList, getTokenInformation} from "./lib/moralis.js";
import {responseText} from "./lib/helper.js";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
    await ctx.reply('Welcome to the bot');
})

bot.command('t', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    const stringText = text.toString();
    const response = await getTokenList(stringText);
    if (typeof response === 'string') {
        await ctx.reply(response);
        return;
    }
    const answer = response.map((token) => {
        return `${token.symbol} - ${token.balance} - ${token.possible_spam}`
    }).join('\n');
    await ctx.reply(answer);
})

bot.command('token', async (ctx) => {
    const address = ctx.message.text.split(' ').slice(1).join(' ');
    const response = await getTokenInformation(address);
    ctx.reply(response);
})

bot.command('help', async (ctx) => {
    await ctx.reply('This is a bot that fetches the token balances of an address');
})

bot.launch()
