require('colors');
const fs = require('fs');

const appendTerminalLog = (tag, message) => {
    const line = `${tag} ${message.join(' ')}\n`;
    fs.promises.appendFile('./terminal.log', line, 'utf-8').catch(() => null);
};

/**
 * @param {string[]} message 
 */
const info = (...message) => {
    const time = new Date().toLocaleTimeString();
    const timestamp = `[${time}]`;

    console.info(timestamp.gray, '[Info]'.blue, message.join(' '));
    appendTerminalLog(`${timestamp} [Info]`, message);
}

/**
 * @param {string[]} message 
 */
const success = (...message) => {
    const time = new Date().toLocaleTimeString();
    const timestamp = `[${time}]`;

    console.info(timestamp.gray, '[OK]'.green, message.join(' '));
    appendTerminalLog(`${timestamp} [OK]`, message);
}

/**
 * @param {string[]} message 
 */
const error = (...message) => {
    const time = new Date().toLocaleTimeString();
    const timestamp = `[${time}]`;

    console.error(timestamp.gray, '[Error]'.red, message.join(' '));
    appendTerminalLog(`${timestamp} [Error]`, message);
}

/**
 * @param {string[]} message 
 */
const warn = (...message) => {
    const time = new Date().toLocaleTimeString();
    const timestamp = `[${time}]`;

    console.warn(timestamp.gray, '[Warning]'.yellow, message.join(' '));
    appendTerminalLog(`${timestamp} [Warning]`, message);
}

module.exports = { info, success, error, warn }
