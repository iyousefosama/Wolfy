/**
 * 
 * @param {import('discord.js').ApplicationCommand} existingCommand 
 * @param {import('discord.js').ApplicationCommand} localCommand 
 * @param {boolean} skipIntegrationContexts - Skip checking integration_types and contexts
 * @returns {boolean}
 */
module.exports = (existingCommand, localCommand, skipIntegrationContexts = false) => {
  const areChoicesDifferent = (existingChoices, localChoices) => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }

      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  const areOptionsDifferent = (existingOptions, localOptions) => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      if (!existingOption) {
        return true;
      }

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== (existingOption.required || false) ||
        (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
        areChoicesDifferent(localOption.choices || [], existingOption.choices || []) ||
        // Add logic to handle options array differences
        (localOption.options?.length || 0) !== (existingOption.options?.length || 0) ||
        areOptionsDifferent(localOption.options || [], existingOption.options || [])
      ) {
        return true;
      }
    }
    return false;
  };

  // Check if integration_types are different
  const areIntegrationTypesDifferent = () => {
    const existing = existingCommand.integration_types;
    const local = localCommand.integration_types;

    // If local has values but existing doesn't, need to add them
    if (local && local.length > 0 && !existing) return true;
    // If existing has values but local doesn't, need to remove them
    if (existing && existing.length > 0 && !local) return true;
    // If both don't have values, no difference
    if (!local && !existing) return false;
    // If both have values, compare them
    if (existing.length !== local.length) return true;
    for (let i = 0; i < existing.length; i++) {
      if (existing[i] !== local[i]) return true;
    }
    return false;
  };

  // Check if contexts are different
  const areContextsDifferent = () => {
    const existing = existingCommand.contexts;
    const local = localCommand.contexts;

    // If local has values but existing doesn't, need to add them
    if (local && local.length > 0 && !existing) return true;
    // If existing has values but local doesn't, need to remove them
    if (existing && existing.length > 0 && !local) return true;
    // If both don't have values, no difference
    if (!local && !existing) return false;
    // If both have values, compare them
    if (existing.length !== local.length) return true;
    for (let i = 0; i < existing.length; i++) {
      if (existing[i] !== local[i]) return true;
    }
    return false;
  };

  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || []) ||
    (!skipIntegrationContexts && areIntegrationTypesDifferent()) ||
    (!skipIntegrationContexts && areContextsDifferent())
  ) {
    return true;
  }

  return false;
};
