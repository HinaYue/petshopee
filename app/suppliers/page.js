import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { addSupplier } from '../actions'
export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db().from('suppliers').select('*')
  return (
    <Shell user={u} title="Suppliers" active="suppliers">
      <div className="section">
        <div className="section-head">
          <h2>Add Supplier</h2>
        </div>
        <form action={addSupplier}>
          <div className="form-grid">
            <div className="form-group">
              <label>Supplier Name</label>
              <input name="supplier_name" required />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input name="contact_person" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" />
            </div>
            <div className="form-group full">
              <label>Address</label>
              <textarea name="address" />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Save Supplier</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Supplier Records</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty">
                    No suppliers recorded.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.supplier_id}>
                  <td>{x.supplier_code}</td>
                  <td>{x.supplier_name}</td>
                  <td>{x.contact_person}</td>
                  <td>{x.phone}</td>
                  <td>{x.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  )
}
