// src/pages/SellerAuth.jsx
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function SellerAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    email: '',
    password: '',
    shop_name: '',
    phone: '',
    whatsapp: '',
    location: 'Kariakoo, Dar es Salaam',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (isLogin) {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('email', form.email)
        .eq('password', form.password)
        .single()
      
      if (error || !data) {
        setError('Email au password si sahihi!')
      } else {
        localStorage.setItem('baizona_seller', JSON.stringify(data))
        onLogin(data)
      }
    } else {
      const { data, error } = await supabase
        .from('sellers')
        .insert([{
          email: form.email,
          password: form.password,
          shop_name: form.shop_name,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          location: form.location,
          address: form.address
        }])
        .select()
        .single()
      
      if (error) {
        setError(error.message)
      } else {
        localStorage.setItem('baizona_seller', JSON.stringify(data))
        onLogin(data)
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '50px' }}>🏪</div>
        <h1>{isLogin ? 'Ingia Dukani' : 'Jiunge na Baizona'}</h1>
        <p style={{ color: '#64748b' }}>
          {isLogin ? 'Ingia kuuza bidhaa zako' : 'Uza bidhaa zako kwa wafanyabiashara wote Tanzania'}
        </p>
      </div>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Jina la Duka *"
              required
              value={form.shop_name}
              onChange={(e) => setForm({...form, shop_name: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <input
              type="tel"
              placeholder="Simu (WhatsApp) *"
              required
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <input
              type="tel"
              placeholder="WhatsApp (kama tofauti)"
              value={form.whatsapp}
              onChange={(e) => setForm({...form, whatsapp: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <input
              type="text"
              placeholder="Mahali (Kariakoo, Dar es Salaam)"
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <textarea
              placeholder="Anwani kamili (Jengo, Ghorofa, Namba)"
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }}
            />
          </>
        )}
        
        <input
          type="email"
          placeholder="Barua pepe *"
          required
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        
        <input
          type="password"
          placeholder="Password *"
          required
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Inasubiri...' : (isLogin ? '🚀 Ingia' : '✅ Jiunge Sasa (Bure)')}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => { setIsLogin(!isLogin); setError('') }}
          style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}
        >
          {isLogin ? 'Huna akaunti? Jiunge Sasa' : 'Tayari una akaunti? Ingia'}
        </button>
      </p>
    </div>
  )
}