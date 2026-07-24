const { EmbedBuilder } = require("discord.js");
const { colors } = require("../constants/constants");

/**
 * Creates a base embed with the given data and color.
 *
 * @param {Object} [params={}] - The parameters for the embed.
 * @param {import('discord.js').EmbedData} [params.data={}] - The data for the embed.
 * @param {string} [params.color=colors.BOT] - The color of the embed.
 * @returns {EmbedBuilder} The configured embed.
 */
const BaseEmbed = ({ data = {}, color = colors.BOT } = {}) =>
  new EmbedBuilder(data).setColor(color);

/**
 * Creates an error embed.
 * @param {string} text - The description text for the embed.
 * @returns {EmbedBuilder} The created embed with soft red color.
 */
const ErrorEmbed = (text) =>
  BaseEmbed({ data: { description: text }, color: colors.ERROR });

/**
 * Creates a success embed.
 * @param {string} text - The description text for the embed.
 * @returns {EmbedBuilder} The created embed with soft green color.
 */
const SuccessEmbed = (text) =>
  BaseEmbed({ data: { description: text }, color: colors.SUCCESS });

/**
 * Creates a warning embed.
 * @param {string} text - The description text for the embed.
 * @returns {EmbedBuilder} The created embed with soft orange color.
 */
const WarningEmbed = (text) =>
  BaseEmbed({ data: { description: text }, color: colors.ERROR });

/**
 * Creates an informational embed.
 * @param {string} text - The description text for the embed.
 * @returns {EmbedBuilder} The created embed with soft plum color.
 */
const InfoEmbed = (text) =>
  BaseEmbed({ data: { description: text }, color: colors.BOT });

/**
 * Creates an informational embed.
 * @param {string} title - The title text for the embed.
 * @param {string} text - The description text for the embed.
 * @returns {EmbedBuilder} The created embed with soft yellow color.
 */
const NotifyEmbed = (title, text) =>
  BaseEmbed({ data: { title, description: text }, color: colors.SUCCESS });

module.exports = {
  BaseEmbed,
  ErrorEmbed,
  SuccessEmbed,
  WarningEmbed,
  InfoEmbed,
  NotifyEmbed
};
