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
    <div className="login card">
      <h1>Login</h1>
      {q.error && <div className="msg">{q.error}</div>}
      <form action={login} className="form">
        <input name="username" placeholder="Username" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button className="btn">Login</button>
      </form>
    </div>
  )
}
