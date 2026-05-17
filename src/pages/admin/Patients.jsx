import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Download, Upload, User } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { exportCSV } from '../../utils/storage.js'

const EMPTY = { name: '', age: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: 'O+', condition: '', history: '', photo: '' }

export default function Patients() {
  const { items, add, update, remove } = useLocalCollection('patients')
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)
  const [view, setView] = useState(null)

  const filtered = useMemo(() => items.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || (p.condition || '').toLowerCase().includes(q.toLowerCase())
  ), [items, q])
  const perPage = 8
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const slice = filtered.slice((page - 1) * perPage, page * perPage)

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (p) => { setForm(p); setEditId(p.id); setOpenForm(true) }

  const uploadPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }))
    reader.readAsDataURL(file)
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.name) { toast('Name is required', 'error'); return }
    if (editId) { update(editId, form); toast('Patient updated', 'success') }
    else { add(form); toast('Patient added', 'success') }
    setOpenForm(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Registry"
        title="Patients"
        subtitle="Records, photos, contacts and medical history."
        actions={<>
          <button onClick={() => exportCSV(items, 'patients.csv')} className="btn-outline"><Download /> Export</button>
          <button onClick={openAdd} className="btn-primary shine"><Plus /> Add patient</button>
        </>}
      />

      <div className="card p-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-ink-50 rounded-2xl px-4 py-2.5">
          <Search className="text-ink-400" />
          <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search by name or condition..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {slice.length === 0 ? <EmptyState title="No patients" /> : (
          <div className="overflow-x-auto">
            <table className="table-pro min-w-[800px]">
              <thead><tr><th>Patient</th><th>Age/Gender</th><th>Contact</th><th>Condition</th><th>Blood</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {slice.map((p) => (
                  <tr key={p.id}>
                    <td className="flex items-center gap-3">
                      {p.photo ? <img src={p.photo} className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"><User /></div>}
                      <div>
                        <button onClick={() => setView(p)} className="font-semibold text-ink-900 hover:text-brand-700">{p.name}</button>
                        <div className="text-xs text-ink-500">{p.email}</div>
                      </div>
                    </td>
                    <td>{p.age} · {p.gender}</td>
                    <td>{p.phone}</td>
                    <td>{p.condition}</td>
                    <td><span className="chip bg-rose-50 text-rose-700">{p.bloodGroup}</span></td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => openEdit(p)} className="h-8 w-8 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 hover:scale-110 transition"><Pencil /></button>
                        <button onClick={() => setDelId(p.id)} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><Trash2 /></button>
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

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit patient' : 'Add patient'} subtitle={editId ? 'Update the patient record.' : 'Register a new patient.'} size="lg" icon={<User size={20} />} intent={editId ? 'info' : 'default'}>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex items-center gap-4">
            {form.photo ? <img src={form.photo} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"><User size={28} /></div>}
            <label className="btn-outline cursor-pointer text-sm"><Upload /> Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </label>
          </div>
          <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Age</label><input className="input" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          <div><label className="label">Gender</label><select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="label">Blood group</label><select className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map((b) => <option key={b}>{b}</option>)}</select></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Condition</label><input className="input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Medical history</label><textarea rows="3" className="input" value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title="Patient profile" icon={<User size={20} />} intent="info">
        {view && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {view.photo ? <img src={view.photo} className="h-20 w-20 rounded-2xl object-cover" /> : <div className="h-20 w-20 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-3xl"><User /></div>}
              <div>
                <h3 className="text-xl font-bold">{view.name}</h3>
                <p className="text-ink-500 text-sm">{view.age} years · {view.gender} · {view.bloodGroup}</p>
                <p className="text-ink-500 text-sm">{view.phone} · {view.email}</p>
              </div>
            </div>
            <div><span className="label">Condition</span><p>{view.condition || '—'}</p></div>
            <div><span className="label">Address</span><p>{view.address || '—'}</p></div>
            <div><span className="label">Medical history</span><p className="whitespace-pre-wrap">{view.history || 'No history recorded.'}</p></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Patient deleted', 'success') }} message="The patient record will be permanently removed." />
    </div>
  )
}
