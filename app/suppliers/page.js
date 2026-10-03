import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { addSupplier } from '../actions'
export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db().from('suppliers').select('*')
  return (
    <Shell user={u}>
      <div className="card">
        <h1>Suppliers</h1>
        <form action={addSupplier} className="form">
          <input name="supplier_name" placeholder="Supplier" required />
          <input name="contact_person" placeholder="Contact person" />
          <input name="phone" placeholder="Phone" />
          <input name="email" placeholder="Email" />
          <input name="address" placeholder="Address" />
          <button className="btn">Add</button>
        </form>
      </div>
      <div className="card">
        {r.map(x => (
          <p key={x.supplier_id}>{x.supplier_name}</p>
        ))}
      </div>
    </Shell>
  )
}
