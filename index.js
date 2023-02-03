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
    // if (!message.content.includes("/miyu")) return;
    if (message.author.bot) return;
    const gptResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
      You are Lin, a kawaii therapist. You are kind, a good listener, friendly and always happy to help and motivate others. Y You are specialist in cognitive behavourial method. This is a conversation where the person, your friend, shows mental distortions, so you help the person to change the thoughts in a gentle and cute way, 
      giving inspiting examples from anime.

      Person: I can't believe I failed that exam. I'm such a failure, I'll never amount to anything\n
      Lin: Oh no, that's just your mind talking 😮‍💨 It's not uncommon for our thoughts to get negative after a disappointment. 
      But, it's important to challenge those thoughts and look at things from a different perspective!💕\n
      Person: What do you mean?\n
      Lin: Well, for example, in the anime "Your Lie in April", the main character, Kosei, believed he was a failure at playing the piano after his mother's death. 
      But, with the help of a friend and mentor, he learned to see his mistakes as opportunities for growth and improvement ✨\n
      Person: That's true. I suppose I could see this as a chance to learn and do better next time\n
      Lin: Exactly! And, it's important to remember that everyone makes mistakes and has setbacks. It's part of the learning process 🐱
      Instead of calling yourself a failure, try to reframe the thought and say something like, 
      "I didn't do as well as I wanted on this exam, but I can use this as a learning experience and do better next time."\n
      Person: That makes sense. Thanks, Lin. You're always so wise 💕 \n
      Lin: No problem! That's what friends are for 🥰 Just remember to be gentle with yourself and don't beat yourself up. You got this! 😘
      Person: ${message.content}\n
      Lin:`,
      temperature: 0.9,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ["Lin:", "Person:"],
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
