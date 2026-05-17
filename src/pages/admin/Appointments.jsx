import { useState, useMemo } from 'react'
import { Plus, Search, Download, Pencil, Trash2, Check, X, Eye, ShieldCheck, Image as ImageIcon, Calendar } from 'lucide-react'
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
const STATUSES = ['Pending', 'Pending Verification', 'Approved', 'Completed', 'Rejected']

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
  const [viewPayment, setViewPayment] = useState(null)

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

  const verifyPayment = (a) => {
    update(a.id, { status: 'Approved', paymentStatus: 'Verified', verifiedAt: new Date().toISOString() })
    toast(`Payment verified · ${a.patientName} confirmed`, 'success')
    setViewPayment(null)
  }

  const rejectPayment = (a) => {
    update(a.id, { status: 'Rejected', paymentStatus: 'Rejected', verifiedAt: new Date().toISOString() })
    toast(`Payment rejected · ${a.patientName}`, 'error')
    setViewPayment(null)
  }

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
            <table className="table-pro min-w-[960px]">
              <thead>
                <tr><th>Patient</th><th>Department</th><th>Doctor</th><th>Date / Time</th><th>Status</th><th>Payment</th><th className="text-right">Actions</th></tr>
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
                      {a.paymentScreenshot ? (
                        <button onClick={() => setViewPayment(a)} className="group flex items-center gap-2 text-left">
                          <img src={a.paymentScreenshot} alt="payment" className="h-10 w-10 rounded-lg object-cover ring-1 ring-ink-200 group-hover:ring-brand-400 transition" />
                          <div>
                            <div className="text-xs font-bold text-ink-900">₹{Number(a.paymentAmount || 0).toLocaleString('en-IN')}</div>
                            <div className={`text-[10px] font-semibold ${a.paymentStatus === 'Verified' ? 'text-emerald-600' : a.paymentStatus === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
                              {a.paymentStatus || 'Awaiting'}
                            </div>
                          </div>
                        </button>
                      ) : (
                        <span className="text-xs text-ink-400 flex items-center gap-1.5"><ImageIcon size={12} /> No payment</span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        {a.status === 'Pending Verification' && <>
                          <button title="Verify payment" onClick={() => verifyPayment(a)} className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:scale-110 transition"><ShieldCheck size={16} /></button>
                          <button title="Reject payment" onClick={() => rejectPayment(a)} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><X /></button>
                        </>}
                        {a.status === 'Pending' && <>
                          <button title="Approve" onClick={() => setStatusFor(a.id, 'Approved')} className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 hover:scale-110 transition"><Check /></button>
                          <button title="Reject" onClick={() => setStatusFor(a.id, 'Rejected')} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><X /></button>
                        </>}
                        {a.paymentScreenshot && <button title="View payment" onClick={() => setViewPayment(a)} className="h-8 w-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 hover:scale-110 transition"><Eye size={16} /></button>}
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

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit appointment' : 'New appointment'} icon={<Calendar size={20} />} intent={editId ? 'info' : 'default'}>
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

      <Modal open={!!viewPayment} onClose={() => setViewPayment(null)} title="Payment verification" subtitle="Review the payment screenshot and confirm or reject the booking." size="lg" intent="info" icon={<ShieldCheck size={20} />}>
        {viewPayment && (
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Screenshot</p>
              <div className="mt-2 rounded-2xl border border-ink-100 bg-ink-50 p-2">
                <img src={viewPayment.paymentScreenshot} alt="payment screenshot" className="w-full max-h-[60vh] object-contain rounded-xl" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Patient</p>
                <p className="font-bold text-ink-900">{viewPayment.patientName}</p>
                <p className="text-xs text-ink-500">{viewPayment.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Department" value={viewPayment.department} />
                <Field label="Doctor" value={viewPayment.doctor} />
                <Field label="Date" value={viewPayment.date} />
                <Field label="Time" value={viewPayment.time} />
                <Field label="Method" value={viewPayment.paymentMethod || 'UPI'} />
                <Field label="Amount" value={`₹${Number(viewPayment.paymentAmount || 0).toLocaleString('en-IN')}`} />
              </div>
              {viewPayment.transactionRef && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Transaction reference</p>
                  <p className="font-mono text-sm text-ink-900 break-all">{viewPayment.transactionRef}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Current status</p>
                <div className="mt-1"><StatusBadge status={viewPayment.status} /></div>
              </div>

              {viewPayment.status === 'Pending Verification' ? (
                <div className="pt-2 flex gap-2">
                  <button onClick={() => rejectPayment(viewPayment)} className="btn-outline flex-1 !text-rose-600 !border-rose-200 hover:!bg-rose-50"><X size={16} /> Reject</button>
                  <button onClick={() => verifyPayment(viewPayment)} className="btn-primary flex-1 shine"><ShieldCheck size={16} /> Verify & confirm</button>
                </div>
              ) : (
                <div className="rounded-2xl bg-ink-50 p-3 text-xs text-ink-600">
                  Already <strong>{viewPayment.paymentStatus || viewPayment.status}</strong>
                  {viewPayment.verifiedAt && ` · ${new Date(viewPayment.verifiedAt).toLocaleString()}`}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value || '—'}</p>
    </div>
  )
}
