const ascii = require('ascii-table');
const path = require('path');
const { recursiveReadDirSync } = require('../util/class/utils');
const consoleUtil = require("../util/console")


/**
 * 
 * @param {import("../struct/Client")} client 
 * @param {string} directory directory containing the event files
 */
const ComponentsLoader = async (client, directory) => {
    const { default: chalk } = await import('chalk'); // Dynamically import chalk
    let Component_table = new ascii(`Client All Components`);

    Component_table.setHeading('Component file', "IsEnabled", 'Load Status');
    Component_table.setBorder('║', '═', '✥', '🌟');
    Component_table.setAlign(0, ascii.CENTER);
    Component_table.setAlign(1, ascii.LEFT);
    Component_table.setAlign(2, ascii.LEFT);
    Component_table.setAlign(3, ascii.CENTER);

    recursiveReadDirSync(directory).forEach(filePath => {
        const fileName = path.basename(filePath);

        /**
         * @type {import("../util/types/baseComponent")} 
         */
        const Component = require(filePath);

        try {
            if (typeof Component !== "object") return;
            client.loadComponent(Component);
            delete require.cache[require.resolve(filePath)];

            if (Component.enabled)
                Component_table.addRow(fileName, '✅', '✅');
            else Component_table.addRow(fileName, '❌', '✅');
        } catch (ex) {
            if (Component.enabled) Component_table.addRow(chalk.red(fileName), '❌', '❌');

            console.error(`Failed to load ${fileName} Reason: ${ex.message}`);
        }
    });

    if (client.ComponentsAction?.size === 0 || !client.ComponentsAction?.size) {
        return consoleUtil.warn(`No Components were loaded!`)
    }
    console.log(`Loaded ${client.ComponentsAction.size} Components`);
    console.log(Component_table.toString());
};

module.exports = ComponentsLoader;
