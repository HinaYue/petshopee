import Shell from '@/components/Shell'
import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { addConfinement, discharge } from '../actions'
export default async function Page() {
  const u = await requireUser(),
    D = db()
  const [{ data: p = [] }, { data: c = [] }] = await Promise.all([
    D.from('pets').select('pet_id,pet_name,customer_id'),
    D.from('v_current_confinement').select('*')
  ])
  return (
    <Shell user={u} title="Pet Confinement" active="confinement">
      <div className="section" id="register">
        <div className="section-head">
          <h2>Register Pet Confinement</h2>
        </div>
        <div className="note">
          Use this section only to register a new confinement. Pet discharge is
          handled separately below.
        </div>
        <form action={addConfinement}>
          <div className="form-grid">
            <div className="form-group">
              <label>Pet</label>
              <select name="pet_id" required>
                <option value="">Select pet</option>
                {p.map(x => (
                  <option key={x.pet_id} value={x.pet_id}>
                    {x.pet_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Owner / Customer</label>
              <input
                name="customer_id"
                placeholder="Owner ID (shown in Owners)"
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Discharge Date</label>
              <input name="expected_discharge_date" type="datetime-local" />
            </div>
            <div className="form-group">
              <label>Kennel / Cage</label>
              <input name="kennel_cage" />
            </div>
            <div className="form-group">
              <label>Reason for Confinement</label>
              <textarea name="reason" required />
            </div>
            <div className="form-group full">
              <label>Veterinary / Confinement Notes</label>
              <textarea name="veterinary_notes" />
            </div>
            <div className="actions full">
              <button className="btn btn-primary">Save Confinement</button>
            </div>
          </div>
        </form>
      </div>

      <div className="section" id="discharge">
        <div className="section-head">
          <h2>Discharge Pet</h2>
        </div>
        <div className="note">
          Only currently confined pets appear here. Discharging a pet sets the
          status to <strong>Discharged</strong> and records the actual discharge
          date/time.
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pet</th>
                <th>Owner</th>
                <th>Admission</th>
                <th>Kennel</th>
                <th>Current Status</th>
                <th>Expected Discharge</th>
                <th>Discharge</th>
              </tr>
            </thead>
            <tbody>
              {c.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">
                    No pets are currently confined.
                  </td>
                </tr>
              )}
              {c.map(x => (
                <tr key={x.confinement_id}>
                  <td>
                    {x.pet_name} <small>{x.pet_code}</small>
                  </td>
                  <td>{x.owner_name}</td>
                  <td>{x.admission_date}</td>
                  <td>{x.kennel_cage}</td>
                  <td>
                    <span className="badge badge-blue">{x.status}</span>
                  </td>
                  <td>{x.expected_discharge_date}</td>
                  <td className="actions">
                    <form action={discharge}>
                      <input type="hidden" name="id" value={x.confinement_id} />
                      <button className="btn btn-primary">Discharge</button>
                    </form>
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
