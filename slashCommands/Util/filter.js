const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

const filterOptions = {
  blurpify: 'blurpify',
  magik: 'magik',
  deepfry: 'deepfry',
  awooify: 'awooify',
  baguette: 'baguette',
  trash: 'trash',
  jpeg: 'jpeg',
  lolice: 'lolice'
};

const availableOptions = Object.keys(filterOptions).join(', ');

module.exports = {
  clientpermissions: [
    'EMBED_LINKS',
    'ATTACH_FILES'
  ],
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Adds filters to your avatar!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('filter_option')
        .setDescription('Select a filter option')
        .addStringOption(option => option.setName('filter').setDescription('The filter option').setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('The user'))),
  async execute(client, interaction) {
    const selectedFilter = interaction.options.getString('filter');
    const user = interaction.options.getUser('target') || interaction.user;

    if (!filterOptions[selectedFilter]) {
      await interaction.reply({ content: `\\❌ You didn't choose a valid filter option!\n\`\`\`\n${availableOptions}\n\`\`\``, ephemeral: true });
      return;
    }

    const apiKey = '5a2724fd-8e5c-4153-8a96-865565896743'; 
    const res = await fetch(`https://api.deepai.org/api/image-editor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'api-key': apiKey
        },
        body: new URLSearchParams({
          image: user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }),
          text:  filterOptions[selectedFilter]
        })
      });

    const json = await res.json();

    if (json.status === 'error' || !json) {
      await interaction.reply({ content: `\\❌ Something went wrong with the API, please try again later.`, ephemeral: true });
      return;
    }

    console.log(json)
    const attachment = new AttachmentBuilder(json.output_url, `${selectedFilter}.png`);
    await interaction.reply({ files: [attachment] });
  },
};
