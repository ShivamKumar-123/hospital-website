import { useState } from 'react'
import { Save, Upload, Check } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import Reveal from '../../components/anim/Reveal.jsx'

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const { toast } = useToast()
  const [form, setForm] = useState(settings)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const uploadLogo = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = () => set('logo', r.result); r.readAsDataURL(f)
  }

  const save = (e) => {
    e.preventDefault()
    updateSettings(form)
    toast('Settings saved', 'success')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Configure"
        title="Settings"
        subtitle="Customize hospital identity, contact details and theme."
        actions={<button onClick={save} type="submit" form="settings-form" className="btn-primary shine"><Save /> Save changes</button>}
      />

      <form id="settings-form" onSubmit={save} className="grid lg:grid-cols-3 gap-5">
        <Reveal dir="up" className="lg:col-span-2">
          <div className="card p-6 md:p-8 space-y-5">
            <h3 className="font-display text-xl font-extrabold">Hospital identity</h3>
            <div className="flex items-center gap-4">
              {form.logo ? <img src={form.logo} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-pink-500 text-white font-black flex items-center justify-center text-2xl shadow-glow">+</div>}
              <label className="btn-outline cursor-pointer text-sm"><Upload /> Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={uploadLogo} />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="label">Hospital name</label><input className="input" value={form.hospitalName || ''} onChange={(e) => set('hospitalName', e.target.value)} /></div>
              <div><label className="label">Tagline</label><input className="input" value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address || ''} onChange={(e) => set('address', e.target.value)} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} /></div>
              <div><label className="label">Emergency number</label><input className="input" value={form.emergency || ''} onChange={(e) => set('emergency', e.target.value)} /></div>
              <div><label className="label">Email</label><input className="input" value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></div>
              <div><label className="label">Visiting hours</label><input className="input" value={form.hours || ''} onChange={(e) => set('hours', e.target.value)} /></div>
            </div>
          </div>
        </Reveal>

        <Reveal dir="up" delay={0.1}>
          <div className="card p-6 md:p-8 space-y-5 h-full">
            <h3 className="font-display text-xl font-extrabold">Social & theme</h3>
            <div><label className="label">Facebook</label><input className="input" value={form.facebook || ''} onChange={(e) => set('facebook', e.target.value)} /></div>
            <div><label className="label">Twitter</label><input className="input" value={form.twitter || ''} onChange={(e) => set('twitter', e.target.value)} /></div>
            <div><label className="label">Instagram</label><input className="input" value={form.instagram || ''} onChange={(e) => set('instagram', e.target.value)} /></div>
            <div><label className="label">LinkedIn</label><input className="input" value={form.linkedin || ''} onChange={(e) => set('linkedin', e.target.value)} /></div>
            <div>
              <label className="label">Primary color</label>
              <div className="flex items-center gap-3">
                <input type="color" className="h-12 w-16 rounded-2xl border border-ink-200 cursor-pointer" value={form.themePrimary || '#0891b2'} onChange={(e) => set('themePrimary', e.target.value)} />
                <input className="input flex-1 font-mono" value={form.themePrimary || ''} onChange={(e) => set('themePrimary', e.target.value)} />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-primary w-full !py-3.5 shine"><Check /> Save settings</button>
            </div>
          </div>
        </Reveal>
      </form>
    </div>
  )
}
