import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { addOwner } from '../actions'
export default async function Page() {
  const u = await requireUser()
  const { data: r = [] } = await db()
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  return (
    <Shell user={u} title="Customers / Owners" active="owners">
      <div className="section">
        <div className="section-head">
          <h2>Add Customer / Owner</h2>
        </div>
        <form action={addOwner}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="full_name" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Save Customer</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Customer / Owner Records</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty">
                    No customers recorded.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.customer_id}>
                  <td>{x.customer_code}</td>
                  <td>{x.full_name}</td>
                  <td>{x.phone}</td>
                  <td>{x.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  )
}
