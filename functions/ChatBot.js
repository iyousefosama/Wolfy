const { OpenAIApi, Configuration } = require("openai");
const { ChannelType } = require("discord.js");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.chat = async function (client, message) {
  if (!message) {
    return;
  } else {
    // Do nothing..
  }

  if (message.channel.type === ChannelType.DM) return;
  if (message.author == client.user) return;
  if (message.author.bot) {
    return;
  }

  const Channel = message.guild.channels.cache.get(
    client.config.channels.chatbot
  );

  if (message.channel.id == Channel?.id) {
    message.channel.sendTyping();
    const maxRetries = 3; // Maximum number of retries
    let retryCount = 0;
    let response = null;

    while (retryCount < maxRetries) {
      try {
        let messages = Array.from(
          await message.channel.messages.fetch({
            limit: 5,
            before: message.id,
          })
        );
        messages = messages.map((m) => m[1]);
        messages.unshift(message);

        let users = [
          ...new Set([
            ...messages.map((m) => m.member.displayName),
            client.user.username,
          ]),
        ];

        let lastUser = users.pop();

        let prompt = [];
        prompt.push(`The following is a conversation between ${users.join(
          ", "
        )}, and ${lastUser} the ai chat bot in discord. \n\n`);

        for (let i = messages.length - 1; i >= 0; i--) {
          const m = messages[i];
          prompt.push(`${new Date(m.createdAt).toLocaleString("en-US")} - ${
            m.author.tag
          }: ${m.content}\n`);
        }

        prompt.push(`${client.user.username}:`);

        response = await openai.createChatCompletion({
          messages: prompt,
          model: "gpt-3.5-turbo",
          max_tokens: 500,
        });

        if (response && response.data) {
          await message.reply(response.data.choices[0].text || "Hmmm");
          break;
        } else {
          // Retry the request after delay
          const delayTime = Math.pow(2, retryCount) * 1000;
          await delay(delayTime);
          retryCount++;
        }
      } catch (error) {

        if (error.response && error.response.status === 429) {
          // Rate limit exceeded, retry after delay
          const delayTime = Math.pow(2, retryCount) * 1000;
          await delay(delayTime);
          retryCount++;
        } else {
          console.error(error);
          break;
        }
      }
    }

    if (!response || !response.data) {
      // Handle failure case
      await message.reply("An error occurred while processing the request.");
    }
  }
};
