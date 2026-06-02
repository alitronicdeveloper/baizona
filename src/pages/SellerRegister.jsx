// src/pages/SellerRegister.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export const SellerRegister = () => {
  const [form, setForm] = useState({
    shop_name: '',
    phone: '',
    whatsapp: '',
    location: '',
    address: '',
    business_registration: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase
      .from('sellers')
      .insert([form])
    
    if (error) {
      alert('Kuna tatizo: ' + error.message)
    } else {
      alert('✅ Umesajiliwa! Tutakuthibitisha ndani ya saa 24.')
      setForm({ shop_name: '', phone: '', whatsapp: '', location: '', address: '', business_registration: '' })
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h1>🏪 JIUNGE NA BAIZONA</h1>
      <p>Uza bidhaa zako kwa wafanyabiashara wote Tanzania</p>
      
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Jina la Duka *" required
          value={form.shop_name} onChange={(e) => setForm({...form, shop_name: e.target.value})} />
        <input type="tel" placeholder="Namba ya Simu *" required
          value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        <input type="tel" placeholder="Namba ya WhatsApp"
          value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} />
        <input type="text" placeholder="Mahali (Kariakoo, Dar es Salaam)"
          value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
        <textarea placeholder="Anwani kamili (Jengo, Ghorofa, Namba)"
          value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
        <input type="text" placeholder="Namba ya Usajili wa Biashara (kama una)"
          value={form.business_registration} onChange={(e) => setForm({...form, business_registration: e.target.value})} />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Inasubiri...' : '✅ Jiunge Sasa (Bure)'}
        </button>
      </form>
    </div>
  )
}