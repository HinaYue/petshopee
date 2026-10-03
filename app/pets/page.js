import Link from 'next/link'
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
    <Shell user={u} title="Pets" active="pets">
      <div className="note">
        Pet records are for registered animals/patients. Pet confinement is
        managed only on the <Link href="/confinement">Confinement</Link> page.
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Register Pet</h2>
        </div>
        <form action={addPet}>
          <div className="form-grid">
            <div className="form-group">
              <label>Owner / Customer</label>
              <select name="customer_id" required>
                <option value="">Select owner</option>
                {o.map(x => (
                  <option key={x.customer_id} value={x.customer_id}>
                    {x.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Pet Name</label>
              <input name="pet_name" required />
            </div>
            <div className="form-group">
              <label>Species</label>
              <input name="species" />
            </div>
            <div className="form-group">
              <label>Breed</label>
              <input name="breed" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender">
                <option>Unknown</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Health Status</label>
              <select name="health_status">
                <option>Healthy</option>
                <option>Under Observation</option>
                <option>Needs Treatment</option>
                <option>Recovering</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Save Pet</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Registered Pets</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Pet</th>
                <th>Owner</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {p.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">
                    No pet records.
                  </td>
                </tr>
              )}
              {p.map(x => (
                <tr key={x.pet_id}>
                  <td>{x.pet_code}</td>
                  <td>{x.pet_name}</td>
                  <td>{x.owner_name}</td>
                  <td>{x.species}</td>
                  <td>{x.breed}</td>
                  <td>
                    {x.age_years}y {x.age_months}m
                  </td>
                  <td>
                    <span className="badge badge-blue">{x.health_status}</span>
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
