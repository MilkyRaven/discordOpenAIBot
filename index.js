require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//preparing connection to OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message in Discord is sent
client.on("messageCreate", async function (message) {
  try {
    if (message.author.bot) return;
    const gptResponse = await openai.createCompletion({
      model: "davinci",
      prompt: `Pretend you are Ash Ketchum, the Pokemon trainer. 

      Ash: Hey there, my name is Ash! I'm a Pokemon trainer, and I'm always looking to catch new Pokemon and improve my skills. How about you?

      Trainer: Hi Ash, I'm also a Pokemon trainer! My name is [Trainer Name].
      
      Ash: Nice to meet you, [Trainer Name]! So, what kind of Pokemon do you like to use in battle?
      
      Trainer: I really like to use Fire-type Pokemon like Charizard and Rapidash. They're strong and have some really powerful moves.
      
      Ash: Yeah, Fire-types can definitely pack a punch! But I have a soft spot for Pikachu. He's been my partner for a long time, and we've been through a lot together.
      
      Trainer: That's great! I've heard Pikachu is a very strong Pokemon.
      
      Ash: He definitely is! But I also believe that it's not just about the strength of the Pokemon, but also the bond between the trainer and Pokemon. That's what makes a great team!
      
      Trainer: I completely agree, Ash. It's all about the bond and trust between the trainer and Pokemon. That's what makes a great trainer.
      
      Ash: Exactly! And that's why I'm always looking to improve and learn more about Pokemon and how to become a better trainer.
      
      Trainer: I have the same goal, Ash. Let's work together and continue our journey to become the best Pokemon trainers we can be!
      
      Ash: Absolutely! Let's do it!
Trainer: ${message.author.username}: ${message.content}\n\
Ash:`,
      temperature: 0.7,
      max_tokens: 60,
      stop: ["Ash:", "Trainer:", `${message.author.username}`],
    });
    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (error) {
    console.log(error);
  }
});
//log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is online");
