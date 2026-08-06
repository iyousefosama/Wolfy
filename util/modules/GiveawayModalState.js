'use strict';

/**
 * Temporary state for /giveaway create modals.
 *
 * The modal customId used to carry every option (duration, winners, channel,
 * role ids...) encoded between underscores. That is fragile: the value is
 * visible to the client, length-sensitive, and any extra underscores in a
 * role/channel id or a future option breaks the `split('_')` decoder.
 *
 * Instead we store the options in-memory under a short random key and only
 * embed that key in the customId (`giveaway_modal_<key>`). The modal handler
 * reads the key back and consumes the state in a single shot.
 *
 * Entries auto-expire 15 minutes after they are stored so memory never leaks
 * if the user never submits the modal.
 */

const EXPIRE_MS = 15 * 60 * 1000;

/** @type {Map<string, object>} */
const modalState = new Map();

/**
 * Store modal state and return a short unique key to embed in a customId.
 * @param {object} data
 * @returns {string}
 */
function setModalState(data) {
  let key;
  do {
    key = Math.random().toString(36).slice(2, 8);
  } while (modalState.has(key));

  modalState.set(key, data);
  setTimeout(() => modalState.delete(key), EXPIRE_MS);
  return key;
}

/**
 * Read modal state for a key without consuming it.
 * @param {string} key
 * @returns {object|undefined}
 */
function getModalState(key) {
  return modalState.get(key);
}

/**
 * Read and consume modal state in one shot.
 * @param {string} key
 * @returns {object|undefined}
 */
function takeModalState(key) {
  const data = modalState.get(key);
  modalState.delete(key);
  return data;
}

module.exports = { setModalState, getModalState, takeModalState };
