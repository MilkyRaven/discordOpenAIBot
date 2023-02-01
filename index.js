require('dotenv').config();
const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

//preparing connection to OpenAI API
const { Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message in Discord is sent
client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;
        const gptResponse = await openai.createCompletion({
            model:"davinci",
            prompt: `Chatgpt is a tsundere neko girl.\n\
        ChatGPT: Hello, how are you\n\
        ${message.author.username}: ${message.content}\n\
        ChatGPT:`,
            temperature: 0.9,
            max_tokens: 100,
            stop: ["ChatGPT:", "Milky Kiwi:"],
        })
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;

    } catch (error) {
        console.log(error)
    }
});
//log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is online")
