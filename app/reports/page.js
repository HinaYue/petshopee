import Link from 'next/link'
import Shell from '@/components/Shell'
import { requireAdmin } from '@/lib/auth'
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

// Old UI used PHP date('M d, Y') / date('M d, Y h:i A') for report headers.
const fmtDate = d =>
  MONTHS[d.getMonth()] +
  ' ' +
  String(d.getDate()).padStart(2, '0') +
  ', ' +
  d.getFullYear()

const fmtDateTime = d => {
  const h = d.getHours(),
    h12 = h % 12 === 0 ? 12 : h % 12
  return (
    fmtDate(d) +
    ' ' +
    h12 +
    ':' +
    String(d.getMinutes()).padStart(2, '0') +
    ' ' +
    (h < 12 ? 'AM' : 'PM')
  )
}

export default async function Page({ searchParams }) {
  const u = await requireAdmin(),
    q = await searchParams
  const today = new Date().toISOString().slice(0, 10),
    start = q.start || today,
    end = q.end || today,
    year = new Date().getFullYear()
  const { data: r = [] } = await db()
    .from('v_sales_summary')
    .select('*')
    .gte('sale_date', start + 'T00:00:00Z')
    .lte('sale_date', end + 'T23:59:59Z')
    .eq('status', 'Completed')
    .order('sale_date')
  const total = r.reduce((a, x) => a + Number(x.total_amount), 0)
  const totalDiscount = r.reduce((a, x) => a + Number(x.discount), 0)
  return (
    <Shell user={u} title="Reports" active="reports">
      <div className="section no-print">
        <h2>Sales Report Date Range</h2>
        <p className="muted">
          Choose the exact period you want to view or print. For example,
          October 1 to December 31.
        </p>
        <br />
        <form className="form-grid">
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="start" defaultValue={start} required />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="end" defaultValue={end} required />
          </div>
          <div className="actions full">
            <button className="btn btn-primary">Generate Report</button>
            <Link
              className="btn btn-secondary"
              href={'/reports?start=' + year + '-01-01&end=' + year + '-12-31'}
            >
              This Year
            </Link>
            <span className="muted">
              To print: press Ctrl+P after generating.
            </span>
          </div>
        </form>
      </div>

      <div className="section report-print-area">
        <div className="report-print-header">
          <h3>Sales Report</h3>
          <div>
            <b>Period:</b> {fmtDate(new Date(start))} — {fmtDate(new Date(end))}
          </div>
          <div>
            <b>Generated:</b> {fmtDateTime(new Date())}
          </div>
        </div>

        <div className="stats-grid report-summary">
          <div className="stat-card">
            <span>Transactions</span>
            <strong>{r.length}</strong>
          </div>
          <div className="stat-card">
            <span>Total Discounts</span>
            <strong>₱{totalDiscount.toFixed(2)}</strong>
          </div>
          <div className="stat-card">
            <span>Total Sales</span>
            <strong>₱{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Processed By</th>
                <th>Payment</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty">
                    No completed sales found for the selected dates.
                  </td>
                </tr>
              )}
              {r.map(x => (
                <tr key={x.sale_id}>
                  <td>{fmtDateTime(new Date(x.sale_date))}</td>
                  <td>{x.invoice_number}</td>
                  <td>{x.customer_name}</td>
                  <td>{x.service_type}</td>
                  <td>{x.cashier}</td>
                  <td>{x.payment_method}</td>
                  <td>₱{Number(x.discount).toFixed(2)}</td>
                  <td>₱{Number(x.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="6">TOTAL</th>
                <th>₱{totalDiscount.toFixed(2)}</th>
                <th>₱{total.toFixed(2)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="report-signatures">
          <div>Prepared by: __________________________</div>
          <div>Verified by: __________________________</div>
        </div>
      </div>
    </Shell>
  )
}
