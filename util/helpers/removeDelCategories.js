const schema = require("../../schema/Panel-schema");

/**
 *
 * @param guild string
 * @returns {Promise<*>}
 */
const CheckDeletedCategories = async (guild) => {
    let deletedCount = 0;
    let panelsToCheck = await schema.find({ Guild: guild.id });
    for (const panel of panelsToCheck) {
        let category = guild.channels.cache.get(panel.Category);

        if (!category) {
            await schema.findOneAndDelete({ Guild: guild.id, Category: panel.Category });
            deletedCount++;
        }
    }

    if (deletedCount === 0) {
        return 0;
    }

    return deletedCount;
};

module.exports = { CheckDeletedCategories };