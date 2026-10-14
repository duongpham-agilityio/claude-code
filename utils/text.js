/**
 * Options for {@link pluralize}.
 * @typedef {Object} PluralizeOptions
 * @property {string} [plural] Explicit plural form, used instead of the default rules.
 * @property {boolean} [includeCount] Prefix the result with the count, e.g. "3 trips".
 * @example
 * const options = { plural: 'children', includeCount: true };
 */

const ES_ENDING = /(s|x|z|ch|sh)$/i;

const toDefaultPlural = (word) => (ES_ENDING.test(word) ? `${word}es` : `${word}s`);

/**
 * Returns the singular form when `count < 2`, the plural form otherwise.
 * @param {string} word Singular form of the word.
 * @param {number} count Number of items.
 * @param {PluralizeOptions} [options]
 * @returns {string}
 * @example
 * pluralize('trip', 1); // 'trip'
 * pluralize('trip', 3); // 'trips'
 * pluralize('bus', 2); // 'buses'
 * pluralize('child', 2, { plural: 'children', includeCount: true }); // '2 children'
 */
export const pluralize = (word, count, options = {}) => {
  const { plural, includeCount = false } = options;
  const form = count < 2 ? word : (plural ?? toDefaultPlural(word));
  return includeCount ? `${count} ${form}` : form;
};
