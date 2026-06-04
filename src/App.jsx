// src/App.jsx - BAIZONA (FINAL - Mobile Optimized + 3 Columns)
import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { useCartStore } from './stores/cartStore'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// SAMPLE PRODUCTS DATA
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
]

const SAMPLE_SHOPS = [
  { id: 1, name: "Alicom Express", owner: "Ali Mwinyi", location: "Kariakoo, Dar es Salaam", category: "Viatu", phone: "255712345678", since: "2020", rating: 4.8, products: 45, image: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200", description: "Muuzaji mkubwa wa viatu vya jumla Tanzania." },
  { id: 2, name: "Vitenge House", owner: "Fatma Hassan", location: "Kariakoo, Dar es Salaam", category: "Nguo", phone: "255712345680", since: "2018", rating: 4.9, products: 120, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200", description: "Vitenge vya kisasa na vya kitamaduni." },
  { id: 3, name: "Tech Tanzania", owner: "John Mbowe", location: "Kariakoo, Dar es Salaam", category: "Electronics", phone: "255712345683", since: "2021", rating: 4.7, products: 60, image: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200", description: "Electronics na gadgets za kisasa." },
  { id: 4, name: "Mchele Bora", owner: "Hamisi Juma", location: "Buguruni, Dar es Salaam", category: "Vyakula", phone: "255712345682", since: "2019", rating: 4.9, products: 25, image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200", description: "Mchele na vyakula vingine vya jumla." },
  { id: 5, name: "Vipodozi Bora", owner: "Zainabu Rashid", location: "Kariakoo, Dar es Salaam", category: "Vipodozi", phone: "255712345684", since: "2020", rating: 4.6, products: 80, image: "https://images.unsplash.com/photo-1596462502278-27bfdc7c5e58?w=200", description: "Sabuni, mafuta na vipodozi vingine." },
  { id: 6, name: "Stationary Plus", owner: "Peter John", location: "Posta, Dar es Salaam", category: "Stationary", phone: "255712345687", since: "2017", rating: 4.8, products: 150, image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200", description: "Vifaa vyote vya shule na ofisi." },
  { id: 7, name: "Vyombo Bora", owner: "Salma Abdallah", location: "Kariakoo, Dar es Salaam", category: "Vifaa vya Nyumbani", phone: "255712345685", since: "2016", rating: 4.7, products: 95, image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=200", description: "Vyombo vya jikoni na vifaa vya nyumbani." },
  { id: 8, name: "Jeans Tanzania", owner: "Richard Mboya", location: "Kariakoo, Dar es Salaam", category: "Nguo", phone: "255712345681", since: "2019", rating: 4.5, products: 55, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200", description: "Jeans za kiume na wanawake." },
]

const SAMPLE_AGIZA_CHINA_COMPANIES = [
  { 
    id: 1, name: "Speed Cargo Tanzania", logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200",
    location: "Kariakoo, Dar es Salaam", since: "2010", rating: 4.9, phone: "255712345678",
    description: "Wataalamu wa usafirishaji wa bidhaa kutoka China kwenda Tanzania.",
    services: ["Sourcing", "Shipping", "Customs clearance", "Door-to-door delivery"],
    howItWorks: [
      { step: 1, title: "Wasiliana nasi", desc: "Tupe orodha ya bidhaa" },
      { step: 2, title: "Tunakusaidia kununua", desc: "Tunakutafutia bei bora" },
      { step: 3, title: "Tunasafirisha", desc: "Tunaweka mzigo kwenye kontena" },
      { step: 4, title: "Unapokea", desc: "Mzigo unakufikia" }
    ],
    products: [
      { id: 101, name: "Simu za Huawei", price: 180000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200", bulk_unit: "pcs", min_order: 10 },
      { id: 102, name: "Laptop Lenovo", price: 550000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200", bulk_unit: "pcs", min_order: 5 },
    ]
  },
  { 
    id: 2, name: "China Link Logistics", logo: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200",
    location: "Kariakoo, Dar es Salaam", since: "2015", rating: 4.8, phone: "255712345679",
    description: "Wakala wa usafirishaji wa mizigo kutoka China.",
    services: ["Bidhaa sourcing", "Consolidation", "Shipping", "Customs clearance"],
    howItWorks: [
      { step: 1, title: "Chagua Bidhaa", desc: "Tupe link za bidhaa" },
      { step: 2, title: "Tunakupa bei", desc: "Tunakupatia quotation" },
      { step: 3, title: "Tunaagiza", desc: "Tunakulipa na kuagiza" },
      { step: 4, title: "Bidhaa zinafika", desc: "Unapokea bidhaa" }
    ],
    products: [
      { id: 201, name: "Phone Cases", price: 25000, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200", bulk_unit: "box", min_order: 50 },
      { id: 202, name: "USB Cables", price: 15000, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200", bulk_unit: "box", min_order: 30 },
    ]
  },
]

const PRODUCT_CATEGORIES = [
  { id: "all", name: "Bidhaa Zote", icon: "🏭", color: "#ff6b00", description: "Bidhaa zote za jumla" },
  { id: "viatu", name: "Viatu", icon: "👟", color: "#667eea", description: "Viatu vya wanawake, wanaume na watoto" },
  { id: "nguo", name: "Nguo", icon: "👗", color: "#f093fb", description: "Vitenge, Jeans, T-shirts, Kanga" },
  { id: "vyakula", name: "Vyakula", icon: "🍎", color: "#43e97b", description: "Mchele, Maharage, Unga, Mafuta" },
  { id: "stationary", name: "Stationary", icon: "✏️", color: "#a18cd1", description: "Madaftari, Kalamu, Rula" },
  { id: "vifaa_vya_nyumbani", name: "Vifaa vya Nyumbani", icon: "🏠", color: "#fa709a", description: "Sufuria, Vikombe, Taulo" },
  { id: "electronics", name: "Electronics", icon: "📱", color: "#4facfe", description: "Power bank, Speaker, Gadgets" },
  { id: "vipodozi", name: "Vipodozi", icon: "💄", color: "#ff9a9e", description: "Sabuni, Mafuta ya Nazi, Cream" },
]

const fmt = (n) => Number(n || 0).toLocaleString()

const vibrate = () => { if (window.navigator?.vibrate) window.navigator.vibrate(50) }

const showToast = (msg, type = "success") => {
  const toast = document.createElement("div")
  toast.textContent = msg
  Object.assign(toast.style, {
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    background: type === "success" ? "#10b981" : "#ef4444", color: "white",
    padding: "12px 24px", borderRadius: "50px", zIndex: 10000,
    fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap"
  })
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2500)
}

// Star Rating Component
const StarRating = ({ rating = 4.5, reviewCount = 128 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <div style={{ display: "flex", gap: "2px" }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < Math.floor(rating) ? "#ffc107" : "#ddd", fontSize: "12px" }}>{i < Math.floor(rating) ? "★" : "☆"}</span>
      ))}
    </div>
    <span style={{ fontSize: "10px", color: "#888" }}>({reviewCount})</span>
  </div>
)

// SMALL PRODUCT CARD
const SmallProductCard = ({ product, onClick }) => (
  <div onClick={onClick} style={{
    background: "white", borderRadius: "10px", overflow: "hidden", border: "1px solid #eee",
    cursor: "pointer", transition: "all 0.3s", minWidth: "160px"
  }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)" }}
     onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
    <div style={{ height: "100px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
    </div>
    <div style={{ padding: "8px" }}>
      <h4 style={{ fontSize: "11px", fontWeight: "600", color: "#333", margin: "0 0 4px" }}>{product.name.substring(0, 30)}...</h4>
      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
      <div style={{ fontSize: "9px", color: "#888" }}>MOQ: {product.min_order}</div>
    </div>
  </div>
)

// PRODUCT CARD (Large - 3 columns on mobile)
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
      cursor: "pointer", transition: "all 0.3s", animation: `fadeInUp 0.4s ease ${index * 0.03}s both`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
      <div style={{ position: "relative", height: isMobile ? "140px" : "200px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        <span style={{ position: "absolute", top: "6px", left: "6px", background: "#ff6b00", color: "white", fontSize: isMobile ? "8px" : "9px", fontWeight: "bold", padding: "2px 6px", borderRadius: "20px" }}>MOQ {product.min_order_quantity}</span>
      </div>
      <div style={{ padding: isMobile ? "8px" : "12px" }}>
        <div style={{ fontSize: isMobile ? "9px" : "11px", color: "#ff6b00", marginBottom: "3px" }}>🏪 {product.shop}</div>
        <h3 style={{ fontSize: isMobile ? "11px" : "13px", fontWeight: "600", color: "#333", margin: "0 0 4px", lineHeight: "1.3", height: isMobile ? "28px" : "36px", overflow: "hidden" }}>{product.name}</h3>
        <StarRating rating={4.5} reviewCount={Math.floor(product.sold / 10)} />
        <div style={{ marginTop: "6px" }}>
          <span style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: "700", color: "#ff6b00" }}>Tsh {fmt(product.price)}</span>
          <span style={{ fontSize: isMobile ? "8px" : "10px", color: "#999", marginLeft: "4px" }}>/{product.bulk_unit}</span>
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
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
      <div style={{ height: isMobile ? "140px" : "180px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={shop.image} alt={shop.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: "8px", right: "8px", background: "#ff6b00", color: "white", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "20px" }}>⭐ {shop.rating}</div>
      </div>
      <div style={{ padding: "12px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>{shop.name}</h3>
        <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span>📁 {shop.category}</span>
          <span>📍 {shop.location.split(",")[0]}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#ff6b00", marginBottom: "6px" }}>📦 Bidhaa: {shop.products}</div>
        <div style={{ fontSize: "10px", color: "#888", lineHeight: "1.3" }}>{shop.description.substring(0, 50)}...</div>
      </div>
    </div>
  )
}

// AGIZA CHINA COMPANY CARD
const AgizaChinaCard = ({ company, onClick, onViewProduct }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
      
      <div style={{ padding: "16px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <div style={{ width: isMobile ? "60px" : "80px", height: isMobile ? "60px" : "80px", borderRadius: "12px", overflow: "hidden", background: "#fafafa" }}>
          <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "bold", color: "#333", margin: 0 }}>{company.name}</h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ background: "#f5f5f5", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", color: "#666" }}>⭐ {company.rating}</span>
              <span style={{ background: "#f5f5f5", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", color: "#666" }}>📅 {company.since}</span>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span>📍 {company.location}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#666", marginTop: "8px", lineHeight: "1.4" }}>{company.description.substring(0, isMobile ? 80 : 100)}...</p>
        </div>
      </div>
      
      {/* Products Horizontal Scroll */}
      <div style={{ padding: "0 16px 16px 16px" }}>
        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>📦 Bidhaa Tunazoagiza:</div>
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          {company.products.map(product => (
            <div 
              key={product.id} 
              onClick={(e) => { e.stopPropagation(); onViewProduct({ ...product, shop: company.name, sellerPhone: company.phone }) }} 
              style={{ minWidth: "130px", background: "#fafafa", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: "1px solid #eee" }}
            >
              <div style={{ height: "90px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "70px", objectFit: "contain" }} />
              </div>
              <div style={{ padding: "6px", background: "white" }}>
                <h4 style={{ fontSize: "10px", fontWeight: "600", color: "#333", margin: "0 0 3px" }}>{product.name.substring(0, 20)}...</h4>
                <div style={{ fontSize: "10px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
                <div style={{ fontSize: "8px", color: "#888" }}>MOQ: {product.min_order}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// AGIZA CHINA COMPANY DETAILS PAGE
const AgizaChinaDetailsPage = ({ company, onBack, onViewProduct }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCall = () => window.open(`tel:${company.phone}`, "_blank")
  const handleWhatsApp = () => window.open(`https://wa.me/${company.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold", fontSize: "13px" }}>← Rudi</button>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: isMobile ? "80px" : "120px", height: isMobile ? "80px" : "120px", borderRadius: "16px", overflow: "hidden", background: "#fafafa" }}>
              <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: isMobile ? "20px" : "28px", color: "#333", marginBottom: "8px" }}>{company.name}</h1>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>⭐ {company.rating} ★</span>
                <span style={{ fontSize: "12px", color: "#666" }}>📍 {company.location}</span>
                <span style={{ fontSize: "12px", color: "#666" }}>📅 Tangu {company.since}</span>
              </div>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5", marginBottom: "15px" }}>{company.description}</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={handleWhatsApp} style={{ padding: "10px 20px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>💬 WhatsApp</button>
                <button onClick={handleCall} style={{ padding: "10px 20px", background: "#4facfe", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>📞 Piga Simu</button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", color: "#333", marginBottom: "12px" }}>🛠️ Huduma Zetu</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "10px" }}>
            {company.services.map((service, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", background: "#fafafa", borderRadius: "8px" }}>
                <span style={{ fontSize: "16px" }}>✅</span>
                <span style={{ fontSize: "12px", color: "#555" }}>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", color: "#333", marginBottom: "12px" }}>📋 Jinsi Tunavyofanya Kazi</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "15px" }}>
            {company.howItWorks.map((step) => (
              <div key={step.step} style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", background: "#ff6b00", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", margin: "0 auto 8px" }}>{step.step}</div>
                <h4 style={{ fontSize: "12px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>{step.title}</h4>
                <p style={{ fontSize: "10px", color: "#666" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <h2 style={{ color: "#333", fontSize: "16px", marginBottom: "12px" }}>📦 Bidhaa Tunazoagiza</h2>
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "15px" }}>
          {company.products.map(product => (
            <div key={product.id} style={{ minWidth: "160px" }}>
              <SmallProductCard product={product} onClick={() => onViewProduct({ ...product, shop: company.name, sellerPhone: company.phone })} />
            </div>
          ))}
        </div>
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

  const handleCall = () => window.open(`tel:${shop.phone}`, "_blank")
  const handleWhatsApp = () => window.open(`https://wa.me/${shop.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold", fontSize: "13px" }}>← Rudi</button>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: isMobile ? "80px" : "150px", height: isMobile ? "80px" : "150px", background: "#fafafa", borderRadius: "12px", overflow: "hidden" }}>
              <img src={shop.image} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: isMobile ? "20px" : "28px", color: "#333", marginBottom: "8px" }}>{shop.name}</h1>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>⭐ {shop.rating} ★</span>
                <span style={{ fontSize: "12px", color: "#666" }}>📁 {shop.category}</span>
                <span style={{ fontSize: "12px", color: "#666" }}>📍 {shop.location}</span>
              </div>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5", marginBottom: "15px" }}>{shop.description}</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={handleWhatsApp} style={{ padding: "10px 20px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>💬 WhatsApp</button>
                <button onClick={handleCall} style={{ padding: "10px 20px", background: "#4facfe", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>📞 Piga Simu</button>
              </div>
            </div>
          </div>
        </div>
        
        <h2 style={{ color: "#333", fontSize: "16px", marginBottom: "12px" }}>📦 Bidhaa za {shop.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "20px" }}>
          {shopProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => onViewProduct(product)} index={0} />
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
  
  const similarProducts = allProducts.filter(p => p.id !== product.id && (p.category === product.category || p.shop === product.shop)).slice(0, 8)

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "8px 16px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "16px", fontWeight: "bold", fontSize: "13px" }}>← Rudi</button>
        
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div>
            <div style={{ background: "#fafafa", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "center", minHeight: isMobile ? "250px" : "400px" }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: "13px", color: "#ff6b00", marginBottom: "6px" }}>🏪 {product.shop}</div>
            <h1 style={{ fontSize: isMobile ? "22px" : "28px", color: "#333", marginBottom: "10px" }}>{product.name}</h1>
            <StarRating rating={4.5} reviewCount={Math.floor(product.sold / 10)} />
            
            <div style={{ background: "#f5f5f5", borderRadius: "12px", padding: "15px", margin: "15px 0" }}>
              <div style={{ fontSize: isMobile ? "28px" : "32px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Bei ya jumla / {product.bulk_unit}</div>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <div style={{ color: "#333", marginBottom: "8px", fontWeight: "bold", fontSize: "13px" }}>📦 Kiasi cha kuagiza:</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - (product.min_order_quantity || 1)))} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontWeight: "bold" }}>-</button>
                <input type="number" value={quantity} onChange={e => setQuantity(Math.max(product.min_order_quantity || 1, parseInt(e.target.value) || 1))} style={{ width: "80px", textAlign: "center", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", background: "white", color: "#333" }} />
                <button onClick={() => setQuantity(quantity + (product.min_order_quantity || 1))} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontWeight: "bold" }}>+</button>
                <span style={{ color: "#666", fontSize: "12px" }}>MOQ: {product.min_order_quantity} {product.bulk_unit}</span>
              </div>
            </div>
            
            <div style={{ background: "#ff6b00", borderRadius: "12px", padding: "12px", marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", marginBottom: "5px", fontSize: "13px" }}>
                <span>Jumla ya Bidhaa:</span>
                <span style={{ fontWeight: "bold" }}>{quantity} {product.bulk_unit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: "18px", fontWeight: "bold" }}>
                <span>Jumla ya Bei:</span>
                <span>Tsh {fmt(product.price * quantity)}</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={() => onAddToCart(product, quantity)} style={{ flex: 1, padding: "12px", background: "#ff6b00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>🛒 Weka Kikapuni</button>
              <button onClick={() => onDirectOrder(product, quantity)} style={{ flex: 1, padding: "12px", background: "#25D366", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>💬 Agiza WhatsApp</button>
            </div>
            
            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
              <h3 style={{ color: "#333", marginBottom: "8px", fontSize: "14px" }}>Maelezo ya Bidhaa</h3>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5" }}>{product.description}</p>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#333", fontSize: "16px", marginBottom: "12px" }}>🔍 Bidhaa Zinazofanana</h2>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
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
        <h2 style={{ color: "#333", marginBottom: "8px", fontSize: "20px" }}>📝 Anza Kuagiza</h2>
        <p style={{ color: "#666", marginBottom: "16px", fontSize: "12px" }}>Tafadhali jaza maelezo yako hapa chini</p>
        
        <div style={{ marginBottom: "16px", padding: "12px", background: "#f5f5f5", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "13px" }}>
            <span style={{ color: "#666" }}>Duka:</span>
            <span style={{ color: "#ff6b00", fontWeight: "bold" }}>{sellerName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span style={{ color: "#666" }}>Jumla:</span>
            <span style={{ color: "#ff6b00", fontWeight: "bold" }}>Tsh {fmt(total)}</span>
          </div>
        </div>
        
        <input type="text" placeholder="👤 Jina lako kamili" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333", fontSize: "14px" }} />
        <input type="tel" placeholder="📞 Namba ya WhatsApp" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333", fontSize: "14px" }} />
        <textarea placeholder="📍 Anwani yako (Mtaa, Jiji)" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} rows="3" style={{ width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333", fontSize: "14px", resize: "none" }} />
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f5f5f5", border: "none", borderRadius: "10px", color: "#666", cursor: "pointer", fontWeight: "bold" }}>Ghairi</button>
          <button onClick={() => onConfirm(customer)} style={{ flex: 1, padding: "10px", background: "#ff6b00", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer" }}>✅ Thibitisha</button>
        </div>
      </div>
    </div>
  )
}

// CART PAGE
const CartPage = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, getGroupedBySeller, clearCart } = useCartStore()
  const [showCheckoutModal, setShowCheckoutModal] = useState(null)
  const [pendingOrder, setPendingOrder] = useState(null)

  const handleProceedToOrder = (sellerId, sellerName, sellerPhone, sellerItems) => {
    const total = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0)
    setPendingOrder({ sellerId, sellerName, sellerPhone, sellerItems, total })
    setShowCheckoutModal(true)
  }

  const handleConfirmOrder = (customer) => {
    if (!customer.name || !customer.phone) {
      showToast("❌ Tafadhali jaza jina na namba ya simu!", "error")
      return
    }
    
    const { sellerName, sellerPhone, sellerItems, total } = pendingOrder
    const itemList = sellerItems.map(i => `• ${i.name} x${i.quantity} = Tsh ${fmt(i.price * i.quantity)}`).join("\n")
    
    const message = `🏪 *AGIZO KUTOKA BAIZONA - CHIMBO LA MACHIMBO*\n\n` +
      `*Duka:* ${sellerName}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*BIDHAA ZILIZOAGIZWA:*\n${itemList}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*JUMLA:* Tsh ${fmt(total)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*MAELEZO YA MNUNUZI:*\n` +
      `👤 *Jina:* ${customer.name}\n` +
      `📞 *Simu:* ${customer.phone}\n` +
      `📍 *Anwani:* ${customer.address || "Hajajaza anwani"}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Asante kwa kununua kwa jumla! 🙏`
    
    window.open(`https://wa.me/${sellerPhone || "255700000000"}?text=${encodeURIComponent(message)}`, "_blank")
    showToast(`✅ Agizo lako limetumwa kwa ${sellerName}!`, "success")
    setShowCheckoutModal(false)
    setPendingOrder(null)
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <div style={{ background: "white", padding: "12px 16px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
            <button onClick={onClose} style={{ background: "#ff6b00", border: "none", padding: "6px 20px", borderRadius: "30px", color: "white", cursor: "pointer", fontSize: "13px" }}>← Rudi</button>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛒</div>
          <h2 style={{ color: "#333", fontSize: "18px" }}>Kikapu Chako ni Tupu</h2>
          <button onClick={onClose} style={{ marginTop: "16px", padding: "10px 30px", background: "#ff6b00", border: "none", borderRadius: "30px", color: "white", cursor: "pointer" }}>Anza Kununua →</button>
        </div>
      </div>
    )
  }

  const sellerGroups = getGroupedBySeller()

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onConfirm={handleConfirmOrder} sellerName={pendingOrder?.sellerName} total={pendingOrder?.total} />
      
      <div style={{ background: "white", padding: "12px 16px", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div><div style={{ fontSize: "18px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div><div style={{ fontSize: "9px", color: "#999" }}>chimbo la machimbo</div></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ color: "#333", fontSize: "13px" }}>📦 {getTotalItems()} bidhaa</span>
            <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", padding: "6px 16px", borderRadius: "30px", color: "#666", cursor: "pointer", fontSize: "12px" }}>← Rudi</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 350px", gap: "20px" }}>
          <div>
            <h3 style={{ color: "#333", marginBottom: "16px", fontSize: "16px" }}>🛒 Bidhaa Zako</h3>
            {Object.entries(sellerGroups).map(([sellerId, { sellerName, sellerPhone, items: sellerItems }]) => {
              const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0)
              const totalItems = sellerItems.reduce((s, i) => s + i.quantity, 0)
              
              return (
                <div key={sellerId} style={{ background: "white", borderRadius: "16px", marginBottom: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "12px 16px", background: "#fff5eb", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div><span style={{ fontSize: "14px", fontWeight: "bold", color: "#ff6b00" }}>🏪 {sellerName}</span><span style={{ marginLeft: "8px", fontSize: "11px", color: "#888" }}>({totalItems})</span></div>
                    <div style={{ fontSize: "13px", color: "#ff6b00", fontWeight: "bold" }}>Tsh {fmt(sellerTotal)}</div>
                  </div>
                  
                  {sellerItems.map(item => (
                    <div key={item.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: "12px", alignItems: "center" }}>
                      <img src={item.image} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#333", fontWeight: "bold", fontSize: "13px", marginBottom: "2px" }}>{item.name}</div>
                        <div style={{ color: "#ff6b00", fontSize: "12px", fontWeight: "bold" }}>Tsh {fmt(item.price)} / {item.unit}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer" }}>-</button>
                        <span style={{ color: "#333", minWidth: "25px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer" }}>+</button>
                        <button onClick={() => removeItem(item.id, item.variant)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "16px" }}>🗑️</button>
                      </div>
                      <div style={{ color: "#333", fontWeight: "bold", minWidth: "80px", textAlign: "right", fontSize: "13px" }}>Tsh {fmt(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  
                  <div style={{ padding: "12px 16px", background: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => handleProceedToOrder(sellerId, sellerName, sellerPhone, sellerItems)} style={{ padding: "8px 20px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                      📱 Agiza Sasa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          
          {!isMobile && (
            <div style={{ position: "sticky", top: "100px" }}>
              <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ color: "#333", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>📦 Jumla ya Agizo</h3>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Bidhaa ({getTotalItems()})</span><span style={{ color: "#333" }}>Tsh {fmt(getTotalPrice())}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span style={{ color: "#666" }}>Delivery</span><span style={{ color: "#10b981" }}>Tsh 0 (Free)</span></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>Jumla Kuu:</span>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(getTotalPrice())}</span>
                </div>
                <button onClick={clearCart} style={{ width: "100%", padding: "10px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "12px", color: "#ff4444", cursor: "pointer" }}>🗑️ Futa Kikapu</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// MAIN APP
export default function App() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [shops, setShops] = useState(SAMPLE_SHOPS)
  const [agizaChinaCompanies, setAgizaChinaCompanies] = useState(SAMPLE_AGIZA_CHINA_COMPANIES)
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { items, addItem, getTotalItems } = useCartStore()

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
    const matchesSearch = productSearchQuery === "" || 
      p.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      p.shop?.toLowerCase().includes(productSearchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredShops = shops.filter(s => {
    return shopSearchQuery === "" || 
      s.name?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      s.location?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(shopSearchQuery.toLowerCase())
  })

  const filteredAgizaChina = agizaChinaCompanies.filter(c => {
    return agizaChinaSearchQuery === "" || 
      c.name?.toLowerCase().includes(agizaChinaSearchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(agizaChinaSearchQuery.toLowerCase())
  })

  const trendingProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8)

  const handleAddToCart = (product, quantity = 1) => {
    vibrate()
    addItem({
      id: product.id, name: product.name, price: product.price, quantity: quantity,
      image: product.image, sellerName: product.shop, sellerPhone: product.sellerPhone || "255700000000",
      unit: product.bulk_unit, min_order_quantity: product.min_order_quantity
    })
    showToast(`✅ ${product.name} imeongezwa kwenye kikapu!`)
    setCurrentPage("home")
  }

  const handleDirectOrder = (product, quantity) => {
    const total = product.price * quantity
    setPendingDirectOrder({ product, quantity, total })
    setShowCheckoutModal(true)
  }

  const handleConfirmDirectOrder = (customer) => {
    if (!customer.name || !customer.phone) {
      showToast("❌ Tafadhali jaza jina na namba ya simu!", "error")
      return
    }
    
    const { product, quantity, total } = pendingDirectOrder
    const message = `🏪 *AGIZO KUTOKA BAIZONA - CHIMBO LA MACHIMBO*\n\n` +
      `*Bidhaa:* ${product.name}\n` +
      `*Duka:* ${product.shop}\n` +
      `*Kiasi:* ${quantity} ${product.bulk_unit}\n` +
      `*Bei kwa kipande:* Tsh ${fmt(product.price)}\n` +
      `*Jumla:* Tsh ${fmt(total)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*MAELEZO YA MNUNUZI:*\n` +
      `👤 *Jina:* ${customer.name}\n` +
      `📞 *Simu:* ${customer.phone}\n` +
      `📍 *Anwani:* ${customer.address || "Hajajaza anwani"}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Asante kwa kununua kwa jumla! 🙏`
    
    window.open(`https://wa.me/${product.sellerPhone || "255700000000"}?text=${encodeURIComponent(message)}`, "_blank")
    showToast(`✅ Agizo lako limetumwa kwa ${product.shop}!`, "success")
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

  // AGIZA CHINA PAGE
  if (currentPage === "agizaChina") {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
              <div style={{ fontSize: "8px", color: "#999", letterSpacing: "0.5px" }}>chimbo la machimbo</div>
            </div>
            
            <div style={{ flex: 1, maxWidth: isMobile ? "200px" : "400px", position: "relative" }}>
              <input 
                type="text" 
                placeholder="🔍 Tafuta kampuni..." 
                value={agizaChinaSearchQuery}
                onChange={e => setAgizaChinaSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "12px", outline: "none" }} 
              />
            </div>
            
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🏠</button>
              <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🏪</button>
              <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>🇨🇳</button>
            </div>
            
            <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
              <span style={{ fontSize: "20px" }}>🛒</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "9px", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1 style={{ fontSize: isMobile ? "24px" : "36px", color: "#333", marginBottom: "5px" }}>🇨🇳 Agiza Kutoka China</h1>
            <p style={{ color: "#666", fontSize: isMobile ? "12px" : "14px" }}>Kampuni za Tanzania zinazokusaidia kuagiza bidhaa kutoka China</p>
          </div>

          {filteredAgizaChina.map(company => (
            <AgizaChinaCard 
              key={company.id} 
              company={company} 
              onClick={() => handleViewAgizaChinaCompany(company)}
              onViewProduct={handleViewProduct}
            />
          ))}

          {filteredAgizaChina.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "50px", marginBottom: "16px" }}>🇨🇳</div>
              <h3 style={{ color: "#333" }}>Hakuna kampuni zilizopatikana</h3>
            </div>
          )}
        </div>

        {/* Footer with contacts */}
        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "40px", padding: "30px 16px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>📞 +255 698 656 019</p>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
            <p style={{ color: "#888", fontSize: "11px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
          </div>
        </footer>
      </div>
    )
  }

  // SHOPS PAGE
  if (currentPage === "shops") {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
              <div style={{ fontSize: "8px", color: "#999", letterSpacing: "0.5px" }}>chimbo la machimbo</div>
            </div>
            
            <div style={{ flex: 1, maxWidth: isMobile ? "200px" : "500px", position: "relative" }}>
              <input 
                type="text" 
                placeholder="🔍 Tafuta machimbo..." 
                value={shopSearchQuery}
                onChange={e => setShopSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "12px", outline: "none" }} 
              />
            </div>
            
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🏠</button>
              <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>🏪</button>
              <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🇨🇳</button>
            </div>
            
            <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
              <span style={{ fontSize: "20px" }}>🛒</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "9px", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1 style={{ fontSize: isMobile ? "24px" : "36px", color: "#333", marginBottom: "5px" }}>🏪 Machimbo Tanzania</h1>
            <p style={{ color: "#666", fontSize: isMobile ? "12px" : "14px" }}>Wauzaji wa uhakika wa bidhaa za jumla</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "12px" }}>
            {filteredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} onClick={() => handleViewShop(shop)} />
            ))}
          </div>

          {filteredShops.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "50px", marginBottom: "16px" }}>🏪</div>
              <h3 style={{ color: "#333" }}>Hakuna machimbo yaliyopatikana</h3>
            </div>
          )}
        </div>

        {/* Footer with contacts */}
        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "40px", padding: "30px 16px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>📞 +255 698 656 019</p>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
            <p style={{ color: "#888", fontSize: "11px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
          </div>
        </footer>
      </div>
    )
  }

  // MAIN HOME PAGE
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        .cart-bounce { animation: bounce 0.5s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
          <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", color: "#ff6b00" }}>Baizona</div>
            <div style={{ fontSize: "8px", color: "#999", letterSpacing: "0.5px" }}>chimbo la machimbo</div>
          </div>
          
          <div style={{ flex: 1, maxWidth: isMobile ? "200px" : "500px", position: "relative" }}>
            <input 
              type="text" 
              placeholder="🔍 Tafuta bidhaa..." 
              value={productSearchQuery}
              onChange={e => setProductSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "12px", outline: "none" }} 
            />
          </div>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>🏠</button>
            <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🏪</button>
            <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "12px" }}>🇨🇳</button>
          </div>
          
          <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
            <span style={{ fontSize: "20px" }} className={cartBounce ? "cart-bounce" : ""}>🛒</span>
            {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "9px", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        {/* Categories */}
        <h2 style={{ color: "#333", marginBottom: "12px", fontSize: "16px", fontWeight: "bold" }}>📂 Kategoria za Bidhaa</h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? cat.color : "white",
                borderRadius: "12px", padding: "12px 8px", cursor: "pointer",
                transition: "all 0.3s ease", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                border: selectedCategory === cat.id ? "none" : "1px solid #eee"
              }}
            >
              <div style={{ fontSize: isMobile ? "28px" : "48px", marginBottom: "4px" }}>{cat.icon}</div>
              <div style={{ fontSize: isMobile ? "10px" : "18px", fontWeight: "bold", color: selectedCategory === cat.id ? "white" : "#333" }}>{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Trending Products */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "20px" }}>🔥</span>
            <h2 style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>Bidhaa Zinazoagizwa Sana</h2>
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {trendingProducts.map(product => (
              <div key={product.id} style={{ minWidth: "160px" }}>
                <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>⏱️</span>
              <h2 style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>Ulitazama Hivi Karibuni</h2>
            </div>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {recentlyViewed.map(product => (
                <div key={product.id} style={{ minWidth: "160px" }}>
                  <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Products - 3 columns on mobile */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>
              {selectedCategory === "all" ? "✨ Bidhaa Zote" : PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span style={{ color: "#888", fontSize: "11px" }}>{filteredProducts.length} bidhaa</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: "10px" }}>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} onClick={() => handleViewProduct(product)} index={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer with contacts */}
      <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "40px", padding: "30px 16px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>📞 +255 698 656 019</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>✉️ baizonagroup@gmail.com</p>
          <p style={{ color: "#888", fontSize: "11px" }}>© 2024 Baizona - chimbo la machimbo Tanzania</p>
        </div>
      </footer>
    </div>
  )
}