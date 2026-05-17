import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle, Copy, QrCode, Smartphone, Upload, ShieldCheck,
  ArrowUpRight, ArrowLeft, AlertTriangle, Hash, Image as ImageIcon
} from 'lucide-react'
import { addRecord } from '../../utils/storage.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSeo } from '../../utils/seo.js'
import PageHero from '../../components/public/PageHero.jsx'
import Reveal from '../../components/anim/Reveal.jsx'

const PENDING_KEY = 'medicare:pending-appointment'

const readPending = () => {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })

export default function Payment() {
  useSeo({
    title: 'Complete Payment — Confirm Your Appointment',
    description: 'Pay your consultation fee via UPI or QR code, upload the payment screenshot and we will verify and confirm your appointment shortly.',
    path: '/appointment/payment',
    noindex: true
  })

  const { settings } = useSettings()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // Form data flows in via route state on the happy path, with a
  // localStorage fallback so a page refresh doesn't lose the booking.
  const formData = location.state?.form || readPending()

  useEffect(() => {
    if (!formData) {
      toast('Please fill the appointment form first', 'error')
      navigate('/appointment', { replace: true })
    } else {
      // persist for refresh-resilience
      localStorage.setItem(PENDING_KEY, JSON.stringify(formData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const amount = Number(settings.consultationFee || 500)
  const upiId = settings.upiId || 'medicare@upi'
  const payeeName = settings.hospitalName || 'Saubhagyam Hospital'

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: String(amount),
      cu: 'INR',
      tn: `Appointment ${formData?.department || ''}`.trim()
    })
    return `upi://pay?${params.toString()}`
  }, [upiId, payeeName, amount, formData])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(upiLink)}`

  const [method, setMethod] = useState('upi')
  const [screenshot, setScreenshot] = useState('')
  const [txnRef, setTxnRef] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast('Please upload an image', 'error'); return }
    if (file.size > 2 * 1024 * 1024) { toast('Image must be under 2 MB', 'error'); return }
    const b64 = await fileToBase64(file)
    setScreenshot(b64)
  }

  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(upiId); toast('UPI ID copied', 'success') }
    catch { toast('Copy failed — select manually', 'error') }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!screenshot) { toast('Please upload the payment screenshot', 'error'); return }

    setBusy(true)
    addRecord('appointments', {
      ...formData,
      status: 'Pending Verification',
      paymentStatus: 'Awaiting Verification',
      paymentMethod: method === 'upi' ? 'UPI' : 'QR Code',
      paymentAmount: amount,
      paymentScreenshot: screenshot,
      transactionRef: txnRef.trim(),
      paidAt: new Date().toISOString(),
      userId: user?.id || null,
      userEmail: user?.email || formData.email
    })
    addRecord('notifications', {
      title: 'Payment received — awaiting verification',
      message: `${formData.patientName} paid ₹${amount.toLocaleString('en-IN')} for ${formData.department}`,
      type: 'appointment',
      read: false
    })

    localStorage.removeItem(PENDING_KEY)
    setDone(true)
    setBusy(false)

    setTimeout(() => navigate(user?.role === 'patient' ? '/account' : '/', { replace: true }), 3000)
  }

  if (!formData) return null

  if (done) {
    return (
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 mesh-bg" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container-xl relative">
          <div className="max-w-md mx-auto glass p-10 text-center">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-4xl shadow-glow">
              <ShieldCheck />
            </div>
            <h2 className="font-display text-3xl font-extrabold mt-5">Payment submitted</h2>
            <p className="text-ink-500 mt-3">
              Your appointment is <strong>awaiting verification</strong>. Once our team verifies the payment,
              the status will move to <strong>Confirmed</strong> — usually within a few minutes.
            </p>
            <p className="text-xs text-ink-400 mt-4">Redirecting…</p>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Step 2 of 2"
        title={<>Complete <span className="text-gradient">payment.</span></>}
        subtitle="Pay the consultation fee via UPI or scan the QR code, then upload the screenshot — we'll verify and confirm your appointment shortly."
      />

      <section className="container-xl pb-20 grid lg:grid-cols-3 gap-6">
        <Reveal dir="up" className="lg:col-span-2 space-y-5">
          {/* Method picker */}
          <div className="card p-2 flex gap-1">
            {[
              { id: 'upi', label: 'Pay via UPI', icon: Smartphone },
              { id: 'qr',  label: 'Scan QR Code', icon: QrCode }
            ].map((m) => {
              const Icon = m.icon
              const active = method === m.id
              return (
                <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition ${active ? 'bg-gradient-to-r from-brand-500 to-violet-500 text-white shadow-glow' : 'text-ink-600 hover:bg-ink-50'}`}>
                  <Icon size={16} /> {m.label}
                </button>
              )
            })}
          </div>

          {/* UPI or QR panel */}
          <div className="card p-6 md:p-8">
            {method === 'upi' ? (
              <div>
                <p className="eyebrow">UPI Payment</p>
                <h3 className="font-display text-2xl font-extrabold mt-1">Pay to this UPI ID</h3>
                <div className="mt-5 rounded-2xl border-2 border-dashed border-brand-300 bg-gradient-to-br from-brand-50 via-white to-violet-50 p-5 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white flex items-center justify-center"><Smartphone /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-ink-500">UPI ID</p>
                    <p className="font-mono text-lg font-bold text-ink-900 truncate">{upiId}</p>
                  </div>
                  <button type="button" onClick={copyUpi} className="btn-outline !py-2 !px-3"><Copy size={14} /> Copy</button>
                </div>

                <a href={upiLink} className="mt-4 btn-primary w-full !py-3.5 shine">
                  <Smartphone /> Open your UPI app <ArrowUpRight />
                </a>

                <ol className="mt-6 space-y-2 text-sm text-ink-600 list-decimal pl-5">
                  <li>Open Google Pay, PhonePe, Paytm or any UPI app.</li>
                  <li>Send <strong>₹{amount.toLocaleString('en-IN')}</strong> to <span className="font-mono">{upiId}</span>.</li>
                  <li>Take a screenshot of the success page and upload it below.</li>
                </ol>
              </div>
            ) : (
              <div>
                <p className="eyebrow">QR Payment</p>
                <h3 className="font-display text-2xl font-extrabold mt-1">Scan to pay</h3>
                <div className="mt-5 flex flex-col items-center">
                  <div className="rounded-3xl bg-white border-2 border-dashed border-brand-300 p-4 shadow-soft">
                    <img
                      src={qrUrl}
                      alt="UPI QR Code"
                      className="h-72 w-72 object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <p className="mt-4 text-sm text-ink-500">Scan with any UPI app · <span className="font-mono">{upiId}</span></p>
                  <p className="font-display text-3xl font-extrabold text-ink-900 mt-2">₹{amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload screenshot */}
          <form onSubmit={submit} className="card p-6 md:p-8 space-y-5">
            <div>
              <p className="eyebrow">Step 3 — Confirm</p>
              <h3 className="font-display text-2xl font-extrabold mt-1">Upload payment screenshot</h3>
              <p className="text-sm text-ink-500 mt-1">PNG or JPG, max 2 MB. Make sure the transaction ID and amount are visible.</p>
            </div>

            <label className="block cursor-pointer">
              <div className={`relative rounded-2xl border-2 border-dashed transition overflow-hidden ${screenshot ? 'border-emerald-400 bg-emerald-50/40' : 'border-ink-200 bg-ink-50/60 hover:bg-ink-50'} p-6`}>
                {screenshot ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={screenshot} alt="Payment screenshot" className="max-h-72 rounded-xl shadow-soft" />
                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-2"><CheckCircle size={16} /> Screenshot uploaded — click to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white flex items-center justify-center"><Upload /></div>
                    <p className="font-bold text-ink-800">Click to upload screenshot</p>
                    <p className="text-xs text-ink-500">or drag & drop your image here</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onFile} />
              </div>
            </label>

            <div>
              <label className="label">Transaction reference (optional)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 text-ink-400" />
                <input
                  className="input pl-11 font-mono"
                  placeholder="e.g. 412345678901"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                />
              </div>
              <p className="text-xs text-ink-400 mt-1">Helps us verify faster. Find it in your UPI app's success screen.</p>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-amber-800">
                Your appointment status will be <strong>Pending Verification</strong> until our team confirms the payment.
                Fake screenshots will be rejected and reported.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/appointment" className="btn-outline sm:flex-1"><ArrowLeft size={16} /> Back to details</Link>
              <button type="submit" disabled={busy} className="btn-primary sm:flex-1 !py-3.5 !text-base shine disabled:opacity-50">
                {busy ? 'Submitting…' : <>Submit for verification <ArrowUpRight /></>}
              </button>
            </div>
          </form>
        </Reveal>

        {/* Summary */}
        <Reveal dir="left" delay={0.15} className="lg:col-span-1">
          <div className="space-y-4 sticky top-28">
            <div className="card p-6">
              <p className="eyebrow">Booking summary</p>
              <h3 className="font-display text-xl font-extrabold mt-1">Your visit</h3>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Patient" value={formData.patientName} />
                <Row label="Phone" value={formData.phone} />
                <Row label="Department" value={formData.department} />
                <Row label="Doctor" value={formData.doctor} />
                <Row label="Date" value={formData.date} />
                <Row label="Time" value={formData.time} />
              </dl>
              <div className="mt-5 pt-5 border-t border-ink-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-ink-600">Amount due</span>
                <span className="font-display text-3xl font-extrabold text-ink-900">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center"><ShieldCheck /></div>
              <h4 className="font-display text-lg font-extrabold mt-3">Safe & secure</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-600">
                <li className="flex gap-2"><CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} /> Manual verification by our team</li>
                <li className="flex gap-2"><CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} /> Full refund if slot unavailable</li>
                <li className="flex gap-2"><CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} /> Free reschedule up to 2 hours before</li>
              </ul>
            </div>

            <div className="card p-5 bg-gradient-to-br from-cyan-50 via-white to-violet-50 flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white text-brand-600 flex items-center justify-center shrink-0"><ImageIcon size={18} /></div>
              <div>
                <p className="text-sm font-bold text-ink-900">Tip</p>
                <p className="text-xs text-ink-500 mt-1">Crop the screenshot so the transaction ID and amount are clearly visible.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-500 text-xs uppercase tracking-wider font-semibold">{label}</dt>
      <dd className="text-ink-900 font-semibold text-sm text-right truncate max-w-[60%]">{value || '—'}</dd>
    </div>
  )
}
