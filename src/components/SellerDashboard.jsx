// src/pages/SellerDashboard.jsx
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function SellerDashboard({ seller, onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    min_order_quantity: 50,
    bulk_unit: 'pcs',
    wholesale_category: 'Machimbo ya Viatu',
    variants: []
  })
  const [variants, setVariants] = useState([])
  const [newVariant, setNewVariant] = useState({ type: 'color', name: 'Rangi', options: '' })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const addVariant = () => {
    if (newVariant.options.trim()) {
      setVariants([...variants, {
        type: newVariant.type,
        name: newVariant.name,
        options: newVariant.options.split(',').map(o => o.trim())
      }])
      setNewVariant({ type: 'color', name: 'Rangi', options: '' })
    }
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...newProduct,
        price: parseFloat(newProduct.price),
        seller_id: seller.id,
        shop: seller.shop_name,
        variants: variants,
        status: 'active'
      }])
    
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Bidhaa imeongezwa!')
      setNewProduct({
        name: '',
        price: '',
        description: '',
        min_order_quantity: 50,
        bulk_unit: 'pcs',
        wholesale_category: 'Machimbo ya Viatu',
        variants: []
      })
      setVariants([])
      setShowAddForm(false)
      fetchProducts()
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm('Futa bidhaa hii?')) {
      await supabase.from('products').delete().eq('id', productId)
      fetchProducts()
    }
  }

  const categories = [
    'Machimbo ya Viatu',
    'Machimbo ya Nguo',
    'Machimbo ya Stationary',
    'Machimbo ya Vyakula',
    'Machimbo ya Vitu vya Dukani',
    'Machimbo ya Vyombo',
    'Machimbo ya Accessories'
  ]

  const bulkUnits = ['pcs', 'dozen', 'kg', 'pair', 'meter']

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: '#f59e0b', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>🏪 {seller.shop_name}</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#fef3c7' }}>📧 {seller.email} | 📞 {seller.phone}</p>
        </div>
        <button
          onClick={onLogout}
          style={{ padding: '8px 16px', background: 'white', color: '#f59e0b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🚪 Ondoka
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('products'); setShowAddForm(false) }}
            style={{
              padding: '10px 20px',
              background: activeTab === 'products' ? '#f59e0b' : 'white',
              color: activeTab === 'products' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📋 Bidhaa Zangu ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('add'); setShowAddForm(true) }}
            style={{
              padding: '10px 20px',
              background: activeTab === 'add' ? '#10b981' : 'white',
              color: activeTab === 'add' ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            ➕ Ongeza Bidhaa
          </button>
        </div>

        {/* Add Product Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddProduct} style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
            <h3>➕ Ongeza Bidhaa Mpya</h3>
            
            <input
              type="text"
              placeholder="Jina la Bidhaa *"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            
            <input
              type="number"
              placeholder="Bei kwa kipande (Tsh) *"
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            
            <textarea
              placeholder="Maelezo ya Bidhaa"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }}
            />
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input
                type="number"
                placeholder="Kiwango cha chini (MOQ)"
                value={newProduct.min_order_quantity}
                onChange={(e) => setNewProduct({...newProduct, min_order_quantity: parseInt(e.target.value)})}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <select
                value={newProduct.bulk_unit}
                onChange={(e) => setNewProduct({...newProduct, bulk_unit: e.target.value})}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                {bulkUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            
            <select
              value={newProduct.wholesale_category}
              onChange={(e) => setNewProduct({...newProduct, wholesale_category: e.target.value})}
              style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            {/* Variants */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🎨 Variants (Rangi, Ukubwa)</label>
              
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
                  <span><strong>{v.name}:</strong> {v.options.join(', ')}</span>
                  <button type="button" onClick={() => removeVariant(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <select
                  value={newVariant.type}
                  onChange={(e) => setNewVariant({...newVariant, type: e.target.value})}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option value="color">Rangi</option>
                  <option value="size">Ukubwa</option>
                </select>
                <input
                  type="text"
                  placeholder="Chaguzi (Nyeusi,Nyekundu,Nyeupe)"
                  value={newVariant.options}
                  onChange={(e) => setNewVariant({...newVariant, options: e.target.value})}
                  style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <button type="button" onClick={addVariant} style={{ padding: '10px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>➕</button>
              </div>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              ✅ Weka Bidhaa
            </button>
          </form>
        )}

        {/* Products List */}
        {activeTab === 'products' && (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
                <p>Huna bidhaa bado. Bonyeza "Ongeza Bidhaa" kuanza!</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', padding: '16px', gap: '16px', flexWrap: 'wrap' }}>
                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px' }}>{product.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Tsh {product.price.toLocaleString()} / {product.bulk_unit}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#f59e0b' }}>MOQ: {product.min_order_quantity} {product.bulk_unit}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#10b981', color: 'white' }}>Active</span>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}