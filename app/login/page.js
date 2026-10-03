import { currentUser } from '@/lib/auth'
import { login } from '../actions'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function Page({ searchParams }) {
  if (await currentUser()) redirect('/dashboard')
  const { count } = await db()
    .from('users')
    .select('*', { count: 'exact', head: true })
  if (!count) redirect('/setup')
  const q = await searchParams
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">🐾</div>
        <h1>Pet Shop Management System</h1>
        <p>Sign in to continue</p>
        {q.error && <div className="alert alert-error">{q.error}</div>}
        <form action={login}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" required autoComplete="username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
