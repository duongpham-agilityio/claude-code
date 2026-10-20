import { describe, expect, it } from 'vitest'
import { validateLogin } from './login'

describe('validateLogin', () => {
  it('accepts the valid email with a password', () => {
    expect(() => validateLogin('admin@test.com', 'pw')).not.toThrow()
  })

  it('ignores case and surrounding whitespace in the email', () => {
    expect(() => validateLogin('  Admin@Test.com ', 'pw')).not.toThrow()
  })

  it('rejects a wrong email', () => {
    expect(() => validateLogin('wrong@test.com', 'pw')).toThrow('Invalid email')
  })

  it('rejects an empty or malformed email', () => {
    expect(() => validateLogin('', 'pw')).toThrow('Invalid email')
    expect(() => validateLogin('abc', 'pw')).toThrow('Invalid email')
  })

  it('rejects an empty password', () => {
    expect(() => validateLogin('admin@test.com', '')).toThrow('Password is required')
  })
})
