import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { addProduct } from '../actions'

// Old UI showed stock state as a coloured badge (stock_status() in bootstrap.php).
const STOCK_BADGE = {
  'Out of Stock': 'badge-red',
  'Low Stock': 'badge-yellow',
  'In Stock': 'badge-green'
}

export default async function Page() {
  const u = await requireUser(),
    D = db()
  const [{ data: p = [] }, { data: c = [] }, { data: s = [] }] =
    await Promise.all([
      D.from('v_product_inventory').select('*'),
      D.from('categories').select('*'),
      D.from('suppliers').select('*')
    ])
  return (
    <Shell user={u} title="Products" active="products">
      {u.role === 'Administrator' ? (
        <>
          {c.length === 0 && (
            <div className="note">
              Create at least one active category before adding products.
            </div>
          )}
          <div className="section">
            <div className="section-head">
              <h2>Add Product</h2>
            </div>
            <form action={addProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label>SKU Number</label>
                  <input name="sku" required placeholder="e.g. SKU-0001" />
                </div>
                <div className="form-group">
                  <label>Product Name</label>
                  <input name="product_name" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category_id" required>
                    <option value="">Select category</option>
                    {c.map(x => (
                      <option key={x.category_id} value={x.category_id}>
                        {x.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select name="supplier_id">
                    <option value="">None</option>
                    {s.map(x => (
                      <option key={x.supplier_id} value={x.supplier_id}>
                        {x.supplier_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select name="unit" required>
                    {[
                      'Piece',
                      'Box',
                      'Pack',
                      'Bottle',
                      'Bag',
                      'Can',
                      'Sachet',
                      'Tablet',
                      'Capsule',
                      'mL',
                      'Liter',
                      'Gram',
                      'Kilogram'
                    ].map(x => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cost Price</label>
                  <input type="number" step="0.01" min="0" name="cost_price" />
                </div>
                <div className="form-group">
                  <label>Selling Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="selling_price"
                  />
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input type="number" min="0" name="reorder_level" />
                </div>
                <div className="actions full">
                  <button className="btn btn-primary">Save Product</button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="note">
          Employee access is read-only. You can view products, prices, SKU
          numbers, and stock levels.
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2>Product Records</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {p.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">
                    No products recorded.
                  </td>
                </tr>
              )}
              {p.map(x => (
                <tr key={x.product_id}>
                  <td>{x.sku}</td>
                  <td>{x.product_name}</td>
                  <td>{x.category_name}</td>
                  <td>{x.supplier_name}</td>
                  <td>₱{Number(x.selling_price).toFixed(2)}</td>
                  <td>{x.quantity}</td>
                  <td>
                    <span
                      className={
                        'badge ' + (STOCK_BADGE[x.stock_status] || 'badge-blue')
                      }
                    >
                      {x.stock_status}
                    </span>
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
