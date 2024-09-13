const Client = require("../struct/Client");
const config = require("../config");
const { error } = require("../util/console")

class ComponentsListener {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        client.on('interactionCreate', async (interaction) => {
            const checkUserPermissions = async (component) => {
                if (component?.public === false && interaction.user.id !== interaction.message.interaction.user.id) {
                    await interaction.reply({
                        content: config.messages.COMPONENT_NOT_PUBLIC,
                        ephemeral: true
                    });

                    return false;
                }

                return true;
            }

            try {
                if (interaction.isButton()) {
                    if (interaction?.customId?.startsWith("collect")) return;

                    const [part1, part2, ...rest] = interaction.customId.split("_");
                    const componentId = `${part1}_${part2}`;
              
                    const component =
                      client.ComponentsAction.get(componentId) ||
                      client.ComponentsAction.get(part1) ||
                      client.ComponentsAction.get(interaction.customId);
              
                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        component.action(client, interaction, [part1, part2, ...rest]);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isAnySelectMenu()) {
                    const component = client.ComponentsAction.get(interaction.customId);

                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        component.action(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isModalSubmit()) {
                    const component = client.ComponentsAction.get(interaction.customId);

                    if (!component) return;

                    try {
                        component.action(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isAutocomplete()) {
                    const component = client.ComponentsAction.get(interaction.commandName);

                    if (!component) return;

                    try {
                        component.action(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }
            } catch (err) {
                error(err);
            }
        });
    }
}

module.exports = ComponentsListener;