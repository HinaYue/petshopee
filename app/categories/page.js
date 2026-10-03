import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { addCategory } from '../actions'
export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db().from('categories').select('*')
  return (
    <Shell user={u} title="Categories" active="categories">
      <div className="section">
        <div className="section-head">
          <h2>Add Category</h2>
        </div>
        <form action={addCategory}>
          <div className="form-grid">
            <div className="form-group">
              <label>Category Name</label>
              <input name="category_name" required />
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea name="description" />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Save Category</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Category Records</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty">
                    No categories recorded.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.category_id}>
                  <td>{x.category_name}</td>
                  <td>{x.description}</td>
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
