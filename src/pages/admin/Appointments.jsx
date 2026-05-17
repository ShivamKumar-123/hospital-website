import { useState, useMemo } from 'react'
import { Plus, Search, Download, Pencil, Trash2, Check, X } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { exportCSV } from '../../utils/storage.js'

const EMPTY = { patientName: '', phone: '', department: '', doctor: '', date: '', time: '', symptoms: '', status: 'Pending' }
const STATUSES = ['Pending', 'Approved', 'Completed', 'Rejected']

export default function Appointments() {
  const { items, add, update, remove } = useLocalCollection('appointments')
  const { items: departments } = useLocalCollection('departments')
  const { items: doctors } = useLocalCollection('doctors')
  const { toast } = useToast()

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const filtered = useMemo(() => {
    return items.filter((a) =>
      (status === 'All' || a.status === status) &&
      (a.patientName.toLowerCase().includes(q.toLowerCase()) || a.doctor.toLowerCase().includes(q.toLowerCase()) || a.department.toLowerCase().includes(q.toLowerCase()))
    )
  }, [items, q, status])

  const perPage = 8
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const slice = filtered.slice((page - 1) * perPage, page * perPage)

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (a) => { setForm(a); setEditId(a.id); setOpenForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (!form.patientName || !form.doctor || !form.date) { toast('Fill required fields', 'error'); return }
    if (editId) { update(editId, form); toast('Appointment updated', 'success') }
    else { add(form); toast('Appointment added', 'success') }
    setOpenForm(false)
  }

  const setStatusFor = (id, st) => { update(id, { status: st }); toast(`Marked ${st}`, 'success') }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Bookings"
        title={<>Appointments</>}
        subtitle="Manage every booking — approve, reject, edit or delete in one click."
        actions={<>
          <button onClick={() => exportCSV(filtered, 'appointments.csv')} className="btn-outline"><Download /> Export</button>
          <button onClick={openAdd} className="btn-primary shine"><Plus /> New appointment</button>
        </>}
      />

      <div className="card p-3 flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-ink-50 rounded-2xl px-4 py-2.5">
          <Search className="text-ink-400" />
          <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search by patient, doctor, department..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        </div>
        <select className="input sm:w-48 !rounded-2xl !py-2.5" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {slice.length === 0 ? <EmptyState title="No appointments" /> : (
          <div className="overflow-x-auto">
            <table className="table-pro min-w-[800px]">
              <thead>
                <tr><th>Patient</th><th>Department</th><th>Doctor</th><th>Date / Time</th><th>Status</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {slice.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-semibold text-ink-900">{a.patientName}</div>
                      <div className="text-xs text-ink-500">{a.phone}</div>
                    </td>
                    <td>{a.department}</td>
                    <td>{a.doctor}</td>
                    <td>{a.date} · {a.time}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        {a.status === 'Pending' && <>
                          <button title="Approve" onClick={() => setStatusFor(a.id, 'Approved')} className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:scale-110 transition"><Check /></button>
                          <button title="Reject" onClick={() => setStatusFor(a.id, 'Rejected')} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><X /></button>
                        </>}
                        <button title="Edit" onClick={() => openEdit(a)} className="h-8 w-8 rounded-xl bg-ink-50 text-ink-700 flex items-center justify-center hover:bg-ink-100 hover:scale-110 transition"><Pencil /></button>
                        <button title="Delete" onClick={() => setDelId(a.id)} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4"><Pagination page={page} pages={pages} onPage={setPage} /></div>
      </div>

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit appointment' : 'New appointment'}>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Patient name *</label><input className="input" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div>
            <label className="label">Department</label>
            <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="">Select</option>
              {departments.map((d) => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Doctor</label>
            <select className="input" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })}>
              <option value="">Select</option>
              {doctors.filter((d) => !form.department || d.department === form.department).map((d) => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label className="label">Date *</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div><label className="label">Time</label><input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
          <div className="sm:col-span-2">
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="label">Symptoms</label><textarea rows="3" className="input" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Appointment deleted', 'success') }} message="This appointment will be permanently removed." />
    </div>
  )
}
