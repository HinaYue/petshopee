import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { addPet } from '../actions'
export default async function Page() {
  const u = await requireUser(),
    D = db()
  const [{ data: o = [] }, { data: p = [] }] = await Promise.all([
    D.from('customers').select('customer_id,full_name'),
    D.from('v_pet_list').select('*')
  ])
  return (
    <Shell user={u}>
      <div className="card">
        <h1>Pets</h1>
        <form action={addPet} className="form">
          <input name="pet_name" placeholder="Pet name" required />
          <select name="customer_id" required>
            <option value="">Owner</option>
            {o.map(x => (
              <option key={x.customer_id} value={x.customer_id}>
                {x.full_name}
              </option>
            ))}
          </select>
          <input name="species" placeholder="Species" />
          <input name="breed" placeholder="Breed" />
          <select name="gender">
            <option>Unknown</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <select name="health_status">
            <option>Healthy</option>
            <option>Under Observation</option>
            <option>Needs Treatment</option>
            <option>Recovering</option>
            <option>Critical</option>
          </select>
          <button className="btn">Register Pet</button>
        </form>
      </div>
      <div className="card table">
        <table>
          <tbody>
            {p.map(x => (
              <tr key={x.pet_id}>
                <td>{x.pet_code}</td>
                <td>{x.pet_name}</td>
                <td>{x.owner_name}</td>
                <td>{x.species}</td>
                <td>{x.health_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}
