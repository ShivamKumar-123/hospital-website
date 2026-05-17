import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'

const EMPTY = { name: '', description: '', image: '', doctors: 0, availability: 'Mon–Sat' }

export default function Departments() {
  const { items, add, update, remove } = useLocalCollection('departments')
  const { items: doctors } = useLocalCollection('doctors')
  const { toast } = useToast()
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (d) => { setForm(d); setEditId(d.id); setOpenForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (!form.name) { toast('Name required', 'error'); return }
    if (editId) { update(editId, form); toast('Department updated', 'success') } else { add(form); toast('Department added', 'success') }
    setOpenForm(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Specialties"
        title="Departments"
        subtitle="Manage centers of excellence and assigned doctors."
        actions={<button onClick={openAdd} className="btn-primary shine"><Plus /> Add department</button>}
      />

      {items.length === 0 ? <div className="card"><EmptyState title="No departments" /></div> : (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((d) => {
            const assigned = doctors.filter((doc) => doc.department === d.name).length
            return (
              <Item key={d.id}>
                <div className="card card-hover overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={d.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={d.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 font-display text-xl font-extrabold text-white">{d.name}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-ink-500 line-clamp-2">{d.description}</p>
                    <div className="flex justify-between items-center text-xs text-ink-500 mt-3">
                      <span className="chip-brand">{assigned} doctors</span>
                      <span>{d.availability}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openEdit(d)} className="btn-outline flex-1 text-sm !py-2"><Pencil /> Edit</button>
                      <button onClick={() => setDelId(d.id)} className="btn-danger !py-2 !px-3"><Trash2 /></button>
                    </div>
                  </div>
                </div>
              </Item>
            )
          })}
        </Stagger>
      )}

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit department' : 'Add department'}>
        <form onSubmit={save} className="grid gap-4">
          <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Image URL</label><input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
          <div><label className="label">Description</label><textarea rows="3" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Doctors count</label><input className="input" type="number" value={form.doctors} onChange={(e) => setForm({ ...form, doctors: Number(e.target.value) })} /></div>
            <div><label className="label">Availability</label><input className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Department deleted', 'success') }} message="Removing a department will not delete doctors but will leave them unassigned." />
    </div>
  )
}
