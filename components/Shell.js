import Link from 'next/link'
import { logout } from '@/app/actions'
export default function Shell({user,children}){
 const admin=user.role==='Administrator'
 return <div className="shell"><aside className="side"><h2>Pet Shop / Vet Clinic</h2>
 <Link href="/dashboard">Dashboard</Link><b>Management</b>
 <Link href="/pets">Pets</Link><Link href="/confinement">Confinement</Link><Link href="/owners">Owners</Link>
 <br/><b>Supplies</b><Link href="/products">Products</Link>{admin&&<><Link href="/inventory">Inventory</Link><Link href="/categories">Categories</Link><Link href="/suppliers">Suppliers</Link></>}
 <br/><b>Sales</b><Link href="/sales">Sales / POS</Link><Link href="/transactions">Transactions</Link>
 {admin&&<><br/><Link href="/reports">Reports</Link><Link href="/settings">Settings / Accounts</Link></>}
 <form action={logout}><button className="btn btn2" style={{marginTop:20}}>Logout</button></form>
 </aside><main className="main"><div className="top"><div><b>{user.full_name}</b><div className="muted">{user.role}</div></div></div>{children}</main></div>
}
