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

// Renders 'YYYY-MM-DD' as 'Mon DD, YYYY' (old UI used date('M d, Y')).
const longDate = iso => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const [y, m, d] = iso.split('-')
  return MONTHS[Number(m) - 1] + ' ' + d + ', ' + y
}

export default async function Page({ searchParams }) {
  const u = await requireUser(),
    D = db(),
    q = await searchParams
  const today = new Date().toISOString().slice(0, 10),
    start = q.start || today,
    end = q.end || today
  const from = start + 'T00:00:00.000Z',
    to = end + 'T23:59:59.999Z'
  const { data: sales = [] } = await D.from('sales')
    .select('*')
    .gte('sale_date', from)
    .lte('sale_date', to)
    .eq('status', 'Completed')
  const { data: conf = [] } = await D.from('confinements')
    .select('*')
    .gte('admission_date', from)
    .lte('admission_date', to)
  const total = sales.reduce((a, x) => a + Number(x.total_amount), 0)
  const isToday = start === end
  return (
    <Shell user={u} title="Dashboard" active="dashboard">
      <div className="section no-print">
        <div className="section-head">
          <div>
            <h2>{isToday ? "Today's Dashboard" : 'Overall Performance'}</h2>
            <p className="muted">
              {isToday
                ? "Only records created or completed today are shown. Tomorrow, the dashboard automatically starts with the new day's data."
                : 'Viewing recorded activity for the selected date range.'}
            </p>
          </div>
        </div>
        <form className="form-grid" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" name="start" defaultValue={start} required />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" name="end" defaultValue={end} required />
          </div>
          <div className="actions full">
            <button className="btn btn-primary">Show Performance</button>
          </div>
        </form>
      </div>

      <div className="dashboard-period">
        <strong>
          {isToday
            ? 'Today: ' + longDate(start)
            : 'Performance Period: ' + longDate(start) + ' — ' + longDate(end)}
        </strong>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Sales Revenue</span>
          <strong>₱{total.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <span>Transactions</span>
          <strong>{sales.length}</strong>
        </div>
        <div className="stat-card">
          <span>Confinements</span>
          <strong>{conf.length}</strong>
        </div>
      </div>
    </Shell>
  )
}
