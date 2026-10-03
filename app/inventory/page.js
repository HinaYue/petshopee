import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { setStock } from '../actions'

// Old UI showed stock state as a coloured badge (stock_status() in bootstrap.php).
const STOCK_BADGE = {
  'Out of Stock': 'badge-red',
  'Low Stock': 'badge-yellow',
  'In Stock': 'badge-green'
}

export default async function Page() {
  const u = await requireAdmin()
  const { data: r = [] } = await db().from('v_product_inventory').select('*')
  const totalUnits = r.reduce((a, x) => a + Number(x.quantity), 0)
  const lowStock = r.filter(x => x.stock_status === 'Low Stock').length
  const outOfStock = r.filter(x => x.stock_status === 'Out of Stock').length
  return (
    <Shell user={u} title="Inventory" active="inventory">
      <div className="cards cards-3">
        <div className="card">
          <div className="muted">Total Stock Units</div>
          <div className="kpi">{totalUnits}</div>
        </div>
        <div className="card">
          <div className="muted">Low Stock Products</div>
          <div className="kpi">{lowStock}</div>
        </div>
        <div className="card">
          <div className="muted">Out of Stock</div>
          <div className="kpi">{outOfStock}</div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Stock Adjustment</h2>
        </div>
        <form action={setStock}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product / SKU</label>
              <select name="product_id" required>
                <option value="">Select product</option>
                {r.map(x => (
                  <option key={x.product_id} value={x.product_id}>
                    {x.sku} — {x.product_name} (Stock: {x.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" min="0" name="quantity" required />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Apply Stock Update</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Inventory Records</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    No products available for inventory.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.product_id}>
                  <td>{x.sku}</td>
                  <td>{x.product_name}</td>
                  <td>
                    <strong>{x.quantity}</strong>
                  </td>
                  <td>{x.reorder_level}</td>
                  <td>
                    <span
                      className={
                        'badge ' + (STOCK_BADGE[x.stock_status] || 'badge-blue')
                      }
                    >
                      {x.stock_status}
                    </span>
                  </td>
                  <td className="actions">
                    <form action={setStock}>
                      <input
                        type="hidden"
                        name="product_id"
                        value={x.product_id}
                      />
                      <input
                        name="quantity"
                        type="number"
                        min="0"
                        defaultValue={x.quantity}
                      />
                      <button className="btn btn-secondary">
                        Adjust Stock
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  )
}
