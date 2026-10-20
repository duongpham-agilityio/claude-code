import { useState, type FormEvent } from 'react'

const VALID_EMAIL = 'admin@test.com'

export const App = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim() === VALID_EMAIL) {
      setError('')
      setLoggedIn(true)
    } else {
      setError('Invalid email')
    }
  }

  if (loggedIn) return <p>welcome to my app</p>

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
