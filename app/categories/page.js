import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { addCategory } from '../actions'
export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db().from('categories').select('*')
  return (
    <Shell user={u}>
      <div className="card">
        <h1>Categories</h1>
        <form action={addCategory} className="form">
          <input name="category_name" placeholder="Category" required />
          <input name="description" placeholder="Description" />
          <button className="btn">Add</button>
        </form>
      </div>
      <div className="card">
        {r.map(x => (
          <p key={x.category_id}>{x.category_name}</p>
        ))}
      </div>
    </Shell>
  )
}
