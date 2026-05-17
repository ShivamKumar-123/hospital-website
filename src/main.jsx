import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { seedAll } from './utils/seed.js'

seedAll()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Fade out and remove the HTML pre-loader once React has mounted.
window.requestAnimationFrame(() => {
  setTimeout(() => {
    const boot = document.getElementById('boot')
    if (!boot) return
    boot.classList.add('fade-out')
    setTimeout(() => boot.remove(), 500)
  }, 600)
})
