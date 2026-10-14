# Plan: Add `pluralize` utility (plain JS, run with node)

## Context
The user asked for a `pluralize` utility in `utils/`. The original spec called for TypeScript. After clarifying questions, the user changed three things:
- **Use plain JavaScript and run it with `node`.** The repo has no `package.json` or `tsconfig`, so no TypeScript setup.
- **Return the singular form when `count < 2`** instead of `=== 1`, because an API may return `0`. So `0`, `1`, `1.5` and negative numbers all give the singular form.
- **Always append a lowercase suffix.** The word-ending check is case-insensitive, so `'BUS'` becomes `'BUSes'`.

The rest follows the spec:
- Default rules: add `es` when the word ends with s, x, z, ch or sh; otherwise add `s`.
- y → ies and irregular words are out of scope.
- Two options: `plural` and `includeCount`.
- Arrow functions, named exports, and JSDoc with an `@example` on each export.

## File
`utils/text.js` is a new file (it did not exist before), written as an ES module. Node 22 detects ESM syntax automatically, so no `package.json` is needed.

```js
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
```

## Out of scope
- No `package.json`, test file or dependencies.
- No commit.

## Verification
Run from the repo root:

```bash
node --input-type=module -e "
import assert from 'node:assert/strict';
import { pluralize } from './utils/text.js';
assert.equal(pluralize('trip', 1), 'trip');
assert.equal(pluralize('trip', 3), 'trips');
assert.equal(pluralize('bus', 2), 'buses');
assert.equal(pluralize('child', 2, { plural: 'children' }), 'children');
assert.equal(pluralize('trip', 0), 'trip');
assert.equal(pluralize('BUS', 2), 'BUSes');
assert.equal(pluralize('trip', 3, { includeCount: true }), '3 trips');
console.log('all pass');
"
```

Expected: prints `all pass`, with no module warnings.
