import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSale } from '../actions'
export default async function Page({ searchParams }) {
  const u = await requireUser(),
    D = db(),
    q = await searchParams
  const [{ data: p = [] }, { data: c = [] }] = await Promise.all([
    D.from('v_product_inventory').select('*').gt('quantity', 0),
    D.from('customers').select('customer_id,full_name')
  ])
  return (
    <Shell user={u} title="Sales / Point of Sale" active="sales">
      {q.error && <div className="alert alert-error">{q.error}</div>}
      <form action={createSale} className="grid2">
        <div className="section">
          <h2>Products</h2>
          <br />
          <div className="note">
            No products added. Service-only transactions are allowed.
          </div>
          <div className="form-grid">
            <div className="form-group full">
              <label>Product</label>
              <select name="product_id">
                <option value="">No product / service only</option>
                {p.map(x => (
                  <option key={x.product_id} value={x.product_id}>
                    {x.sku} — {x.product_name} — ₱
                    {Number(x.selling_price).toFixed(2)} — Stock {x.quantity}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" min="1" defaultValue="1" />
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Transaction Details</h2>
          <br />
          <div className="form-grid">
            <div className="form-group">
              <label>Service Type</label>
              <select name="service_type" required>
                <option>Product Sale</option>
                <option>Pet Check Up</option>
                <option>Confinement</option>
                <option>Other Service</option>
              </select>
            </div>
            <div className="form-group">
              <label>Customer / Owner</label>
              <select name="customer_id">
                <option value="">Walk-in Customer</option>
                {c.map(x => (
                  <option key={x.customer_id} value={x.customer_id}>
                    {x.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group full">
              <label>Service Description / Notes</label>
              <input
                name="service_description"
                placeholder="e.g. General check-up, 2-day confinement, vaccination"
              />
            </div>
            <div className="form-group">
              <label>Service Charge</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="service_amount"
                defaultValue="0"
              />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discount"
                defaultValue="0"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select name="payment_method">
                <option>Cash</option>
                <option>GCash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Reference No.</label>
              <input name="reference_number" placeholder="Optional for cash" />
            </div>
            <div className="form-group">
              <label>Amount Paid</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="amount_paid"
                required
              />
            </div>
            <div className="form-group">
              <label>Processed By</label>
              <input value={u.full_name} disabled />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Complete Sale</button>
            </div>
          </div>
        </div>
      </form>
    </Shell>
  )
}
