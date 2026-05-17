import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Loader from './components/ui/Loader.jsx'

// Lazy-loaded routes for code splitting
const Home = lazy(() => import('./pages/public/Home.jsx'))
const About = lazy(() => import('./pages/public/About.jsx'))
const Departments = lazy(() => import('./pages/public/Departments.jsx'))
const Doctors = lazy(() => import('./pages/public/Doctors.jsx'))
const Appointment = lazy(() => import('./pages/public/Appointment.jsx'))
const Packages = lazy(() => import('./pages/public/Packages.jsx'))
const Ambulance = lazy(() => import('./pages/public/Ambulance.jsx'))
const Blog = lazy(() => import('./pages/public/Blog.jsx'))
const Gallery = lazy(() => import('./pages/public/Gallery.jsx'))
const Contact = lazy(() => import('./pages/public/Contact.jsx'))
const Login = lazy(() => import('./pages/auth/Login.jsx'))

// Patient (account) auth pages
const AccountLogin = lazy(() => import('./pages/account/Login.jsx'))
const AccountRegister = lazy(() => import('./pages/account/Register.jsx'))
const AccountDashboard = lazy(() => import('./pages/account/Dashboard.jsx'))

const Overview = lazy(() => import('./pages/admin/Overview.jsx'))
const AdminAppointments = lazy(() => import('./pages/admin/Appointments.jsx'))
const AdminPatients = lazy(() => import('./pages/admin/Patients.jsx'))
const AdminDoctors = lazy(() => import('./pages/admin/Doctors.jsx'))
const AdminDepartments = lazy(() => import('./pages/admin/Departments.jsx'))
const AdminAmbulance = lazy(() => import('./pages/admin/Ambulance.jsx'))
const AdminBlogs = lazy(() => import('./pages/admin/Blogs.jsx'))
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials.jsx'))
const AdminNotifications = lazy(() => import('./pages/admin/Notifications.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'))

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin login (kept at /login for backwards compat) */}
        <Route path="/login" element={<Login />} />

        {/* Patient auth */}
        <Route path="/account/login" element={<AccountLogin />} />
        <Route path="/account/register" element={<AccountRegister />} />

        {/* Patient dashboard (protected — requires logged-in user) */}
        <Route path="/account" element={
          <ProtectedRoute role="patient"><AccountDashboard /></ProtectedRoute>
        } />

        {/* Admin (protected — requires admin role) */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="ambulance" element={<AdminAmbulance />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
