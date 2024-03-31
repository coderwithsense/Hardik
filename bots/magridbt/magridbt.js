import {Telegraf} from "telegraf";
import prompt from "./prompt.js";

const magridbt_bot_token = "6720377658:AAEcN3RmStmVIlehCdZ5q7vDGS_z6mNC-kA"
const bot = new Telegraf(magridbt_bot_token);

bot.command('start', async (ctx) => {
    ctx.reply('Welcome to MagridBT bot. Use /prompt to ask a question');
})

bot.command('prompt', async (ctx) => {
    const question = ctx.message.text.split(' ').slice(1).join(' ');
    if (!question) {
        await ctx.reply('Please provide a question');
        return;
    }
    ctx.reply('Thinking...');
    const response = await prompt(question);
    ctx.reply(response);
})

bot.command('help', async (ctx) => {
    await ctx.reply('Available commands: \n/start - Start the bot\n/prompt - Prompt a question to be answered for your testing.\n/help - Get help');
})

bot.launch()
