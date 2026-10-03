import Link from 'next/link'
import { logout } from '@/app/actions'

export default function Shell({ user, title, active, children }) {
  const admin = user.role === 'Administrator'
  const nav = (key, isSub) => {
    const cls = [isSub ? 'sub' : '', active === key ? 'active' : '']
      .filter(Boolean)
      .join(' ')
    return cls || undefined
  }
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          🐾 PET SHOP<small>MANAGEMENT SYSTEM</small>
        </div>
        <nav className="nav">
          {admin && (
            <>
              <div className="nav-title">Main</div>
              <Link className={nav('dashboard')} href="/dashboard">
                🏠 Dashboard
              </Link>
            </>
          )}

          <div className="nav-title">Management</div>

          <div className="nav-group-label">🐾 Pets</div>
          <Link className={nav('pets', true)} href="/pets">
            Pet
          </Link>
          <Link className={nav('confinement', true)} href="/confinement">
            Confinement
          </Link>
          <Link className={nav('owners', true)} href="/owners">
            Owner
          </Link>

          <div className="nav-group-label">📦 Supplies</div>
          <Link className={nav('products', true)} href="/products">
            Products
          </Link>
          {admin && (
            <>
              <Link className={nav('inventory', true)} href="/inventory">
                Inventory
              </Link>
              <Link className={nav('categories', true)} href="/categories">
                Category
              </Link>
              <Link className={nav('suppliers', true)} href="/suppliers">
                Supplier
              </Link>
            </>
          )}

          <div className="nav-title">Sales</div>
          <Link className={nav('sales')} href="/sales">
            🛒 Sales / POS
          </Link>
          <Link className={nav('transactions')} href="/transactions">
            🧾 Transactions
          </Link>

          {admin && (
            <>
              <div className="nav-title">Reports</div>
              <Link className={nav('reports')} href="/reports">
                📈 Reports
              </Link>
            </>
          )}

          <div className="nav-title">System</div>
          {admin && (
            <Link className={nav('settings')} href="/settings">
              ⚙️ Settings
            </Link>
          )}
          <form action={logout}>
            <button type="submit">🚪 Logout</button>
          </form>
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="user">
            👤 {user.full_name} <span className="muted">({user.role})</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}
