// src/App.jsx - BAIZONA MACHIMBO COMPLETE FIXED
import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { useCartStore } from './stores/cartStore'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const categories = [
  "Machimbo Yote",
  "Machimbo ya Viatu",
  "Machimbo ya Nguo",
  "Machimbo ya Stationary",
  "Machimbo ya Vyakula",
  "Machimbo ya Vitu vya Dukani",
  "Machimbo ya Vyombo",
  "Machimbo ya Accessories"
]

const colorMap = {
  'Nyeusi': '#1e293b', 'Nyekundu': '#ef4444', 'Nyeupe': '#f8fafc',
  'Bluu': '#3b82f6', 'Kijani': '#10b981', 'Manjano': '#f59e0b',
  'Zambarau': '#8b5cf6', 'Pink': '#ec4899', 'Kahawia': '#78350f'
}

const SellerDashboard = ({ seller, onLogout, onBackToHome }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', min_order_quantity: 50, bulk_unit: 'pcs',
    wholesale_category: 'Machimbo ya Viatu'
  })
  const [productImages, setProductImages] = useState([])
  const [productImagesPreview, setProductImagesPreview] = useState([])
  const [variants, setVariants] = useState([])
  const [newVariant, setNewVariant] = useState({ type: 'color', name: 'Rangi', options: '' })

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('seller_id', seller.id).order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setProductImages(files)
    setProductImagesPreview(files.map(f => URL.createObjectURL(f)))
  }

  const addVariant = () => {
    if (newVariant.options.trim()) {
      setVariants([...variants, { type: newVariant.type, name: newVariant.name, options: newVariant.options.split(',').map(o => o.trim()) }])
      setNewVariant({ type: 'color', name: 'Rangi', options: '' })
    }
  }

  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index))

  const uploadImages = async () => {
    const uploaded = []
    for (const file of productImages) {
      const fileName = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('products-images').upload(fileName, file)
      if (!error) {
        const { data: u } = supabase.storage.from('products-images').getPublicUrl(fileName)
        uploaded.push(u.publicUrl)
      }
    }
    return uploaded
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) { alert("Jaza jina na bei!"); return }
    
    const uploadedImages = productImages.length > 0 ? await uploadImages() : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500']
    
    const { error } = await supabase.from('products').insert([{
      ...newProduct,
      price: parseFloat(newProduct.price),
      seller_id: seller.id,
      shop: seller.shop_name,
      images: uploadedImages,
      variants: variants,
      status: 'active'
    }])
    
    if (error) alert('Error: ' + error.message)
    else {
      alert('✅ Bidhaa imeongezwa!')
      setNewProduct({ name: '', price: '', description: '', min_order_quantity: 50, bulk_unit: 'pcs', wholesale_category: 'Machimbo ya Viatu' })
      setProductImages([]); setProductImagesPreview([]); setVariants([])
      fetchProducts(); setActiveTab('products')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm('Futa bidhaa hii?')) {
      await supabase.from('products').delete().eq('id', productId)
      fetchProducts()
    }
  }

  const bulkUnits = ['pcs', 'dozen', 'kg', 'pair', 'meter']
  const wholesaleCategories = ['Machimbo ya Viatu', 'Machimbo ya Nguo', 'Machimbo ya Stationary', 'Machimbo ya Vyakula', 'Machimbo ya Vitu vya Dukani', 'Machimbo ya Vyombo', 'Machimbo ya Accessories']

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={onBackToHome} style={{ background: 'white', color: '#f59e0b', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>← Rudi</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>B</div>
              <div><div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Baizona.com</div><div style={{ fontSize: '9px', color: '#fef3c7' }}>chimbo la machimbo</div></div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{seller.shop_name}</div>
            <div style={{ fontSize: '11px', color: '#fef3c7' }}>📧 {seller.email} | 📞 {seller.phone}</div>
            <button onClick={onLogout} style={{ marginTop: '6px', padding: '6px 12px', background: 'white', color: '#f59e0b', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🚪 Ondoka</button>
          </div>
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => alert('Kikapu kinapatikana kwenye ukurasa wa nyumbani. Bonyeza "Rudi Nyumbani" kuona kikapu chako.')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🛒 Kikapu Changu</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => { setActiveTab('products'); fetchProducts() }} style={{ padding: '10px 20px', background: activeTab === 'products' ? '#f59e0b' : 'white', color: activeTab === 'products' ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>📋 Bidhaa Zangu ({products.length})</button>
          <button onClick={() => setActiveTab('add')} style={{ padding: '10px 20px', background: activeTab === 'add' ? '#10b981' : 'white', color: activeTab === 'add' ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer' }}>➕ Ongeza Bidhaa</button>
        </div>

        {activeTab === 'add' && (
          <form onSubmit={handleAddProduct} style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
            <h3>➕ Ongeza Bidhaa Mpya</h3>
            <input type="text" placeholder="Jina la Bidhaa *" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <input type="number" placeholder="Bei kwa kipande (Tsh) *" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <textarea placeholder="Maelezo ya Bidhaa" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }} />
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input type="number" placeholder="Kiwango cha chini (MOQ)" value={newProduct.min_order_quantity} onChange={(e) => setNewProduct({...newProduct, min_order_quantity: parseInt(e.target.value)})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <select value={newProduct.bulk_unit} onChange={(e) => setNewProduct({...newProduct, bulk_unit: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{bulkUnits.map(u => <option key={u} value={u}>{u}</option>)}</select>
            </div>
            
            <select value={newProduct.wholesale_category} onChange={(e) => setNewProduct({...newProduct, wholesale_category: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{wholesaleCategories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📸 Picha za Bidhaa (Unaweza kuchagua nyingi)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              {productImagesPreview.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {productImagesPreview.map((preview, idx) => <img key={idx} src={preview} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />)}
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🎨 Variants (Rangi, Ukubwa)</label>
              {variants.map((v, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
                  <span><strong>{v.name}:</strong> {v.options.join(', ')}</span>
                  <button type="button" onClick={() => removeVariant(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <select value={newVariant.type} onChange={(e) => setNewVariant({...newVariant, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}><option value="color">Rangi</option><option value="size">Ukubwa</option></select>
                <input type="text" placeholder="Chaguzi (Nyeusi,Nyekundu,Nyeupe)" value={newVariant.options} onChange={(e) => setNewVariant({...newVariant, options: e.target.value})} style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <button type="button" onClick={addVariant} style={{ padding: '10px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>➕</button>
              </div>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✅ Weka Bidhaa</button>
          </form>
        )}

        {activeTab === 'products' && (
          <div>
            {loading ? <p>Loading...</p> : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}><p>Huna bidhaa bado. Bonyeza "Ongeza Bidhaa" kuanza!</p></div>
            ) : (
              products.map(product => (
                <div key={product.id} style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', padding: '16px', gap: '16px', flexWrap: 'wrap' }}>
                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <h4>{product.name}</h4>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>Tsh {product.price.toLocaleString()} / {product.bulk_unit}</p>
                      <p style={{ fontSize: '11px', color: '#f59e0b' }}>MOQ: {product.min_order_quantity} {product.bulk_unit}</p>
                    </div>
                    <div><span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#10b981', color: 'white' }}>Active</span></div>
                    <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
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

const SellerAuth = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', shop_name: '', phone: '', location: 'Kariakoo, Dar es Salaam' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    if (isLogin) {
      const { data, error } = await supabase.from('sellers').select('*').eq('email', form.email).eq('password', form.password).single()
      if (error || !data) setError('Email au password si sahihi!')
      else { localStorage.setItem('baizona_seller', JSON.stringify(data)); onLogin(data) }
    } else {
      const { data, error } = await supabase.from('sellers').insert([{ email: form.email, password: form.password, shop_name: form.shop_name, phone: form.phone, location: form.location }]).select().single()
      if (error) setError(error.message)
      else { localStorage.setItem('baizona_seller', JSON.stringify(data)); onLogin(data) }
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}><div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white', margin: '0 auto' }}>🏪</div><h1>{isLogin ? 'Ingia Dukani' : 'Jiunge na Baizona'}</h1></div>
      {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>❌ {error}</div>}
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
        {!isLogin && (
          <>
            <input type="text" placeholder="Jina la Duka *" required value={form.shop_name} onChange={(e) => setForm({...form, shop_name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <input type="tel" placeholder="Simu (WhatsApp) *" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <input type="text" placeholder="Mahali" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </>
        )}
        <input type="email" placeholder="Barua pepe *" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <input type="password" placeholder="Password *" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Inasubiri...' : (isLogin ? '🚀 Ingia' : '✅ Jiunge')}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}><button onClick={() => { setIsLogin(!isLogin); setError('') }} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}>{isLogin ? 'Huna akaunti? Jiunge Sasa' : 'Tayari una akaunti? Ingia'}</button><br /><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '10px' }}>🔙 Rudi</button></p>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("Machimbo Yote")
  const [searchQuery, setSearchQuery] = useState("")
  const [shopSearchQuery, setShopSearchQuery] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [quantities, setQuantities] = useState({})
  const [selectedVariants, setSelectedVariants] = useState({})
  const [showSellerAuth, setShowSellerAuth] = useState(false)
  const [page, setPage] = useState("home")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getGroupedBySeller } = useCartStore()
  
  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem('baizona_seller')
    if (saved) {
      try { return JSON.parse(saved) }
      catch(e) { return null }
    }
    return null
  })

  const handleSellerLogout = () => { localStorage.removeItem('baizona_seller'); setSeller(null); setShowSellerAuth(false) }
  const handleSellerLogin = (data) => { localStorage.setItem('baizona_seller', JSON.stringify(data)); setSeller(data); setShowSellerAuth(false) }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*')
      if (selectedCategory !== "Machimbo Yote") {
        query = query.eq('wholesale_category', selectedCategory)
      }
      const { data: productsData } = await query.order('id', { ascending: false }).limit(100)
      if (productsData) setProducts(productsData)
      
      const { data: shopsData } = await supabase.from('shops').select('*')
      if (shopsData) setShops(shopsData)
      setLoading(false)
    }
    fetchData()
  }, [selectedCategory])

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.shop?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredShops = shops.filter(shop => 
    shop.name?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
    shop.location?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
    shop.category?.toLowerCase().includes(shopSearchQuery.toLowerCase())
  )

  const shopProducts = products.filter(p => p.shop === selectedShop?.name)

  const getShop = (shopName) => shops.find(s => s.name === shopName) || { phone: "255700000000", name: shopName, location: "Kariakoo, Dar es Salaam" }
  const setQuantity = (productId, quantity) => setQuantities(prev => ({ ...prev, [productId]: Math.max(1, quantity) }))
  const getQuantity = (productId) => quantities[productId] || 1
  const setVariant = (productId, variantType, value) => setSelectedVariants(prev => ({ ...prev, [productId]: { ...prev[productId], [variantType]: value } }))
  const getVariant = (productId, variantType) => selectedVariants[productId]?.[variantType] || ""

  const showToast = (message) => {
    const toast = document.createElement('div')
    toast.innerHTML = `<div style="position:fixed;top:80px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:12px;z-index:9999;animation:slideIn 0.3s ease;">${message}</div>`
    document.body.appendChild(toast); setTimeout(() => toast.remove(), 3000)
  }

  if (seller) {
    return <SellerDashboard seller={seller} onLogout={handleSellerLogout} onBackToHome={() => {
      localStorage.removeItem('baizona_seller')
      setSeller(null)
      setPage('home')
      setShowCart(false)
    }} />
  }

  if (showSellerAuth) {
    return <SellerAuth onLogin={handleSellerLogin} onBack={() => setShowSellerAuth(false)} />
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{ textAlign: 'center' }}><div style={{ fontSize: '50px', marginBottom: '10px' }}>🏪</div><p>Loading Baizona...</p></div></div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* GOLD HEADER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '12px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderBottom: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
          <div onClick={() => { setPage('home'); setShowCart(false) }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '45px', height: '45px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>B</div>
            <div><div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>Baizona.com</div><div style={{ fontSize: '10px', color: '#fef3c7' }}>chimbo la machimbo</div></div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => setShowSellerAuth(true)} style={{ background: 'white', color: '#f59e0b', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🏪 Kuuza</button>
            <button onClick={() => { setPage('home'); setShowCart(false) }} style={{ background: 'transparent', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>🏠 Nyumbani</button>
            <button onClick={() => { setPage('shops'); setShowCart(false) }} style={{ background: 'transparent', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>🏪 Machimbo</button>
            <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: 'transparent', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', color: 'white' }}>
              🛒 Kikapu
              {getTotalItems() > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '10px', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getTotalItems()}</span>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* PRIORITY: CART PAGE - INAANGALIWA KWANZA */}
        {showCart ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>🛒 Kikapu Changu</h2>
              <button onClick={() => setShowCart(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>← Rudi Kununua</button>
            </div>
            
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
                <div style={{ fontSize: '50px', marginBottom: '16px' }}>🛒</div>
                <p style={{ marginBottom: '16px', color: '#64748b' }}>Kikapu chako ni tupu.</p>
                <button onClick={() => setShowCart(false)} style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Endelea Kununua</button>
              </div>
            ) : (
              <>
                {Object.entries(getGroupedBySeller()).map(([sellerId, { sellerName, sellerPhone, items: sellerItems }]) => {
                  const sellerTotal = sellerItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                  return (
                    <div key={sellerId} style={{ background: 'white', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div><span style={{ fontSize: '18px', fontWeight: 'bold' }}>🏪 {sellerName}</span><span style={{ fontSize: '11px', marginLeft: '12px', opacity: 0.9 }}>📞 {sellerPhone || 'Namba haijajazwa'}</span></div>
                          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px' }}>{sellerItems.length} bidhaa</span>
                        </div>
                      </div>
                      
                      {sellerItems.map(item => (
                        <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 2, minWidth: '180px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px', background: '#f8fafc' }} />
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{item.name}</div>
                              {item.variantDisplay && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.variantDisplay}</div>}
                              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>Tsh {item.price.toLocaleString()} / {item.unit || 'pcs'}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fef2f2', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>-</button>
                              <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', color: '#1e293b' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ecfdf5', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>+</button>
                            </div>
                            
                            <div style={{ minWidth: '100px', textAlign: 'right' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1e293b' }}>Tsh {(item.price * item.quantity).toLocaleString()}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8' }}>bei kwa kipande: Tsh {item.price.toLocaleString()}</div>
                            </div>
                            
                            <button onClick={() => removeItem(item.id, item.variant)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '18px', padding: '5px 10px' }}>🗑️</button>
                          </div>
                        </div>
                      ))}
                      
                      <div style={{ padding: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div><span style={{ fontSize: '13px', color: '#64748b' }}>Jumla ya bidhaa: </span><strong style={{ fontSize: '18px', color: '#f59e0b' }}>Tsh {sellerTotal.toLocaleString()}</strong></div>
                        <button onClick={() => { const itemList = sellerItems.map(i => `${i.name}${i.variantDisplay ? ` (${i.variantDisplay})` : ''} x${i.quantity} = Tsh ${(i.price * i.quantity).toLocaleString()}`).join('\n'); const msg = `🏪 *AGIZO KUTOKA BAIZONA*\n\n📦 Duka: ${sellerName}\n\n*BIDHAA:*\n${itemList}\n\n💰 *JUMLA:* Tsh ${sellerTotal.toLocaleString()}\n\n👤 *JINA:* [Jina lako]\n📍 *ANWANI:* [Weka anwani]\n📱 *SIMU:* [Namba yako]\n\nAsante!`; window.open(`https://wa.me/${sellerPhone || '255700000000'}?text=${encodeURIComponent(msg)}`, '_blank') }} style={{ padding: '12px 24px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>📱 Agiza Kwa WhatsApp</button>
                      </div>
                    </div>
                  )
                })}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ background: 'white', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><span style={{ fontSize: '14px', color: '#64748b' }}>Jumla Kuu: </span><strong style={{ fontSize: '20px', color: '#f59e0b' }}>Tsh {items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}</strong></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => clearCart()} style={{ padding: '10px 20px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Futa Kikapu</button>
                    <button onClick={() => setShowCart(false)} style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Endelea Kununua</button>
                  </div>
                </div>
                
                <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, #eef2ff, #f3e8ff)', padding: '20px', borderRadius: '16px', border: '2px solid #f59e0b', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚚</div>
                  <h3 style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>Baizona Delivery</h3>
                  <p style={{ color: '#475569', fontSize: '13px', marginBottom: '12px' }}>Una bidhaa kutoka machimbo tofauti? Baizona itakusanyia bidhaa zako zote na kukuletea moja kwa moja!</p>
                  <button onClick={() => { const allItems = items.map(i => `${i.name}${i.variantDisplay ? ` (${i.variantDisplay})` : ''} x${i.quantity} = Tsh ${(i.price * i.quantity).toLocaleString()}`).join('\n'); const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0); const msg = `🚚 *AGIZO LA BAIZONA DELIVERY*\n\n*BIDHAA ZOTE:*\n${allItems}\n\n💰 *JUMLA:* Tsh ${total.toLocaleString()}\n\n👤 *JINA:* [Jina lako]\n📍 *ANWANI:* [Weka anwani]\n📱 *SIMU:* [Namba yako]\n\nAsante!`; window.open(`https://wa.me/255698656019?text=${encodeURIComponent(msg)}`, '_blank') }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>🚚 Agiza Kupitia Baizona Delivery</button>
                </div>
              </>
            )}
          </div>
        ) : page === 'productDetails' && selectedProduct && selectedShop ? (
          /* PRODUCT DETAILS PAGE */
          <div>
            <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>← Rudi kwenye Machimbo</button>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                <div>
                  <img src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.images?.[0] || selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#f8fafc', borderRadius: '12px' }} />
                  {selectedProduct.images?.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
                      {selectedProduct.images.map((img, idx) => <img key={idx} src={img} onClick={() => setSelectedImageIndex(idx)} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: selectedImageIndex === idx ? '2px solid #f59e0b' : '1px solid #e2e8f0', cursor: 'pointer' }} />)}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>🏪 {selectedShop.name}</div>
                  <h1 style={{ fontSize: '24px' }}>{selectedProduct.name}</h1>
                  <div><span style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>Tsh {selectedProduct.price?.toLocaleString()}</span><span style={{ fontSize: '14px', color: '#64748b' }}> / {selectedProduct.bulk_unit || 'pcs'}</span></div>
                  
                  {selectedProduct.min_order_quantity > 1 && <div style={{ background: '#fef3c7', padding: '8px 12px', borderRadius: '8px', margin: '16px 0' }}>⚡ Kiwango cha chini: {selectedProduct.min_order_quantity} {selectedProduct.bulk_unit}</div>}
                  
                  {selectedProduct.variants?.map(variant => (
                    <div key={variant.type} style={{ marginBottom: '16px' }}>
                      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🎨 {variant.name}:</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {variant.options.map(option => (
                          <button key={option} onClick={() => setVariant(selectedProduct.id, variant.type, option)} style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid', borderColor: getVariant(selectedProduct.id, variant.type) === option ? '#f59e0b' : '#e2e8f0', background: getVariant(selectedProduct.id, variant.type) === option ? '#fef3c7' : 'white', color: getVariant(selectedProduct.id, variant.type) === option ? '#f59e0b' : '#64748b', cursor: 'pointer' }}>
                            {variant.type === 'color' && <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: colorMap[option] || '#94a3b8', marginRight: '8px' }}></span>}{option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📦 Kiasi:</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[1, 5, 10, 20, 50, 100].map(q => <button key={q} onClick={() => setQuantity(selectedProduct.id, q)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: getQuantity(selectedProduct.id) === q ? '#f59e0b' : '#f1f5f9', color: getQuantity(selectedProduct.id) === q ? 'white' : '#64748b', cursor: 'pointer' }}>{q}</button>)}
                      <input type="number" value={getQuantity(selectedProduct.id)} onChange={(e) => setQuantity(selectedProduct.id, parseInt(e.target.value) || 1)} min={selectedProduct.min_order_quantity || 1} style={{ width: '80px', padding: '8px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }} />
                    </div>
                  </div>
                  
                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>💰 Jumla: <strong style={{ fontSize: '20px', color: '#f59e0b' }}>Tsh {(selectedProduct.price * getQuantity(selectedProduct.id)).toLocaleString()}</strong></div>
                  
                  <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <button onClick={() => { addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, quantity: getQuantity(selectedProduct.id), image: selectedProduct.images?.[0] || selectedProduct.image, sellerId: selectedShop.id, sellerName: selectedShop.name, sellerPhone: selectedShop.phone, unit: selectedProduct.bulk_unit || 'pcs', variantDisplay: Object.entries(selectedVariants[selectedProduct.id] || {}).map(([k, v]) => `${k}: ${v}`).join(', ') }); showToast(`✅ ${selectedProduct.name} imeongezwa kwenye kikapu!`) }} style={{ padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🛒 Weka Kikapuni</button>
                    <button onClick={() => { const variantText = Object.entries(selectedVariants[selectedProduct.id] || {}).map(([k, v]) => `${k}: ${v}`).join(', '); const msg = `*🏭 AGIZO LA JUMLA - BAIZONA*\n\n📦 Bidhaa: ${selectedProduct.name}\n${variantText ? `🎨 ${variantText}\n` : ''}💰 Bei: Tsh ${selectedProduct.price?.toLocaleString()}\n📦 Kiasi: ${getQuantity(selectedProduct.id)}\n💵 Jumla: Tsh ${(selectedProduct.price * getQuantity(selectedProduct.id)).toLocaleString()}\n\n👤 Namba yangu: [Ingiza]\n📍 Nafika: [Weka anwani]\n\nAsante!`; window.open(`https://wa.me/${selectedShop.phone || '255700000000'}?text=${encodeURIComponent(msg)}`, '_blank') }} style={{ padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>💬 Agiza WhatsApp</button>
                  </div>
                  
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}><p style={{ fontSize: '12px', color: '#64748b' }}>📍 {selectedShop.location || 'Kariakoo, Dar es Salaam'}</p><p style={{ fontSize: '12px', color: '#64748b' }}>📞 {selectedShop.phone || 'Namba haijajazwa'}</p></div>
                </div>
              </div>
            </div>
          </div>
        ) : page === 'shops' ? (
          /* MACHIMBO PAGE (Maduka Yote) */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>🏪 Machimbo (Maduka ya Jumla)</h2>
              <button onClick={() => setPage('home')} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>← Rudi Nyumbani</button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="🔍 Tafuta machimbo kwa jina au eneo..." value={shopSearchQuery} onChange={(e) => setShopSearchQuery(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: '40px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', background: 'white' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
              {categories.filter(c => c !== "Machimbo Yote").map(cat => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setPage('home') }} style={{ padding: '8px 18px', borderRadius: '30px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>{cat}</button>
              ))}
            </div>
            
            {filteredShops.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
                <div style={{ fontSize: '50px', marginBottom: '16px' }}>🏪</div>
                <p>Hakuna machimbo yaliyopatikana.</p>
                <button onClick={() => setShowSellerAuth(true)} style={{ marginTop: '16px', padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🏪 Jiunge Sasa</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredShops.map(shop => {
                  const shopProductCount = products.filter(p => p.shop === shop.name).length
                  return (
                    <div key={shop.id} onClick={() => { setSelectedShop(shop); setPage('shopProfile') }} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                      <div style={{ height: '100px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '70px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', border: '3px solid white' }}>
                          {shop.logo ? <img src={shop.logo} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '35px' }}>🏪</span>}
                        </div>
                      </div>
                      <div style={{ padding: '40px 16px 16px 16px', textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{shop.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: '#f59e0b', background: '#fef3c7', padding: '3px 12px', borderRadius: '20px' }}>{shop.category || 'Machimbo'}</span>
                          <span style={{ fontSize: '11px', color: '#10b981', background: '#ecfdf5', padding: '3px 12px', borderRadius: '20px' }}>⭐ {shop.rating || '4.5'}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><span>📍</span> {shop.location ? shop.location.substring(0, 35) : 'Kariakoo, Dar es Salaam'}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{shopProductCount}</div><div style={{ fontSize: '10px', color: '#64748b' }}>Bidhaa</div></div>
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 'bold', color: '#25D366' }}>💬</div><div style={{ fontSize: '10px', color: '#64748b' }}>WhatsApp</div></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : page === 'shopProfile' && selectedShop ? (
          /* SHOP PROFILE PAGE */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={() => setPage('shops')} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>← Rudi kwenye Machimbo</button>
              <button onClick={() => setPage('home')} style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', color: '#1e293b' }}>🏠 Nyumbani</button>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '20px', padding: '20px', marginBottom: '24px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                  {selectedShop.logo ? <img src={selectedShop.logo} alt={selectedShop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>🏪</span>}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 'bold' }}>{selectedShop.name}</h1>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px' }}>{selectedShop.category || 'Machimbo'}</span>
                    <span style={{ background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px' }}>⭐ {selectedShop.rating || '4.5'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>📍</span> {selectedShop.location || 'Kariakoo, Dar es Salaam'}</p>
                    <p style={{ margin: 0, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>📞</span> {selectedShop.phone || 'Namba haijajazwa'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button onClick={() => window.open(`https://wa.me/${selectedShop.phone || '255700000000'}?text=Habari, nimeona machimbo yako kwenye Baizona. Ninataka kuulizia bidhaa zako.`, '_blank')} style={{ flex: 1, padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>💬 WhatsApp</button>
              <button onClick={() => window.open(`tel:${selectedShop.phone || ''}`)} style={{ flex: 1, padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>📞 Piga Simu</button>
            </div>
            
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1e293b' }}>📦 Bidhaa za {selectedShop.name}</h2>
            
            {shopProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}><div style={{ fontSize: '50px', marginBottom: '16px' }}>📦</div><p>Hakuna bidhaa za machimbo haya bado.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {shopProducts.map(product => (
                  <div key={product.id} onClick={() => { setSelectedProduct(product); setSelectedShop(selectedShop); setPage('productDetails') }} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      {product.min_order_quantity > 1 && <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>MOQ: {product.min_order_quantity}</div>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{product.name}</h4>
                      <div><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>Tsh {product.price?.toLocaleString()}</span><span style={{ fontSize: '11px', color: '#64748b' }}>/{product.bulk_unit || 'pcs'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* HOME PAGE (Products) */
          <>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="🔍 Tafuta bidhaa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: '40px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', background: 'white' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '8px 18px', borderRadius: '30px', border: '2px solid', borderColor: selectedCategory === cat ? '#f59e0b' : '#e2e8f0', background: selectedCategory === cat ? '#fef3c7' : 'white', color: selectedCategory === cat ? '#f59e0b' : '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: selectedCategory === cat ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
                  {cat === "Machimbo Yote" ? "🏭 Vyote" : cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {filteredProducts.map(product => {
                const shop = getShop(product.shop)
                return (
                  <div key={product.id} onClick={() => { setSelectedProduct(product); setSelectedShop(shop); setPage('productDetails') }} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      {product.images?.length > 1 && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>📷 {product.images.length}</div>}
                      {product.min_order_quantity > 1 && <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#f59e0b', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>MOQ: {product.min_order_quantity}</div>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>🏪 {product.shop}</div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{product.name.length > 40 ? product.name.substring(0,40) + '...' : product.name}</h3>
                      <div><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>Tsh {product.price?.toLocaleString()}</span><span style={{ fontSize: '11px', color: '#64748b' }}>/{product.bulk_unit || 'pcs'}</span></div>
                      {product.variants?.length > 0 && <div style={{ fontSize: '10px', color: '#6366f1', marginTop: '4px' }}>🎨 +{product.variants.length} chaguzi</div>}
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px' }}>📍 {shop.location || 'Kariakoo'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}

export default App