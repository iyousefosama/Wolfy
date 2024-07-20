/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  data: {
    name: "ticketpanel",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: "(Optional: Embed description)",
    group: "Tickets",
    description: "Setup the ticket panel in the server",
    cooldown: 8, //seconds(s)
    guarded: false, //or false
    permissions: ["ManageChannels"],
    examples: [""],
    deleted: true,
  },
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
  },
};
