import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Download, Search, Truck } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import { exportCSV } from '../../utils/storage.js'

const STATUSES = ['Pending', 'Dispatched', 'Completed']
const EMPTY = { requester: '', phone: '', pickup: '', destination: 'Saubhagyam ER', condition: '', status: 'Pending', driver: '', vehicle: '' }

export default function Ambulance() {
  const { items, add, update, remove } = useLocalCollection('ambulance')
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  const filtered = useMemo(() => items.filter((a) =>
    a.requester.toLowerCase().includes(q.toLowerCase()) || a.pickup.toLowerCase().includes(q.toLowerCase())
  ), [items, q])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpenForm(true) }
  const openEdit = (a) => { setForm(a); setEditId(a.id); setOpenForm(true) }

  const save = (e) => {
    e.preventDefault()
    if (!form.requester || !form.pickup) { toast('Requester and pickup required', 'error'); return }
    if (editId) { update(editId, form); toast('Updated', 'success') } else { add(form); toast('Created', 'success') }
    setOpenForm(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Fleet"
        title="Ambulance management"
        subtitle="Track requests, drivers and vehicle status in real-time."
        actions={<>
          <button onClick={() => exportCSV(items, 'ambulance.csv')} className="btn-outline"><Download /> Export</button>
          <button onClick={openAdd} className="btn-primary shine"><Plus /> New request</button>
        </>}
      />

      <Stagger className="grid sm:grid-cols-3 gap-4">
        {STATUSES.map((s, i) => {
          const tints = ['from-amber-500 to-orange-400', 'from-violet-500 to-pink-500', 'from-emerald-500 to-teal-400']
          return (
            <Item key={s}>
              <div className="card card-hover p-5 relative overflow-hidden">
                <div aria-hidden className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${tints[i]} opacity-20 blur-2xl`} />
                <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">{s}</div>
                <div className="font-display text-4xl font-extrabold mt-2">{items.filter((a) => a.status === s).length}</div>
              </div>
            </Item>
          )
        })}
      </Stagger>

      <div className="card p-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-ink-50 rounded-2xl px-4 py-2.5">
          <Search className="text-ink-400" />
          <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search requester or pickup..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? <EmptyState title="No ambulance requests" /> : (
          <div className="overflow-x-auto">
            <table className="table-pro min-w-[800px]">
              <thead><tr><th>Requester</th><th>Route</th><th>Condition</th><th>Driver / Vehicle</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td><div className="font-semibold">{a.requester}</div><div className="text-xs text-ink-500">{a.phone}</div></td>
                    <td><div className="text-sm">{a.pickup}</div><div className="text-xs text-ink-500">→ {a.destination}</div></td>
                    <td>{a.condition}</td>
                    <td>{a.driver || '—'} {a.vehicle && `· ${a.vehicle}`}</td>
                    <td>
                      <select value={a.status} onChange={(e) => update(a.id, { status: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white">
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => openEdit(a)} className="h-8 w-8 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 hover:scale-110 transition"><Pencil /></button>
                        <button onClick={() => setDelId(a.id)} className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 hover:scale-110 transition"><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editId ? 'Edit request' : 'New ambulance request'} subtitle={editId ? 'Update dispatch details.' : 'Log a new emergency dispatch.'} icon={<Truck size={20} />} intent={editId ? 'info' : 'warning'}>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Requester *</label><input className="input" value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Pickup *</label><input className="input" value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} /></div>
          <div><label className="label">Destination</label><input className="input" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
          <div><label className="label">Condition</label><input className="input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} /></div>
          <div><label className="label">Driver</label><input className="input" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} /></div>
          <div><label className="label">Vehicle</label><input className="input" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setOpenForm(false)}>Cancel</button><button className="btn-primary">{editId ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={() => { remove(delId); toast('Request deleted', 'success') }} message="This ambulance request will be removed." />
    </div>
  )
}
