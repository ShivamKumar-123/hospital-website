import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, Download, Upload, User, Stethoscope } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import { exportCSV } from '../../utils/storage.js'

const EMPTY = { name: '', department: '', qualification: '', experience: 0, availability: '', status: 'Available', photo: '', social: { tw: '', li: '' } }

export default function Doctors() {
  const { items, add, update, remove } = useLocalCollection('doctors')
  const { items: departments } = useLocalCollection('departments')
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const filtered = useMemo(() => items.filter((d) =>
    (dept === 'All' || d.department === dept) &&
    (d.name.toLowerCase().includes(q.toLowerCase()) || d.department.toLowerCase().includes(q.toLowerCase()))
  ), [items, q, dept])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (d) => { setForm({ ...d, social: d.social || { tw: '', li: '' } }); setEditId(d.id); setOpenForm(true) }

  const uploadPhoto = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const r = new FileReader(); r.onload = () => setForm((f) => ({ ...f, photo: r.result })); r.readAsDataURL(file)
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.name || !form.department) { toast('Name & department required', 'error'); return }
    if (editId) { update(editId, form); toast('Doctor updated', 'success') } else { add(form); toast('Doctor added', 'success') }
    setOpenForm(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Team"
        title="Doctors"
        subtitle="Specialist profiles, departments, availability and photos."
        actions={<>
          <button onClick={() => exportCSV(items, 'doctors.csv')} className="btn-outline"><Download /> Export</button>
          <button onClick={openAdd} className="btn-primary shine"><Plus /> Add doctor</button>
        </>}
      />

      <div className="card p-3 flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-ink-50 rounded-2xl px-4 py-2.5">
          <Search className="text-ink-400" />
          <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search doctor..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-56 !rounded-2xl !py-2.5" value={dept} onChange={(e) => setDept(e.target.value)}>
          <option>All</option>
          {departments.map((d) => <option key={d.id}>{d.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? <div className="card"><EmptyState title="No doctors" /></div> : (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <Item key={d.id}>
              <div className="card card-hover overflow-hidden group text-center">
                <div className="relative h-44 bg-gradient-to-br from-brand-50 to-violet-50 overflow-hidden">
                  {d.photo ? <img src={d.photo} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /> :
                    <div className="w-full h-full flex items-center justify-center text-5xl text-brand-300"><User /></div>}
                </div>
                <div className="p-5 -mt-10 relative">
                  <h4 className="font-display text-lg font-extrabold inline-block bg-white px-3 py-1 rounded-full shadow-soft">{d.name}</h4>
                  <p className="text-brand-600 text-sm font-semibold mt-2">{d.department}</p>
                  <p className="text-xs text-ink-500 mt-1">{d.qualification}</p>
                  <p className="text-xs text-ink-500">{d.experience} yrs · {d.availability}</p>
                  <div className="mt-3"><StatusBadge status={d.status} /></div>
                  <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => openEdit(d)} className="h-9 w-9 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 hover:scale-110 transition"><Pencil /></button>
                    <button onClick={() => setDelId(d.id)} className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><Trash2 /></button>
                  </div>
                </div>
              </div>
            </Item>
          ))}
        </Stagger>
      )}

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit doctor' : 'Add doctor'} subtitle={editId ? 'Update doctor profile.' : 'Add a new doctor to the directory.'} size="lg" icon={<Stethoscope size={20} />} intent={editId ? 'info' : 'default'}>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex items-center gap-4">
            {form.photo ? <img src={form.photo} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center"><User size={26} /></div>}
            <label className="btn-outline cursor-pointer text-sm"><Upload /> Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </label>
          </div>
          <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Department *</label>
            <select className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="">Select</option>
              {departments.map((d) => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label className="label">Qualification</label><input className="input" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} /></div>
          <div><label className="label">Experience (years)</label><input className="input" type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} /></div>
          <div><label className="label">Availability</label><input className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="Mon–Fri" /></div>
          <div><label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Available</option><option>On Leave</option><option>Inactive</option>
            </select>
          </div>
          <div><label className="label">Twitter</label><input className="input" value={form.social.tw} onChange={(e) => setForm({ ...form, social: { ...form.social, tw: e.target.value } })} /></div>
          <div><label className="label">LinkedIn</label><input className="input" value={form.social.li} onChange={(e) => setForm({ ...form, social: { ...form.social, li: e.target.value } })} /></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Doctor deleted', 'success') }} message="This doctor will be permanently removed." />
    </div>
  )
}
