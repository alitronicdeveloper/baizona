// src/admin/AdminLogin.jsx
import { useState } from 'react'

const AdminLogin = ({ onLogin, onBackToHome }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    // SIMPLE CHECK - Badilisha password hapa ukitaka
    if (email === 'alitronicdeveloper@gmail.com' && password === 'admin123') {
      localStorage.setItem('baizona_admin', JSON.stringify({ 
        email: 'alitronicdeveloper@gmail.com',
        role: 'admin' 
      }))
      onLogin({ email: 'alitronicdeveloper@gmail.com' })
    } else {
      setError('Email au password si sahihi! Jaribu: alitronicdeveloper@gmail.com / admin123')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '70px', 
            height: '70px', 
            background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px'
          }}>👑</div>
          <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Ingia kudhibiti Baizona</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239,68,68,0.2)', 
            color: '#fecaca', 
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13px',
            textAlign: 'center'
          }}>❌ {error}</div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Barua pepe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px'
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px'
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🚀 Ingia kwenye Dashboard
          </button>
        </form>

        <button
          onClick={onBackToHome}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Rudi kwenye Tovuti
        </button>
      </div>
    </div>
  )
}

export default AdminLogin