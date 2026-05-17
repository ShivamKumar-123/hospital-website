import { useState } from 'react'
import { Plus, Pencil, Trash2, Upload, PenLine } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import { fmtDate } from '../../utils/format.js'

const EMPTY = { title: '', category: '', author: '', thumbnail: '', excerpt: '', content: '' }

export default function Blogs() {
  const { items, add, update, remove } = useLocalCollection('blogs')
  const { toast } = useToast()
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (b) => { setForm(b); setEditId(b.id); setOpenForm(true) }

  const uploadThumb = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = () => setForm((x) => ({ ...x, thumbnail: r.result })); r.readAsDataURL(f)
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.title) { toast('Title required', 'error'); return }
    if (editId) { update(editId, form); toast('Blog updated', 'success') } else { add(form); toast('Blog published', 'success') }
    setOpenForm(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Content"
        title="Blog management"
        subtitle="Write, edit and publish health articles."
        actions={<button onClick={openAdd} className="btn-primary shine"><Plus /> New post</button>}
      />

      {items.length === 0 ? <div className="card"><EmptyState title="No blog posts" /></div> : (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((b) => (
            <Item key={b.id}>
              <div className="card card-hover overflow-hidden group">
                <div className="relative h-44 overflow-hidden">
                  <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <span className="absolute top-3 left-3 chip bg-white/90 backdrop-blur text-ink-800">{b.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-extrabold mt-1 line-clamp-2 leading-snug">{b.title}</h3>
                  <p className="text-xs text-ink-500 mt-2">By {b.author} · {fmtDate(b.createdAt)}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEdit(b)} className="btn-outline text-sm flex-1 !py-2"><Pencil /> Edit</button>
                    <button onClick={() => setDelId(b.id)} className="btn-danger !py-2 !px-3"><Trash2 /></button>
                  </div>
                </div>
              </div>
            </Item>
          ))}
        </Stagger>
      )}

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit post' : 'New post'} subtitle={editId ? 'Refine your article.' : 'Publish a new article for the blog.'} size="lg" icon={<PenLine size={20} />} intent={editId ? 'info' : 'default'}>
        <form onSubmit={save} className="grid gap-4">
          <div className="flex items-center gap-4">
            {form.thumbnail && <img src={form.thumbnail} className="h-16 w-24 rounded-lg object-cover" />}
            <label className="btn-outline cursor-pointer text-sm"><Upload /> Upload thumbnail
              <input type="file" accept="image/*" className="hidden" onChange={uploadThumb} />
            </label>
            <input className="input flex-1" placeholder="Or paste image URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="label">Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Author</label><input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Excerpt</label><textarea rows="2" className="input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="label">Content</label><textarea rows="6" className="input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Publish'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Blog deleted', 'success') }} message="This post will be permanently removed." />
    </div>
  )
}
