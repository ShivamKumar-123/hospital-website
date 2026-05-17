import { useState } from 'react'
import { Plus, Trash2, Star, Check, X } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'

const EMPTY = { name: '', role: 'Patient', rating: 5, message: '', approved: true, photo: 'https://i.pravatar.cc/100' }

export default function Testimonials() {
  const { items, add, update, remove } = useLocalCollection('testimonials')
  const { toast } = useToast()
  const [openForm, setOpenForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) { toast('Name and message required', 'error'); return }
    add(form); toast('Testimonial added', 'success'); setOpenForm(false); setForm(EMPTY)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Reviews"
        title="Testimonials"
        subtitle="Approve patient reviews and manage the public stories shown on the website."
        actions={<button onClick={() => setOpenForm(true)} className="btn-primary shine"><Plus /> Add testimonial</button>}
      />

      {items.length === 0 ? <div className="card"><EmptyState title="No testimonials" /></div> : (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <Item key={t.id}>
              <div className="card card-hover p-6 relative overflow-hidden">
                <div aria-hidden className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-violet-100 opacity-40 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <img src={t.photo} className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow" />
                    <div>
                      <div className="font-bold text-ink-900">{t.name}</div>
                      <div className="text-xs text-ink-500">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-3 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className={i < t.rating ? 'fill-current' : 'opacity-30'} />)}
                  </div>
                  <p className="text-sm text-ink-700 mt-3 italic leading-relaxed">"{t.message}"</p>
                  <div className="flex justify-between items-center mt-5">
                    <span className={`chip border ${t.approved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>● {t.approved ? 'Approved' : 'Pending'}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => update(t.id, { approved: !t.approved })} title="Toggle approve" className="h-8 w-8 rounded-xl bg-ink-50 hover:bg-ink-100 hover:scale-110 flex items-center justify-center transition">{t.approved ? <X /> : <Check />}</button>
                      <button onClick={() => setDelId(t.id)} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-110 flex items-center justify-center transition"><Trash2 /></button>
                    </div>
                  </div>
                </div>
              </div>
            </Item>
          ))}
        </Stagger>
      )}

      <Modal open={openForm} onClose={() => setOpenForm(false)} title="Add testimonial" subtitle="Capture what patients love about MediCare+." icon={<Star size={20} />} intent="default">
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Role</label><input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          <div><label className="label">Rating</label><input className="input" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
          <div><label className="label">Photo URL</label><input className="input" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Message *</label><textarea rows="3" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} /> Approved (show publicly)</label>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">Add</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Removed', 'success') }} message="The testimonial will be removed." />
    </div>
  )
}
