const discord = require("discord.js");
const { Client } = require("discord.js");
const fs = require("fs");
const commands = [];
const path = require("path");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
 /*  client.slashCommands = new discord.Collection();
  let commandFiles = []; // Array to store command file names

  function readCommands(dir) {
    const folders = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folder of folders) {
      const folderPath = path.join(dir, folder);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        client.slashCommands.set(command.data.name, command);
        commandFiles.push(command.data.name); // Store the command name

        if (command.data instanceof discord.SlashCommandBuilder) {
          commands.push(command.data.toJSON());
        } else {
          commands.push(command.data);
        }
      }
    }
  }

  const slashCommandsDir = path.join(__dirname, "../slashCommands");
  readCommands(slashCommandsDir);

  // Function to remove deleted commands from client.slashCommands
  function removeDeletedCommands() {
    client.slashCommands.forEach((command, name) => {
      if (!commandFiles.includes(name)) {
        client.slashCommands.delete(name);
        console.log(`🗑 Command '${name}' was deleted and removed from slashCommands.`);
      }
    });
  }

  removeDeletedCommands()


  client.on("ready", async () => {
    await new Promise((r) => setTimeout(r, 1500));
    client.user.setPresence({
      activities: [{ name: "Loading...", type: "COMPETING" }],
      status: "dnd",
    });
    if (client.config.loadSlashsGlobal) {
      client.application.commands
        .set(commands)
        .then((slashCommandsData) => {
          console.log(
            `(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map((d) => d.options).flat().length
            } Subcommands)`} Loaded as a public commands`
          );
        })
        .catch((e) => console.log(e));
    } else {
      client.application.commands.set([])
      client.guilds.cache
        .map((g) => g)
        .forEach(async (guild) => {
          try {
            guild.commands
              .set(commands)
              .then((slashCommandsData) => {
                console.log(
                  `(/) ${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map((d) => d.options).flat().length
                  } Subcommands)`} Loaded for ${`${guild.name}`}!`
                );
              })
              .catch((e) => console.log(e));
          } catch (e) {
            console.log(e);
          }
        });
    }
  }); */
};
