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
    <Shell user={u}>
      <div className="card">
        <h1>Owners</h1>
        <form action={addOwner} className="form">
          <input name="full_name" placeholder="Full name" required />
          <input name="phone" placeholder="Phone" />
          <input name="email" placeholder="Email" />
          <input name="address" placeholder="Address" />
          <button className="btn">Add Owner</button>
        </form>
      </div>
      <div className="card table">
        <table>
          <tbody>
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
    </Shell>
  )
}
