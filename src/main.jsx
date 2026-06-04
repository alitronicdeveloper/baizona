// src/main.jsx
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './admin/AdminApp'
import AdminLogin from './admin/AdminLogin'

const MainApp = () => {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Get current path
  const path = window.location.pathname

  useEffect(() => {
    const savedAdmin = localStorage.getItem('baizona_admin')
    if (savedAdmin) {
      try {
        setAdminUser(JSON.parse(savedAdmin))
      } catch(e) {}
    }
    setLoading(false)
  }, [])

  // Show loading
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f0f1a', color: 'white' }}>Loading...</div>
  }

  // ADMIN LOGIN PAGE - /admin
  if (path === '/admin') {
    return <AdminLogin 
      onLogin={(user) => {
        setAdminUser(user)
        window.location.href = '/admin/dashboard'
      }} 
      onBackToHome={() => window.location.href = '/'} 
    />
  }

  // ADMIN DASHBOARD - /admin/dashboard
  if (path === '/admin/dashboard') {
    if (!adminUser) {
      window.location.href = '/admin'
      return null
    }
    return <AdminApp 
      adminUser={adminUser} 
      onLogout={() => {
        localStorage.removeItem('baizona_admin')
        setAdminUser(null)
        window.location.href = '/admin'
      }} 
    />
  }

  // USER APP - all other routes
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(<MainApp />)