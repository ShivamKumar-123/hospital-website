import { getData, saveData } from './storage.js'

const KEYS = {
  patients: 'patients',
  doctors: 'doctors',
  departments: 'departments',
  appointments: 'appointments',
  ambulance: 'ambulance',
  blogs: 'blogs',
  testimonials: 'testimonials',
  notifications: 'notifications',
  settings: 'settings',
  users: 'users'
}

// Read VITE_-prefixed env vars at build time. Fallbacks make the app work
// even if .env is missing (e.g. in the Node test harness).
const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {}
export const CREDS = {
  admin: {
    name:     ENV.VITE_ADMIN_NAME      || 'Hospital Admin',
    email:    ENV.VITE_ADMIN_EMAIL     || 'admin@hospital.com',
    password: ENV.VITE_ADMIN_PASSWORD  || 'admin123'
  },
  demoUser: {
    name:     ENV.VITE_DEMO_USER_NAME     || 'Demo Patient',
    email:    ENV.VITE_DEMO_USER_EMAIL    || 'patient@hospital.com',
    password: ENV.VITE_DEMO_USER_PASSWORD || 'patient123',
    phone:    ENV.VITE_DEMO_USER_PHONE    || '+1 555 0100'
  },
  hospital: {
    name:      ENV.VITE_HOSPITAL_NAME    || 'SAUBHAGYAM HOSPITAL',
    emergency: ENV.VITE_EMERGENCY_PHONE  || '+91 87002 98596'
  }
}

const seedIfEmpty = (key, data) => {
  if (!getData(key, null)) saveData(key, data)
}

export const seedAll = () => {
  // Users — always ensure the env-defined admin + demo patient exist (merge, don't overwrite).
  const SEED_USERS = [
    {
      id: 'u-admin',
      name: CREDS.admin.name,
      email: CREDS.admin.email,
      password: CREDS.admin.password,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u-demo',
      name: CREDS.demoUser.name,
      email: CREDS.demoUser.email,
      phone: CREDS.demoUser.phone,
      password: CREDS.demoUser.password,
      role: 'patient',
      createdAt: new Date().toISOString()
    }
  ]
  const existingUsers = getData(KEYS.users, [])
  const mergedUsers = [...existingUsers]
  SEED_USERS.forEach((seed) => {
    const i = mergedUsers.findIndex((u) => u.email?.toLowerCase() === seed.email.toLowerCase())
    if (i === -1) {
      mergedUsers.push(seed)                       // missing → add
    } else {
      // existing → refresh password/role from env (in case .env was changed),
      // but preserve any custom fields the user may have edited.
      mergedUsers[i] = { ...mergedUsers[i], password: seed.password, role: seed.role }
    }
  })
  saveData(KEYS.users, mergedUsers)

  seedIfEmpty(KEYS.settings, {
    hospitalName: CREDS.hospital.name,
    tagline: 'Compassionate Care, Advanced Technology — 24×7.',
    logo: '',
    address: 'NH 43, Surajpur, Chandarpur, Chhattisgarh 497229',
    phone: '+91 87002 98596',
    emergency: CREDS.hospital.emergency,
    email: 'contact@saubhagyamhospital.com',
    hours: 'Open 24/7 — Emergency & ICU',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    themePrimary: '#0891b2',
    upiId: 'saubhagyam@upi',
    consultationFee: 500
  })

  seedIfEmpty(KEYS.departments, [
    { id: 'd1', name: 'Cardiology', description: 'Comprehensive heart care with advanced cath labs and 24/7 cardiac ICU.', icon: 'heart', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', doctors: 6, availability: '24/7' },
    { id: 'd2', name: 'Neurology', description: 'Brain, spine and nervous-system care from leading neurosurgeons.', icon: 'brain', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', doctors: 4, availability: 'Mon–Sat' },
    { id: 'd3', name: 'Orthopedics', description: 'Joint replacement, sports injury and trauma specialists.', icon: 'bone', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800', doctors: 5, availability: 'Mon–Sun' },
    { id: 'd4', name: 'Pediatrics', description: 'Child-friendly care from newborns through teenage years.', icon: 'baby', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800', doctors: 7, availability: '24/7' },
    { id: 'd5', name: 'Gynecology', description: 'Womens health, maternity and reproductive medicine.', icon: 'female', image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?w=800', doctors: 5, availability: 'Mon–Sat' },
    { id: 'd6', name: 'Radiology', description: '3T MRI, CT, ultrasound and digital X-ray with rapid reporting.', icon: 'scan', image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800', doctors: 3, availability: '24/7' },
    { id: 'd7', name: 'ICU', description: 'Critical care unit with ventilators, dialysis and round-the-clock intensivists.', icon: 'monitor', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800', doctors: 8, availability: '24/7' },
    { id: 'd8', name: 'Emergency Care', description: 'Trauma center with golden-hour protocols and helipad access.', icon: 'alert', image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800', doctors: 10, availability: '24/7' },
    { id: 'd9', name: 'General Medicine', description: 'Primary care, diagnostics and preventive medicine for all ages.', icon: 'stethoscope', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800', doctors: 12, availability: 'Mon–Sun' },
    { id: 'd10', name: 'Surgery', description: 'Minimally invasive and robotic surgery across specialties.', icon: 'scissors', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800', doctors: 9, availability: 'Mon–Sat' }
  ])

  seedIfEmpty(KEYS.doctors, [
    { id: 'doc1', name: 'Dr. Aarav Mehta', department: 'Cardiology', qualification: 'MD, DM Cardiology', experience: 18, availability: 'Mon–Fri', status: 'Available', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc2', name: 'Dr. Priya Nair', department: 'Neurology', qualification: 'MD, DM Neurology', experience: 14, availability: 'Tue–Sat', status: 'Available', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc3', name: 'Dr. Marcus Chen', department: 'Orthopedics', qualification: 'MS Ortho, Fellowship Joints', experience: 12, availability: 'Mon–Sat', status: 'Available', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc4', name: 'Dr. Sofia Rossi', department: 'Pediatrics', qualification: 'MD Pediatrics, IAP Fellow', experience: 9, availability: 'Mon–Fri', status: 'On Leave', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc5', name: 'Dr. Olivia Park', department: 'Gynecology', qualification: 'MD Obs/Gyn', experience: 16, availability: 'Mon–Sat', status: 'Available', photo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc6', name: 'Dr. Ethan Hughes', department: 'Radiology', qualification: 'MD Radiodiagnosis', experience: 11, availability: 'Mon–Fri', status: 'Available', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc7', name: 'Dr. Hannah Wells', department: 'ICU', qualification: 'MD Anesthesia, FCCM', experience: 13, availability: '24/7 Rotation', status: 'Available', photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc8', name: 'Dr. Daniel Wu', department: 'Emergency Care', qualification: 'MD Emergency Med', experience: 10, availability: '24/7 Rotation', status: 'Available', photo: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc9', name: 'Dr. Layla Rahman', department: 'General Medicine', qualification: 'MD Internal Medicine', experience: 8, availability: 'Mon–Sun', status: 'Available', photo: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400', social: { tw: '#', li: '#' } },
    { id: 'doc10', name: 'Dr. Noah Kapoor', department: 'Surgery', qualification: 'MS, FRCS', experience: 20, availability: 'Mon–Sat', status: 'Available', photo: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400', social: { tw: '#', li: '#' } }
  ])

  seedIfEmpty(KEYS.patients, [
    { id: 'p1', name: 'Ravi Sharma', age: 42, gender: 'Male', phone: '+1 555 0101', email: 'ravi@example.com', address: '12 Oak St', bloodGroup: 'O+', condition: 'Hypertension', photo: '', history: 'Routine BP monitoring since 2022.' },
    { id: 'p2', name: 'Emily Brooks', age: 29, gender: 'Female', phone: '+1 555 0102', email: 'emily@example.com', address: '98 Pine St', bloodGroup: 'A+', condition: 'Pregnancy', photo: '', history: 'First trimester check-ups, low-risk.' },
    { id: 'p3', name: 'Liam Walker', age: 7, gender: 'Male', phone: '+1 555 0103', email: 'walker@example.com', address: '45 Elm Ave', bloodGroup: 'B+', condition: 'Asthma', photo: '', history: 'Inhaler on demand, no recent attacks.' },
    { id: 'p4', name: 'Sara Khan', age: 65, gender: 'Female', phone: '+1 555 0104', email: 'sara@example.com', address: '17 Maple Rd', bloodGroup: 'AB+', condition: 'Diabetes', photo: '', history: 'Type-2 diabetes, on Metformin.' }
  ])

  seedIfEmpty(KEYS.appointments, [
    { id: 'a1', patientName: 'Ravi Sharma', phone: '+1 555 0101', department: 'Cardiology', doctor: 'Dr. Aarav Mehta', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), time: '10:30', symptoms: 'Chest tightness on exertion', status: 'Approved', paymentStatus: 'Verified', paymentMethod: 'UPI', paymentAmount: 500 },
    { id: 'a2', patientName: 'Emily Brooks', phone: '+1 555 0102', department: 'Gynecology', doctor: 'Dr. Olivia Park', date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), time: '14:00', symptoms: 'Routine checkup', status: 'Pending', paymentStatus: 'Verified', paymentMethod: 'UPI', paymentAmount: 500 },
    { id: 'a3', patientName: 'Liam Walker', phone: '+1 555 0103', department: 'Pediatrics', doctor: 'Dr. Sofia Rossi', date: new Date().toISOString().slice(0, 10), time: '09:00', symptoms: 'Cough and mild fever', status: 'Completed', paymentStatus: 'Verified', paymentMethod: 'QR Code', paymentAmount: 500 }
  ])

  seedIfEmpty(KEYS.ambulance, [
    { id: 'am1', requester: 'John Doe', phone: '+1 555 9001', pickup: '52 Birch Lane', destination: 'MediCare+ ER', condition: 'Road accident', status: 'Dispatched', driver: 'Mark Tanner', vehicle: 'AMB-204', createdAt: new Date().toISOString() }
  ])

  seedIfEmpty(KEYS.blogs, [
    { id: 'b1', title: '5 Habits for a Healthier Heart', category: 'Cardiology', author: 'Dr. Aarav Mehta', thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800', excerpt: 'Simple daily habits that significantly reduce your cardiovascular risk.', content: 'A balanced diet, 30-minute daily walks, no smoking, regular check-ups and good sleep are the cornerstones of heart health.', createdAt: new Date().toISOString() },
    { id: 'b2', title: 'Understanding Childhood Asthma', category: 'Pediatrics', author: 'Dr. Sofia Rossi', thumbnail: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800', excerpt: 'How to recognize triggers and act fast when your child has an attack.', content: 'Identify triggers, keep rescue inhalers handy, and create an asthma action plan with your pediatrician.', createdAt: new Date().toISOString() },
    { id: 'b3', title: 'When Back Pain Needs a Specialist', category: 'Orthopedics', author: 'Dr. Marcus Chen', thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800', excerpt: 'Red flags to look for and modern treatment options.', content: 'Persistent back pain with numbness or weakness needs imaging and a specialist consult immediately.', createdAt: new Date().toISOString() }
  ])

  seedIfEmpty(KEYS.testimonials, [
    { id: 't1', name: 'Anita Verma', role: 'Patient', rating: 5, message: 'Outstanding care during my cardiac procedure. The team was empathetic and professional.', approved: true, photo: 'https://i.pravatar.cc/100?img=12' },
    { id: 't2', name: 'James Connor', role: 'Patient family', rating: 5, message: 'The pediatric team treated my son like family. Fast, kind and thorough.', approved: true, photo: 'https://i.pravatar.cc/100?img=33' },
    { id: 't3', name: 'Sandra Lee', role: 'Patient', rating: 4, message: 'Modern facility, transparent billing and excellent post-op support.', approved: true, photo: 'https://i.pravatar.cc/100?img=47' }
  ])

  seedIfEmpty(KEYS.notifications, [
    { id: 'n1', title: 'New emergency case', message: 'Trauma case incoming via ambulance AMB-204', type: 'emergency', read: false, createdAt: new Date().toISOString() },
    { id: 'n2', title: 'Appointment pending', message: 'Emily Brooks awaits approval for Gynecology', type: 'appointment', read: false, createdAt: new Date().toISOString() },
    { id: 'n3', title: 'New patient registered', message: 'Sara Khan was added to the patient registry', type: 'patient', read: true, createdAt: new Date().toISOString() }
  ])
}

export const STORAGE_KEYS = KEYS
