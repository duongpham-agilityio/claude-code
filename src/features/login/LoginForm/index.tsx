import { useState, type FormEvent } from 'react'
import { validateLogin } from '../login'

export const LoginForm = () => {
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    try {
      validateLogin(String(data.get('email')), String(data.get('password')))
      setError('')
      setLoggedIn(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  if (loggedIn) return <p>welcome to my app</p>

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
