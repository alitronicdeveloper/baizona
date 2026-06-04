// src/App.jsx - BAIZONA FINAL (Desktop Top Nav + Mobile Bottom Nav)
import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { useCartStore } from './stores/cartStore'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// SAMPLE DATA
// ============================================
const SAMPLE_PRODUCTS = [
  { id: 1, name: "Viatu vya Sneakers", price: 25000, shop: "Alicom Express", category: "viatu", min_order_quantity: 50, bulk_unit: "pair", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", description: "Sneakers za kiume ubora wa juu.", stock: 5000, sold: 2340, sellerPhone: "255712345678" },
  { id: 2, name: "Viatu vya Wanawake", price: 35000, shop: "Viatu Bora", category: "viatu", min_order_quantity: 30, bulk_unit: "pair", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", description: "Viatu vya kisasa vya wanawake.", stock: 3000, sold: 1800, sellerPhone: "255712345679" },
  { id: 3, name: "Vitenge vya Kiafrika", price: 45000, shop: "Vitenge House", category: "nguo", min_order_quantity: 20, bulk_unit: "kitambaa", image: "https://images.unsplash.com/photo-1565688534246-05d6f5e184e3?w=400", description: "Vitenge vya ubora wa juu.", stock: 8000, sold: 5600, sellerPhone: "255712345680" },
  { id: 4, name: "Jeans za Kiume", price: 18000, shop: "Jeans Tanzania", category: "nguo", min_order_quantity: 50, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", description: "Jeans za kiume sizes 28-42.", stock: 15000, sold: 8900, sellerPhone: "255712345681" },
  { id: 5, name: "Mchele wa Tanzania", price: 2500, shop: "Mchele Bora", category: "vyakula", min_order_quantity: 500, bulk_unit: "kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400", description: "Mchele wa Tanzania ubora wa juu.", stock: 50000, sold: 35000, sellerPhone: "255712345682" },
  { id: 6, name: "Power Bank", price: 35000, shop: "Tech Tanzania", category: "electronics", min_order_quantity: 20, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1609592424901-8f6ae6b4f0d4?w=400", description: "Power bank ya 20000mAh.", stock: 2000, sold: 1560, sellerPhone: "255712345683" },
  { id: 7, name: "Sabuni za Kioo", price: 45000, shop: "Vipodozi Bora", category: "vipodozi", min_order_quantity: 20, bulk_unit: "carton", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400", description: "Sabuni za kioo za kunawiri ngozi.", stock: 8000, sold: 5600, sellerPhone: "255712345684" },
  { id: 8, name: "Sufuria za Alumini", price: 65000, shop: "Vyombo Bora", category: "vifaa_vya_nyumbani", min_order_quantity: 20, bulk_unit: "set", image: "https://images.unsplash.com/photo-1584990347449-b85f6ce4e9e3?w=400", description: "Sufuria za alumini set 5.", stock: 2000, sold: 1450, sellerPhone: "255712345685" },
  { id: 9, name: "T-shirt za Pamba", price: 8000, shop: "T-Shirts Bora", category: "nguo", min_order_quantity: 100, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "T-shirt za pamba 100%.", stock: 20000, sold: 15000, sellerPhone: "255712345686" },
  { id: 10, name: "Madaftari ya Shule", price: 25000, shop: "Stationary Plus", category: "stationary", min_order_quantity: 50, bulk_unit: "carton", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", description: "Madaftari ya shule.", stock: 5000, sold: 3200, sellerPhone: "255712345687" },
  { id: 11, name: "Kanga za Harusi", price: 15000, shop: "Kanga House", category: "nguo", min_order_quantity: 100, bulk_unit: "kitambaa", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400", description: "Kanga za harusi design za kipekee.", stock: 5000, sold: 3200, sellerPhone: "255712345688" },
  { id: 12, name: "Maharage ya Kwanza", price: 1800, shop: "Maharage Hub", category: "vyakula", min_order_quantity: 500, bulk_unit: "kg", image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400", description: "Maharage safi ya msimu.", stock: 30000, sold: 21000, sellerPhone: "255712345689" },
]

const SAMPLE_SHOPS = [
  { id: 1, name: "Alicom Express", location: "Kariakoo, Dar es Salaam", category: "Viatu", phone: "255712345678", rating: 4.8, products: 45, image: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200", description: "Muuzaji mkubwa wa viatu vya jumla Tanzania." },
  { id: 2, name: "Vitenge House", location: "Kariakoo, Dar es Salaam", category: "Nguo", phone: "255712345680", rating: 4.9, products: 120, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200", description: "Vitenge vya kisasa na vya kitamaduni." },
  { id: 3, name: "Tech Tanzania", location: "Kariakoo, Dar es Salaam", category: "Electronics", phone: "255712345683", rating: 4.7, products: 60, image: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200", description: "Electronics na gadgets za kisasa." },
  { id: 4, name: "Mchele Bora", location: "Buguruni, Dar es Salaam", category: "Vyakula", phone: "255712345682", rating: 4.9, products: 25, image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200", description: "Mchele na vyakula vingine vya jumla." },
  { id: 5, name: "Vipodozi Bora", location: "Kariakoo, Dar es Salaam", category: "Vipodozi", phone: "255712345684", rating: 4.6, products: 80, image: "https://images.unsplash.com/photo-1596462502278-27bfdc7c5e58?w=200", description: "Sabuni, mafuta na vipodozi vingine." },
]

const SAMPLE_AGIZA_CHINA = [
  { 
    id: 1, name: "Speed Cargo Tanzania", logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200",
    location: "Kariakoo, Dar es Salaam", rating: 4.9, phone: "255712345678",
    description: "Wataalamu wa usafirishaji wa bidhaa kutoka China kwenda Tanzania.",
    products: [
      { id: 101, name: "Simu za Huawei", price: 180000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200", min_order: 10 },
      { id: 102, name: "Laptop Lenovo", price: 550000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200", min_order: 5 },
    ]
  },
  { 
    id: 2, name: "China Link Logistics", logo: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200",
    location: "Kariakoo, Dar es Salaam", rating: 4.8, phone: "255712345679",
    description: "Wakala wa usafirishaji wa mizigo kutoka China.",
    products: [
      { id: 201, name: "Phone Cases", price: 25000, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200", min_order: 50 },
      { id: 202, name: "USB Cables", price: 15000, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200", min_order: 30 },
    ]
  },
]

const PRODUCT_CATEGORIES = [
  { id: "all", name: "Zote", icon: "🏭", color: "#ff6b00" },
  { id: "viatu", name: "Viatu", icon: "👟", color: "#667eea" },
  { id: "nguo", name: "Nguo", icon: "👗", color: "#f093fb" },
  { id: "vyakula", name: "Vyakula", icon: "🍎", color: "#43e97b" },
  { id: "electronics", name: "Electronics", icon: "📱", color: "#4facfe" },
  { id: "stationary", name: "Stationary", icon: "✏️", color: "#a18cd1" },
  { id: "vifaa_vya_nyumbani", name: "Nyumbani", icon: "🏠", color: "#fa709a" },
  { id: "vipodozi", name: "Vipodozi", icon: "💄", color: "#ff9a9e" },
]

const fmt = (n) => Number(n || 0).toLocaleString()

const showToast = (msg, type = "success") => {
  const toast = document.createElement("div")
  toast.textContent = msg
  Object.assign(toast.style, {
    position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
    background: type === "success" ? "#10b981" : "#ef4444", color: "white",
    padding: "10px 20px", borderRadius: "50px", zIndex: 10000,
    fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap"
  })
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2500)
}

const StarRating = ({ rating = 4.5 }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? "#ffc107" : "#ddd", fontSize: "11px" }}>{i < Math.floor(rating) ? "★" : "☆"}</span>
    ))}
  </div>
)

// SMALL PRODUCT CARD
const SmallProductCard = ({ product, onClick }) => (
  <div onClick={onClick} style={{
    background: "white", borderRadius: "10px", overflow: "hidden", border: "1px solid #eee",
    cursor: "pointer", transition: "all 0.3s", minWidth: "150px"
  }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
     onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    <div style={{ height: "90px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "80px", objectFit: "contain" }} />
    </div>
    <div style={{ padding: "6px" }}>
      <h4 style={{ fontSize: "10px", fontWeight: "600", color: "#333", margin: "0 0 3px" }}>{product.name.substring(0, 25)}...</h4>
      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
      <div style={{ fontSize: "8px", color: "#888" }}>MOQ: {product.min_order || 10}</div>
    </div>
  </div>
)

// PRODUCT CARD
const ProductCard = ({ product, onClick, index }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ position: "relative", height: isMobile ? "120px" : "200px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        <span style={{ position: "absolute", top: "8px", left: "8px", background: "#ff6b00", color: "white", fontSize: "9px", fontWeight: "bold", padding: "2px 8px", borderRadius: "20px" }}>MOQ {product.min_order_quantity}</span>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ fontSize: "11px", color: "#ff6b00", marginBottom: "4px" }}>🏪 {product.shop}</div>
        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#333", margin: "0 0 4px", lineHeight: "1.3", height: "36px", overflow: "hidden" }}>{product.name}</h3>
        <StarRating rating={4.5} />
        <div style={{ marginTop: "6px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#ff6b00" }}>Tsh {fmt(product.price)}</span>
          <span style={{ fontSize: "10px", color: "#999" }}>/{product.bulk_unit}</span>
        </div>
      </div>
    </div>
  )
}

// SHOP CARD
const ShopCard = ({ shop, onClick }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
       onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ height: isMobile ? "120px" : "160px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={shop.image} alt={shop.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: "8px", right: "8px", background: "#ff6b00", color: "white", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "20px" }}>⭐ {shop.rating}</div>
      </div>
      <div style={{ padding: "12px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>{shop.name}</h3>
        <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>📁 {shop.category}</div>
        <div style={{ fontSize: "11px", color: "#ff6b00" }}>📦 {shop.products} bidhaa</div>
      </div>
    </div>
  )
}

// AGIZA CHINA CARD
const AgizaChinaCard = ({ company, onClick, onViewProduct }) => {
  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
       onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ padding: "16px", display: "flex", gap: "16px" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden", background: "#fafafa" }}>
          <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>{company.name}</h3>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>📍 {company.location} | ⭐ {company.rating}</div>
          <p style={{ fontSize: "11px", color: "#666", marginTop: "6px" }}>{company.description.substring(0, 80)}...</p>
        </div>
      </div>
      <div style={{ padding: "0 16px 16px 16px" }}>
        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#666", marginBottom: "8px" }}>📦 Bidhaa:</div>
        <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
          {company.products.map(product => (
            <div key={product.id} onClick={(e) => { e.stopPropagation(); onViewProduct({ ...product, shop: company.name, sellerPhone: company.phone }) }} style={{ minWidth: "120px", background: "#fafafa", borderRadius: "8px", padding: "8px", cursor: "pointer" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: "70px", objectFit: "contain" }} />
              <div style={{ fontSize: "10px", fontWeight: "bold", color: "#333", marginTop: "6px" }}>{product.name.substring(0, 15)}</div>
              <div style={{ fontSize: "10px", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// PRODUCT DETAILS PAGE
const ProductDetailsPage = ({ product, onAddToCart, onBack, onDirectOrder, onViewProduct, allProducts }) => {
  const [quantity, setQuantity] = useState(product.min_order_quantity || 1)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const similarProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 8)

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      onBack()
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={handleGoBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "25px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>← Rudi</button>
        
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "30px", background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div>
            <div style={{ background: "#fafafa", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "center", minHeight: isMobile ? "250px" : "400px" }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: "14px", color: "#ff6b00", marginBottom: "8px" }}>🏪 {product.shop}</div>
            <h1 style={{ fontSize: isMobile ? "22px" : "28px", color: "#333", marginBottom: "12px" }}>{product.name}</h1>
            <StarRating rating={4.5} />
            
            <div style={{ background: "#f5f5f5", borderRadius: "12px", padding: "20px", margin: "20px 0" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>Bei ya jumla / {product.bulk_unit}</div>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ color: "#333", marginBottom: "10px", fontWeight: "bold" }}>📦 Kiasi:</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - (product.min_order_quantity || 1)))} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }}>-</button>
                <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: "80px", textAlign: "center", padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }} />
                <button onClick={() => setQuantity(quantity + (product.min_order_quantity || 1))} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }}>+</button>
                <span style={{ fontSize: "12px", color: "#666" }}>MOQ: {product.min_order_quantity}</span>
              </div>
            </div>
            
            <div style={{ background: "#ff6b00", borderRadius: "12px", padding: "15px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: "16px", fontWeight: "bold" }}>
                <span>Jumla:</span>
                <span>Tsh {fmt(product.price * quantity)}</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={() => onAddToCart(product, quantity)} style={{ flex: 1, padding: "12px", background: "#ff6b00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>🛒 Weka Kikapuni</button>
              <button onClick={() => onDirectOrder(product, quantity)} style={{ flex: 1, padding: "12px", background: "#25D366", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>💬 Agiza WhatsApp</button>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontSize: "18px", color: "#333", marginBottom: "16px" }}>🔍 Bidhaa Zinazofanana</h2>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
              {similarProducts.map(similar => (
                <div key={similar.id} style={{ minWidth: "160px" }}>
                  <SmallProductCard product={similar} onClick={() => onViewProduct(similar)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// SHOP DETAILS PAGE
const ShopDetailsPage = ({ shop, onBack, onViewProduct, shopProducts }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      onBack()
    }
  }

  const handleWhatsApp = () => window.open(`https://wa.me/${shop.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={handleGoBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "25px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>← Rudi</button>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ width: isMobile ? "100px" : "120px", height: isMobile ? "100px" : "120px", background: "#fafafa", borderRadius: "12px", overflow: "hidden" }}>
              <img src={shop.image} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: isMobile ? "22px" : "28px", color: "#333", marginBottom: "8px" }}>{shop.name}</h1>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>⭐ {shop.rating}</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📁 {shop.category}</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📍 {shop.location}</span>
              </div>
              <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>{shop.description}</p>
              <button onClick={handleWhatsApp} style={{ padding: "10px 24px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer" }}>💬 WhatsApp</button>
            </div>
          </div>
        </div>
        
        <h2 style={{ fontSize: "18px", color: "#333", marginBottom: "16px" }}>📦 Bidhaa za {shop.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: "16px" }}>
          {shopProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => onViewProduct(product)} index={0} />
          ))}
        </div>
      </div>
    </div>
  )
}

// AGIZA CHINA DETAILS PAGE
const AgizaChinaDetailsPage = ({ company, onBack, onViewProduct }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      onBack()
    }
  }

  const handleWhatsApp = () => window.open(`https://wa.me/${company.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={handleGoBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "25px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold" }}>← Rudi</button>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ width: isMobile ? "80px" : "100px", height: isMobile ? "80px" : "100px", background: "#fafafa", borderRadius: "12px", overflow: "hidden" }}>
              <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: isMobile ? "22px" : "28px", color: "#333", marginBottom: "8px" }}>{company.name}</h1>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>📍 {company.location} | ⭐ {company.rating}</div>
              <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>{company.description}</p>
              <button onClick={handleWhatsApp} style={{ padding: "10px 24px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer" }}>💬 WhatsApp</button>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: "18px", color: "#333", marginBottom: "16px" }}>📦 Bidhaa Tunazoagiza</h2>
        <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
          {company.products.map(product => (
            <div key={product.id} style={{ minWidth: "180px" }}>
              <SmallProductCard product={product} onClick={() => onViewProduct({ ...product, shop: company.name, sellerPhone: company.phone })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CHECKOUT MODAL
const CheckoutModal = ({ isOpen, onClose, onConfirm, sellerName, total }) => {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("baizona_customer")
    return saved ? JSON.parse(saved) : { name: "", phone: "", address: "" }
  })

  useEffect(() => {
    if (customer.name && customer.phone) {
      localStorage.setItem("baizona_customer", JSON.stringify(customer))
    }
  }, [customer])

  if (!isOpen) return null

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "white", borderRadius: "20px", maxWidth: "450px", width: "100%", padding: "24px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>📝 Anza Kuagiza</h2>
        <div style={{ background: "#f5f5f5", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span>Duka:</span><span style={{ fontWeight: "bold", color: "#ff6b00" }}>{sellerName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Jumla:</span><span style={{ fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(total)}</span>
          </div>
        </div>
        <input type="text" placeholder="Jina lako" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
        <input type="tel" placeholder="Namba ya WhatsApp" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
        <textarea placeholder="Anwani" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} rows="2" style={{ width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", resize: "none" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f5f5f5", border: "none", borderRadius: "8px", cursor: "pointer" }}>Ghairi</button>
          <button onClick={() => onConfirm(customer)} style={{ flex: 1, padding: "10px", background: "#ff6b00", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer" }}>Thibitisha</button>
        </div>
      </div>
    </div>
  )
}

// CART PAGE
const CartPage = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, getGroupedBySeller, clearCart } = useCartStore()
  const [showCheckoutModal, setShowCheckoutModal] = useState(null)
  const [pendingOrder, setPendingOrder] = useState(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleProceedToOrder = (sellerId, sellerName, sellerPhone, sellerItems) => {
    const total = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0)
    setPendingOrder({ sellerId, sellerName, sellerPhone, sellerItems, total })
    setShowCheckoutModal(true)
  }

  const handleConfirmOrder = (customer) => {
    if (!customer.name || !customer.phone) {
      showToast("Jaza jina na namba!", "error")
      return
    }
    const { sellerName, sellerPhone, sellerItems, total } = pendingOrder
    const itemList = sellerItems.map(i => `• ${i.name} x${i.quantity} = Tsh ${fmt(i.price * i.quantity)}`).join("\n")
    const message = `🏪 AGIZO KUTOKA BAIZONA\n\nDuka: ${sellerName}\n${itemList}\n\nJUMLA: Tsh ${fmt(total)}\n\n👤 Jina: ${customer.name}\n📞 Simu: ${customer.phone}\n📍 Anwani: ${customer.address}\n\nAsante!`
    window.open(`https://wa.me/${sellerPhone || "255700000000"}?text=${encodeURIComponent(message)}`, "_blank")
    showToast(`Agizo limetumwa kwa ${sellerName}!`)
    setShowCheckoutModal(false)
    setPendingOrder(null)
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      onClose()
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <div style={{ background: "white", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
          <div><div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div><div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div></div>
          <button onClick={handleGoBack} style={{ background: "#f5f5f5", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer" }}>← Rudi</button>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛒</div>
          <h3>Kikapu Chako ni Tupu</h3>
          <button onClick={onClose} style={{ marginTop: "16px", padding: "10px 24px", background: "#ff6b00", border: "none", borderRadius: "25px", color: "white", cursor: "pointer" }}>Anza Kununua</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onConfirm={handleConfirmOrder} sellerName={pendingOrder?.sellerName} total={pendingOrder?.total} />
      
      <div style={{ background: "white", padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div><div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div><div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div></div>
        <button onClick={handleGoBack} style={{ background: "#f5f5f5", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer" }}>← Rudi</button>
      </div>

      <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 350px", gap: "24px" }}>
          <div>
            <h3 style={{ marginBottom: "16px" }}>🛒 Bidhaa Zako ({getTotalItems()})</h3>
            {Object.entries(getGroupedBySeller()).map(([sid, { sellerName, sellerPhone, items: sellerItems }]) => {
              const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0)
              return (
                <div key={sid} style={{ background: "white", borderRadius: "12px", marginBottom: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "12px 16px", background: "#fff5eb", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#ff6b00" }}>🏪 {sellerName}</div>
                  {sellerItems.map(item => (
                    <div key={item.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: "12px", alignItems: "center" }}>
                      <img src={item.image} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{item.name}</div>
                        <div style={{ color: "#ff6b00", fontSize: "12px" }}>Tsh {fmt(item.price)} / {item.unit}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }}>-</button>
                        <span style={{ minWidth: "25px", textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }}>+</button>
                        <button onClick={() => removeItem(item.id, item.variant)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                      </div>
                      <div style={{ fontWeight: "bold", minWidth: "90px", textAlign: "right" }}>Tsh {fmt(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  <div style={{ padding: "12px 16px", background: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => handleProceedToOrder(sid, sellerName, sellerPhone, sellerItems)} style={{ padding: "8px 20px", background: "#25D366", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer" }}>📱 Agiza Sasa</button>
                  </div>
                </div>
              )
            })}
            <button onClick={clearCart} style={{ width: "100%", padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "10px", color: "#ff4444", cursor: "pointer", marginTop: "10px" }}>🗑️ Futa Kikapu</button>
          </div>
          
          {!isMobile && (
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: "100px" }}>
              <h3 style={{ marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>📦 Jumla ya Agizo</h3>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Bidhaa ({getTotalItems()})</span><span>Tsh {fmt(getTotalPrice())}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Delivery</span><span style={{ color: "#10b981" }}>Tsh 0 (Free)</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>Jumla Kuu:</span>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(getTotalPrice())}</span>
              </div>
              <button onClick={clearCart} style={{ width: "100%", padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "8px", color: "#ff4444", cursor: "pointer" }}>Futa Kikapu</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// USER ACCOUNT PAGE (Sign in with Phone and Name only)
const UserAccountPage = ({ user, onLogin, onLogout, userOrders, onViewProduct }) => {
  const [isLogin, setIsLogin] = useState(!user)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (form.name && form.phone) {
      const newUser = { id: Date.now(), name: form.name, phone: form.phone }
      localStorage.setItem("baizona_user", JSON.stringify(newUser))
      onLogin(newUser)
      showToast(`Karibu ${form.name}!`)
      setIsLogin(true)
    } else {
      showToast("Jaza jina na namba ya simu!", "error")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("baizona_user")
    onLogout()
    showToast("Umefunga akaunti yako")
  }

  if (user) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
        <div style={{ background: "white", padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
          <div><div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div><div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div></div>
          <button onClick={handleGoBack} style={{ background: "#f5f5f5", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer" }}>← Rudi</button>
        </div>

        <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
            <div style={{ width: "80px", height: "80px", background: "#ff6b00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "36px", color: "white" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{user.name}</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>📞 {user.phone}</p>
            <button onClick={handleLogout} style={{ padding: "10px 24px", background: "#ef4444", color: "white", border: "none", borderRadius: "25px", cursor: "pointer" }}>Ondoka Akaunti</button>
          </div>

          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>📋 Historia ya Maagizo</h3>
          {userOrders.length === 0 ? (
            <div style={{ background: "white", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "50px", marginBottom: "12px" }}>📭</div>
              <p>Hujawa na maagizo bado</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: "12px", padding: "8px 20px", background: "#ff6b00", border: "none", borderRadius: "25px", color: "white", cursor: "pointer" }}>Anza Kununua</button>
            </div>
          ) : (
            userOrders.map((order, idx) => (
              <div key={idx} style={{ background: "white", borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#666" }}>#{order.id}</span>
                  <span style={{ fontSize: "10px", background: "#e8f5e9", color: "#10b981", padding: "2px 8px", borderRadius: "10px" }}>{order.status || "Completed"}</span>
                </div>
                <div style={{ fontSize: "12px", marginBottom: "4px" }}>Duka: {order.sellerName}</div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#ff6b00" }}>Jumla: Tsh {fmt(order.total)}</div>
                <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>{order.date}</div>
              </div>
            ))
          )}
        </div>

        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "20px", padding: "30px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
            <p style={{ color: "#888", fontSize: "11px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
          </div>
        </footer>
      </div>
    )
  }

  // Login Form
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingBottom: isMobile ? "60px" : "0" }}>
      <div style={{ background: "white", padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div><div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div><div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div></div>
        <button onClick={handleGoBack} style={{ background: "#f5f5f5", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer" }}>← Rudi</button>
      </div>

      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ width: "60px", height: "60px", background: "#ff6b00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "30px", color: "white" }}>👤</div>
            <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>Karibu!</h2>
            <p style={{ fontSize: "13px", color: "#666" }}>Ingiza jina na namba yako ya simu</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Jina lako" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px" }} required />
            <input type="tel" placeholder="Namba ya simu (WhatsApp)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px" }} required />
            <button type="submit" style={{ width: "100%", padding: "14px", background: "#ff6b00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>Ingia / Jiunge</button>
          </form>
        </div>
      </div>

      <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "20px", padding: "30px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
          <p style={{ color: "#888", fontSize: "11px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
        </div>
      </footer>
    </div>
  )
}

// MAIN APP
export default function App() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [shops, setShops] = useState(SAMPLE_SHOPS)
  const [agizaChinaCompanies, setAgizaChinaCompanies] = useState(SAMPLE_AGIZA_CHINA)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [shopSearchQuery, setShopSearchQuery] = useState("")
  const [agizaChinaSearchQuery, setAgizaChinaSearchQuery] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [selectedAgizaChinaCompany, setSelectedAgizaChinaCompany] = useState(null)
  const [cartBounce, setCartBounce] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(null)
  const [pendingDirectOrder, setPendingDirectOrder] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("baizona_user")) } catch { return null }
  })
  const [userOrders, setUserOrders] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const { items, addItem, getTotalItems } = useCartStore()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("baizona_recently_viewed")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const validProducts = parsed.filter(p => products.some(prod => prod.id === p.id))
        setRecentlyViewed(validProducts)
      } catch(e) {}
    }
  }, [products])

  useEffect(() => {
    if (recentlyViewed.length > 0) {
      localStorage.setItem("baizona_recently_viewed", JSON.stringify(recentlyViewed.slice(0, 8)))
    }
  }, [recentlyViewed])

  useEffect(() => {
    if (getTotalItems() > 0) {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 500)
    }
  }, [getTotalItems()])

  const filteredProducts = products.filter(p => {
    const matchesSearch = productSearchQuery === "" || p.name?.toLowerCase().includes(productSearchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredShops = shops.filter(s => {
    return shopSearchQuery === "" || s.name?.toLowerCase().includes(shopSearchQuery.toLowerCase())
  })

  const filteredAgizaChina = agizaChinaCompanies.filter(c => {
    return agizaChinaSearchQuery === "" || c.name?.toLowerCase().includes(agizaChinaSearchQuery.toLowerCase())
  })

  const trendingProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8)

  const handleAddToCart = (product, quantity = 1) => {
    addItem({
      id: product.id, name: product.name, price: product.price, quantity: quantity,
      image: product.image, sellerName: product.shop, sellerPhone: product.sellerPhone,
      unit: product.bulk_unit, min_order_quantity: product.min_order_quantity
    })
    showToast(`✅ ${product.name} imeongezwa!`)
    setCurrentPage("home")
  }

  const handleDirectOrder = (product, quantity) => {
    const total = product.price * quantity
    setPendingDirectOrder({ product, quantity, total })
    setShowCheckoutModal(true)
  }

  const handleConfirmDirectOrder = (customer) => {
    if (!customer.name || !customer.phone) {
      showToast("Jaza jina na namba!", "error")
      return
    }
    const { product, quantity, total } = pendingDirectOrder
    const message = `🏪 AGIZO KUTOKA BAIZONA\n\nBidhaa: ${product.name}\nKiasi: ${quantity}\nJumla: Tsh ${fmt(total)}\n\n👤 Jina: ${customer.name}\n📞 Simu: ${customer.phone}\n📍 Anwani: ${customer.address}\n\nAsante!`
    window.open(`https://wa.me/${product.sellerPhone || "255700000000"}?text=${encodeURIComponent(message)}`, "_blank")
    showToast(`Agizo limetumwa!`)
    setShowCheckoutModal(false)
    setPendingDirectOrder(null)
  }

  const handleViewProduct = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      return [product, ...filtered].slice(0, 8)
    })
    setSelectedProduct(product)
    setCurrentPage("productDetails")
  }

  const handleViewShop = (shop) => {
    setSelectedShop(shop)
    setCurrentPage("shopDetails")
  }

  const handleViewAgizaChinaCompany = (company) => {
    setSelectedAgizaChinaCompany(company)
    setCurrentPage("agizaChinaDetails")
  }

  const shopProducts = selectedShop ? products.filter(p => p.shop === selectedShop.name) : []

  if (showCart) return <CartPage onClose={() => setShowCart(false)} />
  
  if (currentPage === "productDetails" && selectedProduct) {
    return (
      <>
        <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onConfirm={handleConfirmDirectOrder} sellerName={pendingDirectOrder?.product?.shop} total={pendingDirectOrder?.total} />
        <ProductDetailsPage 
          product={selectedProduct} 
          onAddToCart={handleAddToCart} 
          onDirectOrder={handleDirectOrder} 
          onBack={() => { setCurrentPage("home"); setSelectedProduct(null) }} 
          onViewProduct={handleViewProduct}
          allProducts={products}
        />
      </>
    )
  }

  if (currentPage === "shopDetails" && selectedShop) {
    return (
      <ShopDetailsPage 
        shop={selectedShop} 
        shopProducts={shopProducts}
        onBack={() => { setCurrentPage("shops"); setSelectedShop(null) }}
        onViewProduct={handleViewProduct}
      />
    )
  }

  if (currentPage === "agizaChinaDetails" && selectedAgizaChinaCompany) {
    return (
      <AgizaChinaDetailsPage 
        company={selectedAgizaChinaCompany}
        onBack={() => { setCurrentPage("agizaChina"); setSelectedAgizaChinaCompany(null) }}
        onViewProduct={handleViewProduct}
      />
    )
  }

  if (currentPage === "account") {
    return (
      <UserAccountPage 
        user={user} 
        onLogin={(u) => setUser(u)} 
        onLogout={() => setUser(null)} 
        userOrders={userOrders}
        onViewProduct={handleViewProduct}
      />
    )
  }

  // AGIZA CHINA PAGE
  if (currentPage === "agizaChina") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        {/* Desktop Header */}
        {!isMobile && (
          <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
                <div style={{ fontSize: "10px", color: "#999" }}>chimbo la machimbo</div>
              </div>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🏠 Nyumbani</button>
                <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🏪 Machimbo</button>
                <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", color: "#ff6b00" }}>🇨🇳 Agiza China</button>
                <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🛒</span>
                  {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
                  <span style={{ fontSize: "14px" }}>Kikapu</span>
                </div>
                <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  👤 {user ? user.name?.split(" ")[0] : "Akaunti"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
                <div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div>
              </div>
              <div style={{ width: "55%", position: "relative" }}>
                <input type="text" placeholder="🔍 Tafuta..." value={agizaChinaSearchQuery} onChange={e => setAgizaChinaSearchQuery(e.target.value)} style={{ width: "100%", padding: "6px 12px", border: "2px solid #ff6b00", borderRadius: "25px", fontSize: "11px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer" }}>
                  <span>🛒</span>
                  {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
                </div>
                <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  👤
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <h1 style={{ fontSize: "28px", textAlign: "center", marginBottom: "20px" }}>🇨🇳 Agiza Kutoka China</h1>
          {filteredAgizaChina.map(company => (
            <AgizaChinaCard key={company.id} company={company} onClick={() => handleViewAgizaChinaCompany(company)} onViewProduct={handleViewProduct} />
          ))}
        </div>

        {/* Footer */}
        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "40px", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
            <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 }}>
            <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🏠</span>
              <span style={{ fontSize: "9px" }}>Nyumbani</span>
            </button>
            <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🏪</span>
              <span style={{ fontSize: "9px" }}>Machimbo</span>
            </button>
            <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#ff6b00" }}>
              <span style={{ fontSize: "22px" }}>🇨🇳</span>
              <span style={{ fontSize: "9px", fontWeight: "bold" }}>China</span>
            </button>
            <button onClick={() => setShowCart(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", position: "relative", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🛒</span>
              <span style={{ fontSize: "9px" }}>Kikapu</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-4px", right: "2px", background: "#ef4444", color: "white", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
            </button>
          </div>
        )}
      </div>
    )
  }

  // SHOPS PAGE
  if (currentPage === "shops") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        {/* Desktop Header */}
        {!isMobile && (
          <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
                <div style={{ fontSize: "10px", color: "#999" }}>chimbo la machimbo</div>
              </div>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🏠 Nyumbani</button>
                <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", color: "#ff6b00" }}>🏪 Machimbo</button>
                <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🇨🇳 Agiza China</button>
                <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🛒</span>
                  {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
                  <span style={{ fontSize: "14px" }}>Kikapu</span>
                </div>
                <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  👤 {user ? user.name?.split(" ")[0] : "Akaunti"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
                <div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div>
              </div>
              <div style={{ width: "55%", position: "relative" }}>
                <input type="text" placeholder="🔍 Tafuta machimbo..." value={shopSearchQuery} onChange={e => setShopSearchQuery(e.target.value)} style={{ width: "100%", padding: "6px 12px", border: "2px solid #ff6b00", borderRadius: "25px", fontSize: "11px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer" }}>
                  <span>🛒</span>
                  {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
                </div>
                <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  👤
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <h1 style={{ fontSize: "28px", textAlign: "center", marginBottom: "20px" }}>🏪 Machimbo Tanzania</h1>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "20px" }}>
            {filteredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} onClick={() => handleViewShop(shop)} />
            ))}
          </div>
        </div>

        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "40px", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
            <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 }}>
            <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🏠</span>
              <span style={{ fontSize: "9px" }}>Nyumbani</span>
            </button>
            <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#ff6b00" }}>
              <span style={{ fontSize: "22px" }}>🏪</span>
              <span style={{ fontSize: "9px", fontWeight: "bold" }}>Machimbo</span>
            </button>
            <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🇨🇳</span>
              <span style={{ fontSize: "9px" }}>China</span>
            </button>
            <button onClick={() => setShowCart(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", position: "relative", color: "#999" }}>
              <span style={{ fontSize: "22px" }}>🛒</span>
              <span style={{ fontSize: "9px" }}>Kikapu</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-4px", right: "2px", background: "#ef4444", color: "white", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
            </button>
          </div>
        )}
      </div>
    )
  }

  // MAIN HOME PAGE
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <style>{`
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .cart-bounce { animation: bounce 0.5s ease; }
      `}</style>

      {/* Desktop Header */}
      {!isMobile && (
        <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div onClick={() => { setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
              <div style={{ fontSize: "10px", color: "#999" }}>chimbo la machimbo</div>
            </div>
            <div style={{ width: "40%", position: "relative" }}>
              <input type="text" placeholder="🔍 Tafuta bidhaa..." value={productSearchQuery} onChange={e => setProductSearchQuery(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "14px", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", color: "#ff6b00" }}>🏠 Nyumbani</button>
              <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🏪 Machimbo</button>
              <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🇨🇳 Agiza China</button>
              <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🛒</span>
                {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
                <span style={{ fontSize: "14px" }}>Kikapu</span>
              </div>
              <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                👤 {user ? user.name?.split(" ")[0] : "Akaunti"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div onClick={() => { setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
              <div style={{ fontSize: "8px", color: "#999" }}>chimbo la machimbo</div>
            </div>
            <div style={{ width: "55%", position: "relative" }}>
              <input type="text" placeholder="🔍 Tafuta..." value={productSearchQuery} onChange={e => setProductSearchQuery(e.target.value)} style={{ width: "100%", padding: "6px 12px", border: "2px solid #ff6b00", borderRadius: "25px", fontSize: "11px" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div onClick={() => setShowCart(true)} style={{ position: "relative", cursor: "pointer" }}>
                <span className={cartBounce ? "cart-bounce" : ""}>🛒</span>
                {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "8px", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
              </div>
              <button onClick={() => setCurrentPage("account")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                👤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Categories */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(8, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ textAlign: "center", padding: "12px 8px", background: selectedCategory === cat.id ? cat.color : "white", borderRadius: "12px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
              <div style={{ fontSize: isMobile ? "24px" : "32px" }}>{cat.icon}</div>
              <div style={{ fontSize: isMobile ? "10px" : "12px", fontWeight: "bold", color: selectedCategory === cat.id ? "white" : "#333", marginTop: "4px" }}>{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Trending Products */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>🔥</span>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>Bidhaa Zinazoagizwa Sana</h2>
          </div>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
            {trendingProducts.map(product => (
              <div key={product.id} style={{ minWidth: "180px" }}>
                <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "24px" }}>⏱️</span>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>Ulitazama Hivi Karibuni</h2>
            </div>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
              {recentlyViewed.map(product => (
                <div key={product.id} style={{ minWidth: "180px" }}>
                  <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{selectedCategory === "all" ? "✨ Bidhaa Zote" : PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name}</h2>
            <span style={{ fontSize: "13px", color: "#888" }}>{filteredProducts.length} bidhaa</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: "20px" }}>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} onClick={() => handleViewProduct(product)} index={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "60px", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px", lineHeight: "1.6" }}>
            Baizona ni jukwaa la kwanza Tanzania la biashara ya jumla (B2B) kuunganisha wauzaji na wanunuzi. 
            Tunakusaidia kupata bidhaa bora kwa bei nafuu kutoka machimbo na moja kwa moja kutoka China.
          </p>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
          <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
          <button onClick={() => { setCurrentPage("home"); setShowCart(false) }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: currentPage === "home" ? "#ff6b00" : "#999" }}>
            <span style={{ fontSize: "22px" }}>🏠</span>
            <span style={{ fontSize: "9px", fontWeight: currentPage === "home" ? "bold" : "normal" }}>Nyumbani</span>
          </button>
          <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: currentPage === "shops" ? "#ff6b00" : "#999" }}>
            <span style={{ fontSize: "22px" }}>🏪</span>
            <span style={{ fontSize: "9px", fontWeight: currentPage === "shops" ? "bold" : "normal" }}>Machimbo</span>
          </button>
          <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", color: currentPage === "agizaChina" ? "#ff6b00" : "#999" }}>
            <span style={{ fontSize: "22px" }}>🇨🇳</span>
            <span style={{ fontSize: "9px", fontWeight: currentPage === "agizaChina" ? "bold" : "normal" }}>China</span>
          </button>
          <button onClick={() => setShowCart(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", position: "relative", color: showCart ? "#ff6b00" : "#999" }}>
            <span style={{ fontSize: "22px" }}>🛒</span>
            <span style={{ fontSize: "9px" }}>Kikapu</span>
            {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-4px", right: "2px", background: "#ef4444", color: "white", fontSize: "8px", fontWeight: "bold", borderRadius: "50%", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
          </button>
        </div>
      )}
    </div>
  )
}