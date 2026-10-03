import { setupAdmin } from '../actions'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function Page({ searchParams }) {
  const { count } = await db()
    .from('users')
    .select('*', { count: 'exact', head: true })
  if (count) redirect('/login')
  const q = await searchParams
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">🔐</div>
        <h1>Create Administrator</h1>
        <p>First-time setup</p>
        {q.error && <div className="alert alert-error">{q.error}</div>}
        <form action={setupAdmin}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="full_name" required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button className="btn btn-primary" type="submit">
            Create Administrator
          </button>
        </form>
      </div>
    </div>
  )
}
