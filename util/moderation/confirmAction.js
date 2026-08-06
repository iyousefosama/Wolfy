/**
 * Shared destructive-action confirmation helper.
 *
 * Commands like /hackban and /purge-channel used to duplicate the same
 * ~60 lines of confirm/cancel button plumbing: build buttons, reply with
 * withResponse, create a collector, guard ownership on every click, and
 * disable the buttons on timeout. This module consolidates that into one
 * call that resolves with the user's decision.
 *
 * Returns:
 *  - true  → the executor clicked Confirm
 *  - false → the executor clicked Cancel
 *  - null  → nobody answered within `time` ms
 *
 * Once an answer is given, the confirmation buttons are replaced with a
 * single disabled status button so the action can't be re-triggered by a
 * second click while the command finishes its work.
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {object} [options]
 * @param {string} [options.content]           Optional text above the buttons
 * @param {import('discord.js').EmbedBuilder[]} [options.embeds]  Optional embeds
 * @param {number} [options.time=30000]        How long to wait, in ms
 * @param {string} [options.confirmId]         Button customId (confirm)
 * @param {string} [options.cancelId]          Button customId (cancel)
 * @param {string} [options.confirmLabel='Confirm']
 * @param {string} [options.cancelLabel='Cancel']
 * @returns {Promise<boolean|null>} true=confirm, false=cancel, null=timeout
 */
async function confirmAction(interaction, options = {}) {
  const {
    content,
    embeds,
    time = 30000,
    confirmId = 'confirm_action',
    cancelId = 'cancel_action',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
  } = options;

  const confirmButton = new ButtonBuilder()
    .setLabel(confirmLabel)
    .setCustomId(confirmId)
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅');

  const cancelButton = new ButtonBuilder()
    .setLabel(cancelLabel)
    .setCustomId(cancelId)
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌');

  const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

  const callbackResponse = await interaction.reply({ content, embeds, components: [row], withResponse: true });

  // withResponse:true resolves to an InteractionCallbackResponse, not a Message.
  // The actual Message we collect on lives at .resource.message.
  const message = callbackResponse?.resource?.message ?? (await interaction.fetchReply());

  return new Promise((resolve) => {
    const collector = message.createMessageComponentCollector({ time });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({
          content: '❌ You are not the one who executed this command!',
          flags: ['Ephemeral'],
        });
      }

      const confirmed = buttonInteraction.customId === confirmId;
      collector.stop();

      const statusButton = new ButtonBuilder()
        .setLabel(confirmed ? confirmLabel : cancelLabel)
        .setCustomId(`${confirmed ? confirmId : cancelId}_done_${Date.now()}`)
        .setStyle(confirmed ? ButtonStyle.Success : ButtonStyle.Danger)
        .setEmoji(confirmed ? '✅' : '❌')
        .setDisabled(true);

      await buttonInteraction.update({
        components: [new ActionRowBuilder().addComponents(statusButton)],
      }).catch(() => null);

      resolve(confirmed);
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        confirmButton.setDisabled(true);
        cancelButton.setDisabled(true);
        interaction.editReply({
          components: [new ActionRowBuilder().addComponents(confirmButton, cancelButton)],
        }).catch(() => null);

        resolve(null);
      }
    });
  });
}

module.exports = { confirmAction };
