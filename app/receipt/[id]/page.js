import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

// Old UI used PHP date('M d, Y h:i A') on receipts.
const fmtDateTime = d => {
  const h = d.getHours(),
    h12 = h % 12 === 0 ? 12 : h % 12
  return (
    MONTHS[d.getMonth()] +
    ' ' +
    String(d.getDate()).padStart(2, '0') +
    ', ' +
    d.getFullYear() +
    ' ' +
    h12 +
    ':' +
    String(d.getMinutes()).padStart(2, '0') +
    ' ' +
    (h < 12 ? 'AM' : 'PM')
  )
}

export default async function Page({ params }) {
  const u = await requireUser()
  const { id } = await params,
    D = db()
  const { data: s } = await D.from('v_sales_summary')
    .select('*')
    .eq('sale_id', id)
    .maybeSingle()
  const { data: items = [] } = await D.from('sale_items')
    .select('*,products(product_name,sku)')
    .eq('sale_id', id)
  if (!s)
    return (
      <Shell user={u} title="Official Receipt" active="transactions">
        <div className="card">Receipt not found.</div>
      </Shell>
    )
  return (
    <Shell user={u} title="Official Receipt" active="transactions">
      <div className="receipt receipt-paper">
        <div className="center">
          <h3>SALES RECEIPT</h3>
        </div>
        <hr />
        <div className="receipt-meta">
          <p>
            <b>Receipt / Invoice No.:</b> {s.invoice_number}
          </p>
          <p>
            <b>Date &amp; Time:</b> {fmtDateTime(new Date(s.sale_date))}
          </p>
          <p>
            <b>Processed By:</b> {s.cashier}
          </p>
          <p>
            <b>Customer / Owner:</b> {s.customer_name}
          </p>
          <p>
            <b>Transaction Type:</b> {s.service_type}
          </p>
          {s.service_description && (
            <p>
              <b>Service / Notes:</b> {s.service_description}
            </p>
          )}
        </div>
        <hr />
        {items.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.sale_item_id}>
                  <td>
                    {i.products?.product_name}
                    <div className="small">{i.products?.sku}</div>
                  </td>
                  <td>{i.quantity}</td>
                  <td>₱{Number(i.unit_price).toFixed(2)}</td>
                  <td>₱{Number(i.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="receipt-totals">
          <p>
            <span>Subtotal</span>
            <b>₱{Number(s.subtotal).toFixed(2)}</b>
          </p>
          <p>
            <span>Discount</span>
            <b>- ₱{Number(s.discount).toFixed(2)}</b>
          </p>
          <p className="receipt-grand">
            <span>TOTAL</span>
            <b>₱{Number(s.total_amount).toFixed(2)}</b>
          </p>
          <p>
            <span>Amount Paid</span>
            <b>₱{Number(s.amount_paid).toFixed(2)}</b>
          </p>
          <p>
            <span>Change</span>
            <b>₱{Number(s.change_amount).toFixed(2)}</b>
          </p>
        </div>
        <hr />
        <p>
          <b>Payment Method:</b> {s.payment_method}
        </p>
        {s.reference_number && (
          <p>
            <b>Payment Reference:</b> {s.reference_number}
          </p>
        )}
        <div className="center receipt-footer">
          <p>Thank you for your business!</p>
          <p className="small">Please keep this receipt for your records.</p>
        </div>
      </div>
      <div className="actions no-print" style={{ marginTop: 18 }}>
        <span className="btn btn-secondary">Print with Ctrl+P</span>
      </div>
    </Shell>
  )
}
