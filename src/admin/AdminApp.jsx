// src/admin/AdminApp.jsx - COMPLETE (Full Product + Shop Management)
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const fmt = (n) => Number(n || 0).toLocaleString()

// ============================================
// STATS CARD
// ============================================
const StatsCard = ({ title, value, icon, color }) => (
  <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '36px' }}>{icon}</span>
      <span style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</span>
    </div>
    <div style={{ marginTop: '12px', color: '#aaa', fontSize: '13px' }}>{title}</div>
  </div>
)

// ============================================
// SIDEBAR WITH LOGOUT ON LEFT
// ============================================
const Sidebar = ({ activeTab, setActiveTab, tabs, adminEmail, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div style={{
      width: isCollapsed ? '80px' : '280px',
      background: '#1a1a2e',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      position: 'fixed',
      height: '100vh',
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: isCollapsed ? '20px 0' : '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: isCollapsed ? 'center' : 'left' }}>
        {isCollapsed ? (
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b00' }}>B</div>
        ) : (
          <>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff6b00' }}>Baizona</div>
            <div style={{ fontSize: '10px', color: '#888' }}>Admin Dashboard</div>
          </>
        )}
      </div>

      {/* Collapse Button */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} style={{
        position: 'absolute', right: '-12px', top: '80px', width: '24px', height: '24px',
        background: '#ff6b00', border: 'none', borderRadius: '50%', color: 'white',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', zIndex: 101
      }}>{isCollapsed ? '→' : '←'}</button>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 0' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            width: '100%', padding: isCollapsed ? '12px 0' : '12px 20px',
            display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px', background: activeTab === tab.id ? 'rgba(255,107,0,0.1)' : 'transparent',
            border: 'none', borderLeft: activeTab === tab.id ? '3px solid #ff6b00' : '3px solid transparent',
            color: activeTab === tab.id ? '#ff6b00' : '#aaa', cursor: 'pointer',
            fontSize: '14px', fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {!isCollapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>

      {/* Admin Info - KUSHOTO (Bottom) */}
      <div style={{ padding: isCollapsed ? '16px 0' : '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {!isCollapsed && (
          <div style={{ marginBottom: '16px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#888' }}>Logged in as</div>
            <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>{adminEmail}</div>
          </div>
        )}
        <button onClick={onLogout} style={{
          width: '100%', padding: isCollapsed ? '10px' : '10px 16px',
          background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', color: '#fecaca', cursor: 'pointer', fontSize: '13px',
          fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}><span>🚪</span>{!isCollapsed && 'Logout'}</button>
      </div>
    </div>
  )
}

// ============================================
// ADD/EDIT PRODUCT MODAL
// ============================================
const ProductModal = ({ isOpen, onClose, product, onSave, shops, categories }) => {
  const [formData, setFormData] = useState({
    name: '', price: '', shop: '', category: '', 
    min_order_quantity: 50, bulk_unit: 'pcs', 
    description: '', image: '', sellerPhone: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        shop: product.shop || shops?.[0]?.name || shops?.[0]?.shop_name || '',
        category: product.category || categories?.[0] || '',
        min_order_quantity: product.min_order_quantity || 50,
        bulk_unit: product.bulk_unit || 'pcs',
        description: product.description || '',
        image: product.image || product.images?.[0] || '',
        sellerPhone: product.sellerPhone || ''
      })
    } else {
      setFormData({
        name: '',
        price: '',
        shop: shops?.[0]?.name || shops?.[0]?.shop_name || '',
        category: categories?.[0] || '',
        min_order_quantity: 50,
        bulk_unit: 'pcs',
        description: '',
        image: '',
        sellerPhone: ''
      })
    }
  }, [product, isOpen, shops, categories])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      shop: formData.shop,
      category: formData.category,
      min_order_quantity: parseInt(formData.min_order_quantity),
      bulk_unit: formData.bulk_unit,
      description: formData.description,
      images: [formData.image],
      image: formData.image,
      sellerPhone: formData.sellerPhone,
      status: 'active'
    }
    
    await onSave(payload, product?.id)
    setLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '550px', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>{product ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input type="text" placeholder="Product Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
            <input type="number" placeholder="Price (Tsh) *" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {shops && shops.length > 0 ? (
              <select value={formData.shop} onChange={e => setFormData({...formData, shop: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required>
                <option value="">Chagua Duka *</option>
                {shops.map((shop, idx) => (
                  <option key={idx} value={shop.name || shop.shop_name}>{shop.name || shop.shop_name}</option>
                ))}
              </select>
            ) : (
              <input type="text" placeholder="Shop Name *" value={formData.shop} onChange={e => setFormData({...formData, shop: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
            )}

            {categories && categories.length > 0 ? (
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }}>
                <option value="">Chagua Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            ) : (
              <input type="text" placeholder="Category (viatu/nguo/vyakula/electronics)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input type="number" placeholder="MOQ (Min Order Quantity)" value={formData.min_order_quantity} onChange={e => setFormData({...formData, min_order_quantity: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
            <select value={formData.bulk_unit} onChange={e => setFormData({...formData, bulk_unit: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }}>
              <option value="pcs">pcs</option><option value="dozen">dozen</option><option value="kg">kg</option>
              <option value="pair">pair</option><option value="meter">meter</option><option value="carton">carton</option>
            </select>
          </div>
          <input type="text" placeholder="Image URL (unsplash or any image link)" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <input type="tel" placeholder="Seller Phone (WhatsApp) *" value={formData.sellerPhone} onChange={e => setFormData({...formData, sellerPhone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ff6b00, #ff8c00)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Saving...' : (product ? 'Update' : 'Add Product')}</button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// SHOP MODAL (Add/Edit Shop)
// ============================================
const ShopModal = ({ isOpen, onClose, shop, onSave }) => {
  const [formData, setFormData] = useState({ name: '', location: '', category: '', phone: '', description: '', image: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || shop.shop_name || '',
        location: shop.location || '',
        category: shop.category || '',
        phone: shop.phone || '',
        description: shop.description || '',
        image: shop.image || ''
      })
    } else {
      setFormData({ name: '', location: '', category: '', phone: '', description: '', image: '' })
    }
  }, [shop, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData, shop?.id)
    setLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>{shop ? '✏️ Edit Shop' : '🏪 Add New Shop'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Shop Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
          <input type="text" placeholder="Location (e.g., Kariakoo, Dar es Salaam)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <input type="text" placeholder="Category (e.g., Viatu, Nguo, Electronics)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <input type="tel" placeholder="Phone Number (WhatsApp) *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
          <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ff6b00, #ff8c00)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Saving...' : (shop ? 'Update' : 'Add Shop')}</button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// PRODUCTS TAB (Full Management)
// ============================================
const ProductsTab = ({ products, sellers, onRefresh, categories }) => {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.shop?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (productData, id) => {
    if (id) {
      await supabase.from('products').update(productData).eq('id', id)
    } else {
      await supabase.from('products').insert([productData])
    }
    onRefresh()
  }

  const handleDelete = async (id) => {
    if (confirm('Futa bidhaa hii?')) {
      await supabase.from('products').delete().eq('id', id)
      onRefresh()
    }
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <ProductModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProduct(null) }} product={editingProduct} onSave={handleSave} shops={sellers} categories={categories} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>📦 Product Management</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white', fontSize: '13px', width: '200px' }} />
          <button onClick={() => { setEditingProduct(null); setShowModal(true) }} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #ff6b00, #ff8c00)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Product</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Image</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Shop</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>MOQ</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}><img src={product.images?.[0] || product.image || 'https://placehold.co/50x50'} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                <td style={{ padding: '12px', color: 'white' }}>{product.name}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{product.shop}</td>
                <td style={{ padding: '12px', color: '#ff6b00' }}>Tsh {fmt(product.price)}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{product.min_order_quantity} {product.bulk_unit}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{product.sellerPhone}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => { setEditingProduct(product); setShowModal(true) }} style={{ marginRight: '8px', padding: '4px 12px', background: '#4facfe', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '4px 12px', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// SHOPS TAB (Full Management)
// ============================================
const ShopsTab = ({ shops, products, onRefresh }) => {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingShop, setEditingShop] = useState(null)

  const filteredShops = shops.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (shopData, id) => {
    if (id) {
      await supabase.from('sellers').update(shopData).eq('id', id)
    } else {
      await supabase.from('sellers').insert([{ ...shopData, shop_name: shopData.name, status: 'active' }])
    }
    onRefresh()
  }

  const handleDelete = async (id) => {
    if (confirm('Fua duka hili? Bidhaa zake pia zitafutwa!')) {
      await supabase.from('products').delete().eq('seller_id', id)
      await supabase.from('sellers').delete().eq('id', id)
      onRefresh()
    }
  }

  const handleToggleStatus = async (shop) => {
    const newStatus = shop.status === 'active' ? 'inactive' : 'active'
    await supabase.from('sellers').update({ status: newStatus }).eq('id', shop.id)
    onRefresh()
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <ShopModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingShop(null) }} shop={editingShop} onSave={handleSave} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>🏪 Shop Management</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="🔍 Search shops..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white', fontSize: '13px', width: '200px' }} />
          <button onClick={() => { setEditingShop(null); setShowModal(true) }} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #ff6b00, #ff8c00)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Shop</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Logo</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Shop Name</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Location</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Products</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShops.map(shop => {
              const productCount = products.filter(p => p.seller_id === shop.id || p.shop === shop.name || p.shop === shop.shop_name).length
              return (
                <tr key={shop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}><img src={shop.image || 'https://placehold.co/50x50'} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                  <td style={{ padding: '12px', color: 'white' }}>{shop.name || shop.shop_name}</td>
                  <td style={{ padding: '12px', color: '#aaa' }}>{shop.location}</td>
                  <td style={{ padding: '12px', color: '#aaa' }}>{shop.phone}</td>
                  <td style={{ padding: '12px', color: '#ff6b00' }}>{productCount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '20px', background: shop.status === 'active' ? '#10b98120' : '#ef444420', color: shop.status === 'active' ? '#10b981' : '#ef4444', fontSize: '11px' }}>{shop.status || 'active'}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => { setEditingShop(shop); setShowModal(true) }} style={{ marginRight: '8px', padding: '4px 12px', background: '#4facfe', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleToggleStatus(shop)} style={{ marginRight: '8px', padding: '4px 12px', background: shop.status === 'active' ? '#f59e0b' : '#10b981', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>{shop.status === 'active' ? 'Suspend' : 'Activate'}</button>
                    <button onClick={() => handleDelete(shop.id)} style={{ padding: '4px 12px', background: '#ef4444', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// ORDERS TAB
// ============================================
const OrdersTab = ({ orders, onRefresh }) => {
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter)

  const handleStatusUpdate = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    onRefresh()
  }

  const statusColors = { pending: '#f59e0b', processing: '#4facfe', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>📋 Order Management</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: filter === s ? '#ff6b00' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', color: '#888' }}>Order ID</th><th style={{ padding: '12px', color: '#888' }}>Customer</th>
              <th style={{ padding: '12px', color: '#888' }}>Seller</th><th style={{ padding: '12px', color: '#888' }}>Amount</th>
              <th style={{ padding: '12px', color: '#888' }}>Status</th><th style={{ padding: '12px', color: '#888' }}>Date</th>
              <th style={{ padding: '12px', color: '#888' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', color: 'white' }}>#{order.id?.slice(-6)}</td>
                <td style={{ padding: '12px', color: 'white' }}>{order.buyer_name}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{order.seller_name}</td>
                <td style={{ padding: '12px', color: '#ff6b00' }}>Tsh {fmt(order.total)}</td>
                <td style={{ padding: '12px' }}>
                  <select value={order.status} onChange={e => handleStatusUpdate(order.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '8px', background: '#0f0f1a', border: `1px solid ${statusColors[order.status]}`, color: statusColors[order.status], fontSize: '11px' }}>
                    <option value="pending">Pending</option><option value="processing">Processing</option>
                    <option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: '12px', color: '#888' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}><button onClick={() => setSelectedOrder(order)} style={{ padding: '4px 12px', background: '#4facfe', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: 'white' }}>Order Details #{selectedOrder.id?.slice(-6)}</h3>
            <div style={{ margin: '20px 0' }}>
              <p><strong style={{ color: '#888' }}>Customer:</strong> <span style={{ color: 'white' }}>{selectedOrder.buyer_name}</span></p>
              <p><strong style={{ color: '#888' }}>Phone:</strong> <span style={{ color: 'white' }}>{selectedOrder.buyer_phone}</span></p>
              <p><strong style={{ color: '#888' }}>Address:</strong> <span style={{ color: 'white' }}>{selectedOrder.delivery_address}</span></p>
              <p><strong style={{ color: '#888' }}>Seller:</strong> <span style={{ color: 'white' }}>{selectedOrder.seller_name}</span></p>
              <p><strong style={{ color: '#888' }}>Total:</strong> <span style={{ color: '#ff6b00' }}>Tsh {fmt(selectedOrder.total)}</span></p>
            </div>
            <button onClick={() => setSelectedOrder(null)} style={{ width: '100%', padding: '12px', background: '#ff6b00', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// CUSTOMERS TAB
// ============================================
const CustomersTab = ({ customers, onRefresh }) => {
  const [search, setSearch] = useState('')
  const filteredCustomers = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))

  const handleBlock = async (customer) => {
    const newStatus = customer.status === 'active' ? 'blocked' : 'active'
    await supabase.from('buyers').update({ status: newStatus }).eq('id', customer.id)
    onRefresh()
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>👥 Customer Management</h3>
        <input type="text" placeholder="🔍 Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white', fontSize: '13px', width: '200px' }} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '12px', color: '#888' }}>Name</th><th style={{ padding: '12px', color: '#888' }}>Email</th>
            <th style={{ padding: '12px', color: '#888' }}>Phone</th><th style={{ padding: '12px', color: '#888' }}>Status</th>
            <th style={{ padding: '12px', color: '#888' }}>Joined</th><th style={{ padding: '12px', color: '#888' }}>Actions</th>
           </tr></thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', color: 'white' }}>{customer.name}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{customer.email}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{customer.phone}</td>
                <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '20px', background: customer.status === 'active' ? '#10b98120' : '#ef444420', color: customer.status === 'active' ? '#10b981' : '#ef4444', fontSize: '11px' }}>{customer.status || 'active'}</span></td>
                <td style={{ padding: '12px', color: '#888' }}>{new Date(customer.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}><button onClick={() => handleBlock(customer)} style={{ padding: '4px 12px', background: customer.status === 'active' ? '#f59e0b' : '#10b981', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>{customer.status === 'active' ? 'Block' : 'Unblock'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// CATEGORIES TAB
// ============================================
const CategoriesTab = ({ categories, onAddCategory, onRemoveCategory }) => {
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newCategory.trim()) {
      onAddCategory(newCategory)
      setNewCategory('')
    }
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 style={{ color: 'white', marginBottom: '20px' }}>🗂️ Category Management</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Add New Category" style={{ flex: '1 1 240px', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
        <button type="submit" style={{ padding: '12px 20px', background: '#ff6b00', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Add Category</button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {categories.length === 0 ? (
          <div style={{ padding: '20px', borderRadius: '16px', background: '#111827', color: '#aaa' }}>Hakuna category imeosajiliwa bado.</div>
        ) : categories.map(category => (
          <div key={category} style={{ padding: '16px', borderRadius: '16px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: 'white' }}>{category}</span>
            <button type="button" onClick={() => onRemoveCategory(category)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// CHINA REGISTRATIONS TAB
// ============================================
const ChinaTab = ({ chinaRegistrations, onAddChina }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    onAddChina({
      id: Date.now().toString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      note: form.note.trim(),
      created_at: new Date().toISOString()
    })
    setForm({ name: '', phone: '', email: '', note: '' })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 style={{ color: 'white', marginBottom: '20px' }}>🇨🇳 China Buyer Registrations</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Buyer Name" style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone (WhatsApp)" style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} required />
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email (optional)" style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
        <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Note / order details" rows="3" style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#0f0f1a', color: 'white' }} />
        <button type="submit" style={{ padding: '12px 20px', background: '#10b981', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Register China Buyer</button>
      </form>

      <div style={{ display: 'grid', gap: '12px' }}>
        {chinaRegistrations.length === 0 ? (
          <div style={{ padding: '20px', borderRadius: '16px', background: '#111827', color: '#aaa' }}>Hakuna taarifa za China buyers.</div>
        ) : chinaRegistrations.map(reg => (
          <div key={reg.id} style={{ padding: '16px', borderRadius: '16px', background: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>{reg.name}</div>
                <div style={{ color: '#aaa', fontSize: '13px' }}>{reg.phone} {reg.email ? `| ${reg.email}` : ''}</div>
              </div>
              <div style={{ color: '#888', fontSize: '12px' }}>{new Date(reg.created_at).toLocaleDateString()}</div>
            </div>
            {reg.note && <p style={{ marginTop: '10px', color: '#ccc', fontSize: '13px' }}>{reg.note}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN ADMIN APP
// ============================================
const AdminApp = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [categories, setCategories] = useState([])
  const [chinaRegistrations, setChinaRegistrations] = useState([])
  const [stats, setStats] = useState({ totalProducts: 0, totalSellers: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0, pendingOrders: 0 })

  const loadLocalCategories = (productData, sellerData) => {
    const stored = window.localStorage.getItem('baizona_admin_categories')
    if (stored) {
      try { setCategories(JSON.parse(stored)) } catch (e) { setCategories([]) }
      return
    }
    const derived = Array.from(new Set([
      ...(productData?.map(p => p.category || '').filter(Boolean) || []),
      ...(sellerData?.map(s => s.category || '').filter(Boolean) || [])
    ]))
    setCategories(derived)
    window.localStorage.setItem('baizona_admin_categories', JSON.stringify(derived))
  }

  const saveCategories = (newCategories) => {
    setCategories(newCategories)
    window.localStorage.setItem('baizona_admin_categories', JSON.stringify(newCategories))
  }

  const loadChinaRegistrations = () => {
    const stored = window.localStorage.getItem('baizona_china_registrations')
    if (stored) {
      try { setChinaRegistrations(JSON.parse(stored)) } catch (e) { setChinaRegistrations([]) }
    }
  }

  const saveChinaRegistrations = (items) => {
    setChinaRegistrations(items)
    window.localStorage.setItem('baizona_china_registrations', JSON.stringify(items))
  }

  const addChinaRegistration = (registration) => {
    const updated = [registration, ...chinaRegistrations]
    saveChinaRegistrations(updated)
  }

  const removeCategory = (category) => {
    const updated = categories.filter(c => c !== category)
    saveCategories(updated)
  }

  const addCategory = (category) => {
    const trimmed = category.trim()
    if (!trimmed) return
    const normalized = trimmed
    if (!categories.includes(normalized)) {
      saveCategories([normalized, ...categories])
    }
  }

  const fetchAllData = async () => {
    setLoading(true)
    const [productsRes, sellersRes, ordersRes, customersRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('sellers').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('buyers').select('*').order('created_at', { ascending: false })
    ])
    if (productsRes.data) setProducts(productsRes.data)
    if (sellersRes.data) setSellers(sellersRes.data)
    if (customersRes.data) setCustomers(customersRes.data)
    if (ordersRes.data) {
      setOrders(ordersRes.data)
      setStats({
        totalProducts: productsRes.data?.length || 0,
        totalSellers: sellersRes.data?.length || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalCustomers: customersRes.data?.length || 0,
        totalRevenue: ordersRes.data.reduce((sum, o) => sum + (o.total || 0), 0),
        pendingOrders: ordersRes.data.filter(o => o.status === 'pending').length
      })
    }

    loadLocalCategories(productsRes.data, sellersRes.data)
    loadChinaRegistrations()
    setLoading(false)
  }

  useEffect(() => { fetchAllData() }, [])

  const tabs = [
    { id: 'products', label: '📦 Products', icon: '📦' },
    { id: 'shops', label: '🏪 Shops', icon: '🏪' },
    { id: 'categories', label: '🗂️ Categories', icon: '🗂️' },
    { id: 'china', label: '🇨🇳 China', icon: '🇨🇳' },
    { id: 'orders', label: '📋 Orders', icon: '📋' },
    { id: 'customers', label: '👥 Customers', icon: '👥' },
    { id: 'overview', label: '📊 Overview', icon: '📊' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} adminEmail={adminUser?.email} onLogout={onLogout} />
      <div style={{ marginLeft: '280px', flex: 1, padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: 'white', marginBottom: '8px' }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
          <p style={{ color: '#888' }}>Dhibiti na usimamie Baizona platform</p>
        </div>
        {activeTab === 'products' && <ProductsTab products={products} sellers={sellers} categories={categories} onRefresh={fetchAllData} />}
        {activeTab === 'shops' && <ShopsTab shops={sellers} products={products} onRefresh={fetchAllData} />}
        {activeTab === 'categories' && <CategoriesTab categories={categories} onAddCategory={addCategory} onRemoveCategory={removeCategory} />}
        {activeTab === 'china' && <ChinaTab chinaRegistrations={chinaRegistrations} onAddChina={addChinaRegistration} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchAllData} />}
        {activeTab === 'customers' && <CustomersTab customers={customers} onRefresh={fetchAllData} />}
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <StatsCard title="Total Products" value={stats.totalProducts} icon="📦" color="#ff6b00" />
              <StatsCard title="Total Shops" value={stats.totalSellers} icon="🏪" color="#667eea" />
              <StatsCard title="Total Orders" value={stats.totalOrders} icon="📋" color="#10b981" />
              <StatsCard title="Total Customers" value={stats.totalCustomers} icon="👥" color="#8b5cf6" />
              <StatsCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="#f59e0b" />
              <StatsCard title="Revenue" value={`Tsh ${fmt(stats.totalRevenue)}`} icon="💰" color="#ef4444" />
            </div>
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>📋 Recent Orders</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%' }}><thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px', color: '#888' }}>Order ID</th><th style={{ padding: '12px', color: '#888' }}>Customer</th>
                  <th style={{ padding: '12px', color: '#888' }}>Amount</th><th style={{ padding: '12px', color: '#888' }}>Status</th>
                 </tr></thead>
                <tbody>
                  {orders.slice(0, 10).map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', color: 'white' }}>#{order.id?.slice(-6)}</td>
                      <td style={{ padding: '12px', color: 'white' }}>{order.buyer_name}</td>
                      <td style={{ padding: '12px', color: '#ff6b00' }}>Tsh {fmt(order.total)}</td>
                      <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '20px', background: order.status === 'pending' ? '#fef3c7' : '#ecfdf5', color: order.status === 'pending' ? '#d97706' : '#10b981', fontSize: '11px' }}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
            </div>
          </>
        )}
        {loading && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: '#1a1a2e', padding: '30px', borderRadius: '20px' }}><div style={{ fontSize: '40px' }}>⏳</div><p style={{ color: 'white' }}>Loading...</p></div></div>}
      </div>
    </div>
  )
}

export default AdminApp