import { describe, expect, it } from 'vitest'
import { pluralize } from './text.js'

describe('pluralize', () => {
  describe('singular form', () => {
    it('returns the singular when count is 1', () => {
      expect(pluralize('trip', 1)).toBe('trip')
    })

    it('returns the singular when count is 0', () => {
      expect(pluralize('trip', 0)).toBe('trip')
    })
  })

  describe('default plural', () => {
    it('adds "s" when count is 2 or more', () => {
      expect(pluralize('trip', 2)).toBe('trips')
      expect(pluralize('trip', 100)).toBe('trips')
    })

    it.each([
      ['bus', 'buses'],
      ['box', 'boxes'],
      ['quiz', 'quizes'],
      ['church', 'churches'],
      ['dish', 'dishes'],
    ])('adds "es" to words ending in s, x, z, ch, sh: %s -> %s', (word, expected) => {
      expect(pluralize(word, 2)).toBe(expected)
    })

    it('matches the ending case-insensitively', () => {
      expect(pluralize('BUS', 2)).toBe('BUSes')
    })
  })

  describe('plural option', () => {
    it('uses the explicit plural instead of the default rules', () => {
      expect(pluralize('child', 2, { plural: 'children' })).toBe('children')
    })

    it('ignores the explicit plural when count is below 2', () => {
      expect(pluralize('child', 1, { plural: 'children' })).toBe('child')
    })
  })

  describe('includeCount option', () => {
    it('prefixes the count to the plural form', () => {
      expect(pluralize('trip', 3, { includeCount: true })).toBe('3 trips')
    })

    it('prefixes the count to the singular form', () => {
      expect(pluralize('trip', 1, { includeCount: true })).toBe('1 trip')
      expect(pluralize('trip', 0, { includeCount: true })).toBe('0 trip')
    })

    it('works together with the plural option', () => {
      expect(pluralize('child', 2, { plural: 'children', includeCount: true })).toBe('2 children')
    })
  })
})
