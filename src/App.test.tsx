import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'

afterEach(cleanup)

const login = (email: string) => {
  render(<App />)
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'anything' } })
  fireEvent.click(screen.getByRole('button', { name: 'Login' }))
}

describe('App login', () => {
  it('shows error for wrong email and keeps the form', () => {
    login('wrong@test.com')
    expect(screen.getByText('Invalid email')).toBeTruthy()
    expect(screen.queryByText('welcome to my app')).toBeNull()
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy()
  })

  it('shows welcome and hides form for valid email', () => {
    login('admin@test.com')
    expect(screen.getByText('welcome to my app')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Login' })).toBeNull()
    expect(screen.queryByLabelText('Email')).toBeNull()
  })

  it('trims whitespace around the email', () => {
    login('  admin@test.com  ')
    expect(screen.getByText('welcome to my app')).toBeTruthy()
  })

  it('accepts the email regardless of case', () => {
    login('Admin@Test.com')
    expect(screen.getByText('welcome to my app')).toBeTruthy()
  })

  it('shows error for a malformed email', () => {
    login('abc')
    expect(screen.getByText('Invalid email')).toBeTruthy()
  })

  it('shows error for an empty email', () => {
    login('')
    expect(screen.getByText('Invalid email')).toBeTruthy()
  })

  it('shows error for an empty password', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByText('Password is required')).toBeTruthy()
    expect(screen.queryByText('welcome to my app')).toBeNull()
  })

  it('clears the error after a failed attempt followed by a success', () => {
    login('wrong@test.com')
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.queryByText('Invalid email')).toBeNull()
    expect(screen.getByText('welcome to my app')).toBeTruthy()
  })
})
