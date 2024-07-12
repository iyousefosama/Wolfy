/**
 * 
 * @param {string} string 
 * @returns {string}
 */
exports.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};