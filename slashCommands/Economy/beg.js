const discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const schema = require('../../schema/Economy-Schema');
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);

/**
 * @type {import("../../util/types/baseCommandSlash")}
 */
module.exports = {
  data: {
    name: "beg",
    description: "Why don't you try begging, maybe someone will give you money",
    dmOnly: false,
    guildOnly: false,
    cooldown: 5,
    requiresDatabase: true,
    group: "Economy",
    clientPermissions: [],
    permissions: [],
    options: []
  },
  async execute(client, interaction) {
    let data;
    try {
      data = await schema.findOne({
        userID: interaction.user.id,
      });
      if (!data) {
        data = await schema.create({
          userID: interaction.user.id,
        });
      }
    } catch (err) {
      interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
      });
      return client.logDetailedError({
        error: err,
        eventType: "DATABASE_ERR",
        interaction: interaction
      });
    }
    
    const quest = data.progress.quests?.find(x => x.id == 3);
    let Box = quest?.current;
    const now = Date.now();
    const duration = Math.floor(Math.random() * 12000) + 100000;
    
    if (data.timer.beg.timeout > now) {
      return interaction.reply({
        content: `❌ **${interaction.user.tag}**, You have already been given some *coins* earlier! Please try again later.`
      });
    }

    let ppl = ['WOLF', 'me', 'Mr.Beast', 'Tony Stark', 'Mr. joe', 'Anonymous', 'Rick', 'Morty', 'Steve', 'Drako', 'Elon Musk', 'Newton'];
    let givers = Math.floor(Math.random() * ppl.length);
    let moneyget = Math.floor(Math.random() * 125) + 25;
    
    if (quest?.current < quest?.progress) {
      Box++;
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 3 }, 
        { $inc: { "progress.quests.$.current": 1 } }
      );
    }
    
    if (Box && Box == quest?.progress && !quest?.received) {
      data.credits += Math.floor(quest.reward);
      await schema.findOneAndUpdate(
        { userID: interaction.user.id, "progress.quests.id": 3 }, 
        { $set: { "progress.quests.$.received": true } }
      );
      data.progress.completed++;
      await data.save();
      await interaction.reply({ 
        content: `✅ You received: 💰 ${quest.reward} from this command quest.`
      });
    }
    
    data.timer.beg.timeout = Date.now() + duration;
    data.credits += Math.floor(moneyget);
    
    return data.save()
      .then(() => {
        if (!quest || Box < quest?.progress || quest?.received) {
          interaction.reply({
            content: `💵 **${interaction.user.tag}**, You received **💰 ${moneyget}** from ${ppl[givers]}.`
          });
        }
      })
      .catch((err) => interaction.reply({
        content: `💢 [DATABASE_ERR]: The database responded with error: ${err.name}`
      }));
  },
}; 