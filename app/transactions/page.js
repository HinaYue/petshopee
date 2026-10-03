import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
export default async function Page() {
  const u = await requireUser()
  const { data: r = [] } = await db()
    .from('v_sales_summary')
    .select('*')
    .order('sale_date', { ascending: false })
  return (
    <Shell user={u} title="Transactions" active="transactions">
      <div className="section">
        <div className="section-head">
          <h2>Sales Transactions</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Cashier</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty">
                    No transactions recorded.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.sale_id}>
                  <td>{x.invoice_number}</td>
                  <td>{new Date(x.sale_date).toLocaleString()}</td>
                  <td>{x.customer_name}</td>
                  <td>{x.service_type}</td>
                  <td>{x.cashier}</td>
                  <td>₱{Number(x.total_amount).toFixed(2)}</td>
                  <td>{x.payment_method}</td>
                  <td>{x.status}</td>
                  <td className="actions">
                    <Link
                      className="btn btn-secondary"
                      href={'/receipt/' + x.sale_id}
                    >
                      Receipt
                    </Link>
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
