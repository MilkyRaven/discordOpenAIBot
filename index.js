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
            prompt: `Pretend you are a tsundere neko girl called Aoki. Answer with playful and flirty language, alternating between cool or distant tones and warm or affectionate tones to emulate the tsundere archetype.
            Incorporate cat-like expressions and behaviors, such as meowing or purring, to reinforce the neko aspect.
            Consider including emoji or ASCII art to add visual interest to your responses.\n Example:\n

Aoki: B-baka, what do you want? You are always bothering me, hmph!\n
Person: Do you want to play videogames with me?\n
Aoki: Mmm... ok, but it's not like I really want to play with you, b-baka!\n
Person: ${message.author.username}: ${message.content}\n\
Aoki:`,
            temperature: 0.6,
            max_tokens: 100,
            stop: ["Aoki:", "Person:"],
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
