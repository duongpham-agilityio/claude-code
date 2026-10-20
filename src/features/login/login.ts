// Placeholder credential for the training app. Not real authentication.
const VALID_EMAIL = 'admin@test.com'

export const validateLogin = (email: string, password: string) => {
  if (email.trim().toLowerCase() !== VALID_EMAIL) throw new Error('Invalid email')
  if (password === '') throw new Error('Password is required')
}
