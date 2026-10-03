import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { createAccount } from '../actions'
export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db()
    .from('users')
    .select('user_id,username,full_name,role,status,created_at')
  return (
    <Shell user={u} title="Settings" active="settings">
      <div className="section">
        <h2>Create User Account</h2>
        <div className="note">Only the Administrator can create accounts.</div>
        <br />
        <form action={createAccount}>
          <div className="form-grid">
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
              <input type="password" name="password" minLength="6" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role">
                <option>Staff</option>
                <option>Administrator</option>
              </select>
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Create User</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <h2>Manage User Access</h2>
        <br />
        {r.map(x => (
          <div key={x.user_id} className="account-card">
            <div className="section-head">
              <div>
                <strong>{x.full_name}</strong>
                <div className="muted">
                  @{x.username} · {x.role}
                </div>
              </div>
              <span
                className={
                  'badge ' +
                  (x.status === 'Active' ? 'badge-green' : 'badge-red')
                }
              >
                {x.status}
              </span>
            </div>
            {x.role === 'Administrator' && (
              <div className="note">
                Full access. This is the only account type that can create users
                and assign permissions.
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  )
}
