// src/App.jsx - BAIZONA (FIXED - No Duplicate Declarations)
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
  { id: 1, name: "Viatu vya Sneakers za Kiume", price: 25000, shop: "Alicom Express", category: "viatu", min_order_quantity: 50, bulk_unit: "pair", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", description: "Sneakers za kiume ubora wa juu.", stock: 5000, sold: 2340, sellerPhone: "255712345678" },
  { id: 2, name: "Viatu vya Wanawake (Heels)", price: 35000, shop: "Viatu Bora", category: "viatu", min_order_quantity: 30, bulk_unit: "pair", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", description: "Viatu vya kisasa vya wanawake.", stock: 3000, sold: 1800, sellerPhone: "255712345679" },
  { id: 3, name: "Vitenge vya Kiafrika (Kilio 6)", price: 45000, shop: "Vitenge House", category: "nguo", min_order_quantity: 20, bulk_unit: "kitambaa", image: "https://images.unsplash.com/photo-1565688534246-05d6f5e184e3?w=400", description: "Vitenge vya ubora wa juu.", stock: 8000, sold: 5600, sellerPhone: "255712345680" },
  { id: 4, name: "Jeans za Kiume (PCS 50)", price: 18000, shop: "Jeans Tanzania", category: "nguo", min_order_quantity: 50, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", description: "Jeans za kiume sizes 28-42.", stock: 15000, sold: 8900, sellerPhone: "255712345681" },
  { id: 5, name: "Mchele wa Tanzania (Supremo)", price: 2500, shop: "Mchele Bora", category: "vyakula", min_order_quantity: 500, bulk_unit: "kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400", description: "Mchele wa Tanzania ubora wa juu.", stock: 50000, sold: 35000, sellerPhone: "255712345682" },
  { id: 6, name: "Power Bank 20000mAh", price: 35000, shop: "Tech Tanzania", category: "electronics", min_order_quantity: 20, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1609592424901-8f6ae6b4f0d4?w=400", description: "Power bank ya 20000mAh.", stock: 2000, sold: 1560, sellerPhone: "255712345683" },
  { id: 7, name: "Sabuni za Kioo (Pcs 100)", price: 45000, shop: "Vipodozi Bora", category: "vipodozi", min_order_quantity: 20, bulk_unit: "carton", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400", description: "Sabuni za kioo za kunawiri ngozi.", stock: 8000, sold: 5600, sellerPhone: "255712345684" },
  { id: 8, name: "Sufuria za Alumini (Set 5)", price: 65000, shop: "Vyombo Bora", category: "vifaa_vya_nyumbani", min_order_quantity: 20, bulk_unit: "set", image: "https://images.unsplash.com/photo-1584990347449-b85f6ce4e9e3?w=400", description: "Sufuria za alumini set 5.", stock: 2000, sold: 1450, sellerPhone: "255712345685" },
  { id: 9, name: "Simu za Kusini (Samsung)", price: 250000, shop: "Tech Tanzania", category: "electronics", min_order_quantity: 10, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", description: "Simu za kisasa za Samsung.", stock: 500, sold: 200, sellerPhone: "255712345683" },
  { id: 10, name: "Laptop Dell (Wholesale)", price: 850000, shop: "Tech Tanzania", category: "electronics", min_order_quantity: 5, bulk_unit: "pcs", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400", description: "Laptop Dell za ofisi.", stock: 300, sold: 120, sellerPhone: "255712345683" },
]

const SAMPLE_SHOPS = [
  { id: 1, name: "Alicom Express", owner: "Ali Mwinyi", location: "Kariakoo, Dar es Salaam", category: "Viatu", phone: "255712345678", email: "alicomexpress@baizona.com", since: "2020", rating: 4.8, products: 45, image: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200", description: "Muuzaji mkubwa wa viatu vya jumla Tanzania." },
  { id: 2, name: "Vitenge House", owner: "Fatma Hassan", location: "Kariakoo, Dar es Salaam", category: "Nguo", phone: "255712345680", email: "vitengehouse@baizona.com", since: "2018", rating: 4.9, products: 120, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200", description: "Vitenge vya kisasa na vya kitamaduni." },
  { id: 3, name: "Tech Tanzania", owner: "John Mbowe", location: "Kariakoo, Dar es Salaam", category: "Electronics", phone: "255712345683", email: "techtz@baizona.com", since: "2021", rating: 4.7, products: 60, image: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200", description: "Electronics na gadgets za kisasa." },
  { id: 4, name: "Mchele Bora", owner: "Hamisi Juma", location: "Buguruni, Dar es Salaam", category: "Vyakula", phone: "255712345682", email: "mchelebora@baizona.com", since: "2019", rating: 4.9, products: 25, image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=200", description: "Mchele na vyakula vingine vya jumla." },
  { id: 5, name: "Vipodozi Bora", owner: "Zainabu Rashid", location: "Kariakoo, Dar es Salaam", category: "Vipodozi", phone: "255712345684", email: "vipodozibora@baizona.com", since: "2020", rating: 4.6, products: 80, image: "https://images.unsplash.com/photo-1596462502278-27bfdc7c5e58?w=200", description: "Sabuni, mafuta na vipodozi vingine." },
  { id: 6, name: "Stationary Plus", owner: "Peter John", location: "Posta, Dar es Salaam", category: "Stationary", phone: "255712345687", email: "stationaryplus@baizona.com", since: "2017", rating: 4.8, products: 150, image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200", description: "Vifaa vyote vya shule na ofisi." },
  { id: 7, name: "Vyombo Bora", owner: "Salma Abdallah", location: "Kariakoo, Dar es Salaam", category: "Vifaa vya Nyumbani", phone: "255712345685", email: "vyombobora@baizona.com", since: "2016", rating: 4.7, products: 95, image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=200", description: "Vyombo vya jikoni na vifaa vya nyumbani." },
  { id: 8, name: "Jeans Tanzania", owner: "Richard Mboya", location: "Kariakoo, Dar es Salaam", category: "Nguo", phone: "255712345681", email: "jeanstz@baizona.com", since: "2019", rating: 4.5, products: 55, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200", description: "Jeans za kiume na wanawake." },
]

const SAMPLE_AGIZA_CHINA_COMPANIES = [
  { 
    id: 1, 
    name: "Speed Cargo Tanzania", 
    logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=200",
    location: "Kariakoo, Dar es Salaam",
    since: "2010",
    rating: 4.9,
    phone: "255712345678",
    email: "info@speedcargo.co.tz",
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
      { id: 103, name: "Smart Watch", price: 65000, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200", bulk_unit: "pcs", min_order: 20 },
    ]
  },
  { 
    id: 2, 
    name: "China Link Logistics", 
    logo: "https://images.unsplash.com/photo-1556741533-6e6a3bd8b341?w=200",
    location: "Kariakoo, Dar es Salaam",
    since: "2015",
    rating: 4.8,
    phone: "255712345679",
    email: "info@chinalink.co.tz",
    description: "Wakala wa usafirishaji wa mizigo kutoka China.",
    services: ["Bidhaa sourcing", "Consolidation", "Shipping", "Customs clearance"],
    howItWorks: [
      { step: 1, title: "Chagua Bidhaa", desc: "Tupe link za bidhaa" },
      { step: 2, title: "Tunakupa bei", desc: "Tunakupatia quotation" },
      { step: 3, title: "Tunaagiza", desc: "Tunakulipa na kuagiza" },
      { step: 4, title: "Bidhaa zinafika", desc: "Unapokea bidhaa" }
    ],
    products: [
      { id: 201, name: "Phone Cases (100pcs)", price: 25000, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200", bulk_unit: "box", min_order: 50 },
      { id: 202, name: "USB Cables (50pcs)", price: 15000, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200", bulk_unit: "box", min_order: 30 },
    ]
  },
  { 
    id: 3, 
    name: "Global Procurement Tanzania", 
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    location: "Posta, Dar es Salaam",
    since: "2018",
    rating: 4.7,
    phone: "255712345680",
    email: "info@globalprocurement.co.tz",
    description: "Mtaalamu wa utafutaji na usafirishaji wa bidhaa kutoka China.",
    services: ["Utafutaji wa bidhaa", "Quality control", "Shipping", "Customs clearance"],
    howItWorks: [
      { step: 1, title: "Wasiliana", desc: "Tupe orodha yako" },
      { step: 2, title: "Tunachanganua", desc: "Tunakupatia bei bora" },
      { step: 3, title: "Tunaagiza", desc: "Tunakusaidia kuagiza" },
      { step: 4, title: "Unapokea", desc: "Mzigo unawasili" }
    ],
    products: [
      { id: 301, name: "LED Lights (50pcs)", price: 35000, image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200", bulk_unit: "box", min_order: 20 },
      { id: 302, name: "Solar Panels", price: 120000, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200", bulk_unit: "pcs", min_order: 10 },
    ]
  },
  { 
    id: 4, 
    name: "Tanzania China Freight", 
    logo: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200",
    location: "Kigogo, Dar es Salaam",
    since: "2012",
    rating: 4.9,
    phone: "255712345681",
    email: "info@tzchinafreight.co.tz",
    description: "Usafirishaji wa mizigo kutoka China kwenda Tanzania kwa bei nafuu.",
    services: ["FCL/LCL shipping", "Air freight", "Warehousing", "Door-to-door delivery"],
    howItWorks: [
      { step: 1, title: "Contact us", desc: "Tueleze bidhaa" },
      { step: 2, title: "Get quote", desc: "Tunakupatia quotation" },
      { step: 3, title: "Shipping", desc: "Tunasafirisha mzigo" },
      { step: 4, title: "Receive", desc: "Unapokea bidhaa" }
    ],
    products: [
      { id: 401, name: "Clothes (Bulk)", price: 150000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", bulk_unit: "bale", min_order: 10 },
      { id: 402, name: "Shoes (Wholesale)", price: 250000, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200", bulk_unit: "bale", min_order: 5 },
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

// PRODUCT CARD (Large)
const ProductCard = ({ product, onClick, index }) => (
  <div onClick={onClick} style={{
    background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee",
    cursor: "pointer", transition: "all 0.3s", animation: `fadeInUp 0.4s ease ${index * 0.03}s both`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
     onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
    <div style={{ position: "relative", height: "200px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      <span style={{ position: "absolute", top: "10px", left: "10px", background: "#ff6b00", color: "white", fontSize: "9px", fontWeight: "bold", padding: "3px 8px", borderRadius: "20px" }}>MOQ {product.min_order_quantity}</span>
    </div>
    <div style={{ padding: "12px" }}>
      <div style={{ fontSize: "11px", color: "#ff6b00", marginBottom: "4px" }}>🏪 {product.shop}</div>
      <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#333", margin: "0 0 4px", lineHeight: "1.4", height: "36px", overflow: "hidden" }}>{product.name}</h3>
      <StarRating rating={4.5} reviewCount={Math.floor(product.sold / 10)} />
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "18px", fontWeight: "700", color: "#ff6b00" }}>Tsh {fmt(product.price)}</span>
        <span style={{ fontSize: "10px", color: "#999", marginLeft: "4px" }}>/{product.bulk_unit}</span>
      </div>
    </div>
  </div>
)

// SHOP CARD (Machimbo - No Buttons)
const ShopCard = ({ shop, onClick }) => {
  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
      <div style={{ height: "180px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={shop.image} alt={shop.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: "10px", right: "10px", background: "#ff6b00", color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "20px" }}>
          ⭐ {shop.rating}
        </div>
      </div>
      <div style={{ padding: "15px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>{shop.name}</h3>
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span>📁 {shop.category}</span>
          <span>📍 {shop.location}</span>
        </div>
        <div style={{ fontSize: "12px", color: "#ff6b00", marginBottom: "8px" }}>📦 Bidhaa: {shop.products}</div>
        <div style={{ fontSize: "11px", color: "#888", lineHeight: "1.4" }}>{shop.description.substring(0, 60)}...</div>
      </div>
    </div>
  )
}

// AGIZA CHINA COMPANY CARD (With Products Horizontal)
const AgizaChinaCard = ({ company, onClick, onViewProduct }) => {
  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #eee",
      cursor: "pointer", transition: "all 0.3s", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#ff6b00" }}
       onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#eee" }}>
      
      {/* Company Header */}
      <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", background: "#fafafa" }}>
          <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: 0 }}>{company.name}</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ background: "#f5f5f5", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", color: "#666" }}>⭐ {company.rating}</span>
              <span style={{ background: "#f5f5f5", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", color: "#666" }}>📅 {company.since}</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "5px", display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <span>📍 {company.location}</span>
            <span>📞 {company.phone}</span>
          </div>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px", lineHeight: "1.5" }}>{company.description.substring(0, 100)}...</p>
        </div>
      </div>
      
      {/* Products Horizontal Scroll */}
      <div style={{ padding: "0 20px 20px 20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>📦 Bidhaa Tunazoagiza:</div>
        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
          {company.products.map(product => (
            <div 
              key={product.id} 
              onClick={(e) => { e.stopPropagation(); onViewProduct({ ...product, shop: company.name, sellerPhone: company.phone }) }} 
              style={{ minWidth: "140px", background: "#fafafa", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: "1px solid #eee" }}
            >
              <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "80px", objectFit: "contain" }} />
              </div>
              <div style={{ padding: "8px", background: "white" }}>
                <h4 style={{ fontSize: "11px", fontWeight: "600", color: "#333", margin: "0 0 4px" }}>{product.name.substring(0, 25)}...</h4>
                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
                <div style={{ fontSize: "9px", color: "#888" }}>MOQ: {product.min_order}</div>
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
  const handleCall = () => window.open(`tel:${company.phone}`, "_blank")
  const handleWhatsApp = () => window.open(`https://wa.me/${company.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "10px 20px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>← Rudi kwenye Agiza China</button>
        
        <div style={{ background: "white", borderRadius: "20px", padding: "30px", marginBottom: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "16px", overflow: "hidden", background: "#fafafa" }}>
              <img src={company.logo} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>{company.name}</h1>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>⭐ {company.rating} ★</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📍 {company.location}</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📅 Tangu {company.since}</span>
              </div>
              <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>{company.description}</p>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button onClick={handleWhatsApp} style={{ padding: "12px 24px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>💬 WhatsApp</button>
                <button onClick={handleCall} style={{ padding: "12px 24px", background: "#4facfe", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>📞 Piga Simu</button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#333", marginBottom: "20px" }}>🛠️ Huduma Zetu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {company.services.map((service, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#fafafa", borderRadius: "10px" }}>
                <span style={{ fontSize: "20px" }}>✅</span>
                <span style={{ fontSize: "13px", color: "#555" }}>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background: "white", borderRadius: "16px", padding: "25px", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", color: "#333", marginBottom: "20px" }}>📋 Jinsi Tunavyofanya Kazi</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {company.howItWorks.map((step) => (
              <div key={step.step} style={{ textAlign: "center" }}>
                <div style={{ width: "50px", height: "50px", background: "#ff6b00", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", margin: "0 auto 12px" }}>{step.step}</div>
                <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>{step.title}</h4>
                <p style={{ fontSize: "11px", color: "#666" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "20px" }}>📦 Bidhaa Tunazoagiza</h2>
        <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px" }}>
          {company.products.map(product => (
            <div key={product.id} style={{ minWidth: "200px" }}>
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
  const handleCall = () => window.open(`tel:${shop.phone}`, "_blank")
  const handleWhatsApp = () => window.open(`https://wa.me/${shop.phone}`, "_blank")

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "10px 20px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>← Rudi kwenye Machimbo</button>
        
        <div style={{ background: "white", borderRadius: "16px", padding: "30px", marginBottom: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <div style={{ width: "150px", height: "150px", background: "#fafafa", borderRadius: "12px", overflow: "hidden" }}>
              <img src={shop.image} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "10px" }}>{shop.name}</h1>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "15px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>⭐ {shop.rating} ★</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📁 {shop.category}</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📍 {shop.location}</span>
                <span style={{ fontSize: "13px", color: "#666" }}>📅 Tangu {shop.since}</span>
              </div>
              <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "15px" }}>{shop.description}</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={handleWhatsApp} style={{ padding: "10px 20px", background: "#25D366", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>💬 WhatsApp</button>
                <button onClick={handleCall} style={{ padding: "10px 20px", background: "#4facfe", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>📞 Piga Simu</button>
              </div>
            </div>
          </div>
        </div>
        
        <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "20px" }}>📦 Bidhaa za {shop.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
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
  
  const similarProducts = allProducts.filter(p => p.id !== product.id && (p.category === product.category || p.shop === product.shop)).slice(0, 8)

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <button onClick={onBack} style={{ background: "#eee", border: "none", padding: "10px 20px", borderRadius: "30px", color: "#333", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>← Rudi kwenye Bidhaa</button>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", background: "white", borderRadius: "16px", padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div>
            <div style={{ background: "#fafafa", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "center", minHeight: "400px" }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} />
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: "14px", color: "#ff6b00", marginBottom: "8px" }}>🏪 {product.shop}</div>
            <h1 style={{ fontSize: "28px", color: "#333", marginBottom: "12px" }}>{product.name}</h1>
            <StarRating rating={4.5} reviewCount={Math.floor(product.sold / 10)} />
            
            <div style={{ background: "#f5f5f5", borderRadius: "12px", padding: "20px", margin: "20px 0" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(product.price)}</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>Bei ya jumla / {product.bulk_unit}</div>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ color: "#333", marginBottom: "10px", fontWeight: "bold" }}>📦 Kiasi cha kuagiza:</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - (product.min_order_quantity || 1)))} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontWeight: "bold" }}>-</button>
                <input type="number" value={quantity} onChange={e => setQuantity(Math.max(product.min_order_quantity || 1, parseInt(e.target.value) || 1))} style={{ width: "100px", textAlign: "center", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "white", color: "#333" }} />
                <button onClick={() => setQuantity(quantity + (product.min_order_quantity || 1))} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontWeight: "bold" }}>+</button>
                <span style={{ color: "#666", fontSize: "13px" }}>MOQ: {product.min_order_quantity} {product.bulk_unit}</span>
              </div>
            </div>
            
            <div style={{ background: "#ff6b00", borderRadius: "12px", padding: "15px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", marginBottom: "8px" }}>
                <span>Jumla ya Bidhaa:</span>
                <span style={{ fontWeight: "bold" }}>{quantity} {product.bulk_unit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: "20px", fontWeight: "bold" }}>
                <span>Jumla ya Bei:</span>
                <span>Tsh {fmt(product.price * quantity)}</span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button onClick={() => onAddToCart(product, quantity)} style={{ flex: 1, padding: "14px", background: "#ff6b00", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>🛒 Weka Kikapuni</button>
              <button onClick={() => onDirectOrder(product, quantity)} style={{ flex: 1, padding: "14px", background: "#25D366", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>💬 Agiza WhatsApp</button>
            </div>
            
            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "16px" }}>Maelezo ya Bidhaa</h3>
              <p style={{ color: "#666", lineHeight: "1.6" }}>{product.description}</p>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "20px" }}>🔍 Bidhaa Zinazofanana</h2>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
              {similarProducts.map(similar => (
                <div key={similar.id} style={{ minWidth: "200px" }}>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "20px", maxWidth: "500px", width: "100%", padding: "30px" }}>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>📝 Anza Kuagiza</h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "13px" }}>Tafadhali jaza maelezo yako hapa chini</p>
        
        <div style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#666" }}>Duka:</span>
            <span style={{ color: "#ff6b00", fontWeight: "bold" }}>{sellerName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>Jumla:</span>
            <span style={{ color: "#ff6b00", fontWeight: "bold" }}>Tsh {fmt(total)}</span>
          </div>
        </div>
        
        <input type="text" placeholder="👤 Jina lako kamili" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333" }} />
        <input type="tel" placeholder="📞 Namba ya WhatsApp" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333" }} />
        <textarea placeholder="📍 Anwani yako (Mtaa, Jiji)" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} rows="3" style={{ width: "100%", padding: "14px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #ddd", background: "white", color: "#333", resize: "none" }} />
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "#f5f5f5", border: "none", borderRadius: "10px", color: "#666", cursor: "pointer" }}>Ghairi</button>
          <button onClick={() => onConfirm(customer)} style={{ flex: 1, padding: "12px", background: "#ff6b00", border: "none", borderRadius: "10px", color: "white", fontWeight: "bold", cursor: "pointer" }}>✅ Thibitisha & Agiza</button>
        </div>
      </div>
    </div>
  )
}

// CART PAGE
const CartPage = ({ onClose }) => {
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
        <div style={{ background: "white", padding: "15px 20px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#ff6b00" }}>BAIZONA</div>
            <button onClick={onClose} style={{ background: "#ff6b00", border: "none", padding: "8px 24px", borderRadius: "30px", color: "white", cursor: "pointer" }}>← Rudi</button>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ color: "#333" }}>Kikapu Chako ni Tupu</h2>
          <button onClick={onClose} style={{ marginTop: "20px", padding: "12px 30px", background: "#ff6b00", border: "none", borderRadius: "30px", color: "white", cursor: "pointer" }}>Anza Kununua →</button>
        </div>
      </div>
    )
  }

  const sellerGroups = getGroupedBySeller()

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} onConfirm={handleConfirmOrder} sellerName={pendingOrder?.sellerName} total={pendingOrder?.total} />
      
      <div style={{ background: "white", padding: "15px 20px", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div><div style={{ fontSize: "22px", fontWeight: "bold", color: "#ff6b00" }}>BAIZONA</div><div style={{ fontSize: "10px", color: "#999" }}>Chimbo la Machimbo</div></div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <span style={{ color: "#333" }}>📦 {getTotalItems()} bidhaa</span>
            <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", padding: "8px 20px", borderRadius: "30px", color: "#666", cursor: "pointer" }}>← Endelea Kununua</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px" }}>
          <div>
            <h3 style={{ color: "#333", marginBottom: "20px" }}>🛒 Bidhaa Zako za Jumla</h3>
            {Object.entries(sellerGroups).map(([sellerId, { sellerName, sellerPhone, items: sellerItems }]) => {
              const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0)
              const totalItems = sellerItems.reduce((s, i) => s + i.quantity, 0)
              
              return (
                <div key={sellerId} style={{ background: "white", borderRadius: "16px", marginBottom: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "15px 20px", background: "#fff5eb", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div><span style={{ fontSize: "16px", fontWeight: "bold", color: "#ff6b00" }}>🏪 {sellerName}</span><span style={{ marginLeft: "10px", fontSize: "12px", color: "#888" }}>({totalItems} bidhaa)</span></div>
                    <div style={{ fontSize: "14px", color: "#ff6b00", fontWeight: "bold" }}>Jumla: Tsh {fmt(sellerTotal)}</div>
                  </div>
                  
                  {sellerItems.map(item => (
                    <div key={item.id} style={{ padding: "15px 20px", borderBottom: "1px solid #f5f5f5", display: "flex", gap: "15px", alignItems: "center" }}>
                      <img src={item.image} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#333", fontWeight: "bold", marginBottom: "4px" }}>{item.name}</div>
                        <div style={{ color: "#ff6b00", fontSize: "13px", fontWeight: "bold" }}>Tsh {fmt(item.price)} / {item.unit}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer" }}>-</button>
                        <span style={{ color: "#333", minWidth: "30px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer" }}>+</button>
                        <button onClick={() => removeItem(item.id, item.variant)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                      </div>
                      <div style={{ color: "#333", fontWeight: "bold", minWidth: "100px", textAlign: "right" }}>Tsh {fmt(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  
                  <div style={{ padding: "15px 20px", background: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => handleProceedToOrder(sellerId, sellerName, sellerPhone, sellerItems)} style={{ padding: "10px 24px", background: "#25D366", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                      📱 Agiza Sasa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h3 style={{ color: "#333", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>📦 Jumla ya Agizo</h3>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ color: "#666" }}>Bidhaa ({getTotalItems()})</span><span style={{ color: "#333" }}>Tsh {fmt(getTotalPrice())}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ color: "#666" }}>Delivery</span><span style={{ color: "#10b981" }}>Tsh 0 (Free)</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>Jumla Kuu:</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#ff6b00" }}>Tsh {fmt(getTotalPrice())}</span>
              </div>
              <button onClick={clearCart} style={{ width: "100%", padding: "12px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "12px", color: "#ff4444", cursor: "pointer" }}>🗑️ Futa Kikapu</button>
            </div>
          </div>
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

  const { items, addItem, getTotalItems } = useCartStore()

  // Load recently viewed
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

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = productSearchQuery === "" || 
      p.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
      p.shop?.toLowerCase().includes(productSearchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Filter shops
  const filteredShops = shops.filter(s => {
    return shopSearchQuery === "" || 
      s.name?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      s.location?.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(shopSearchQuery.toLowerCase())
  })

  // Filter Agiza China companies
  const filteredAgizaChina = agizaChinaCompanies.filter(c => {
    return agizaChinaSearchQuery === "" || 
      c.name?.toLowerCase().includes(agizaChinaSearchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(agizaChinaSearchQuery.toLowerCase())
  })

  // Trending products
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

  // Get products for selected shop
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
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#ffffff", minHeight: "100vh" }}>
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "8px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", color: "#666", fontSize: "12px" }}>
            <div style={{ display: "flex", gap: "20px" }}><span>🏪 Baizona.com</span><span>📞 +255 698 656 019</span><span>✉️ info@baizona.com</span></div>
            <div style={{ display: "flex", gap: "20px" }}><span>🇹🇿 Tanzania</span></div>
          </div>
        </div>

        <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "15px 20px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>BAIZONA</div>
              <div style={{ fontSize: "10px", color: "#999", letterSpacing: "1px" }}>CHIMBO LA MACHIMBO</div>
            </div>
            
            <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
              <input 
                type="text" 
                placeholder="🔍 Tafuta kampuni, huduma..." 
                value={agizaChinaSearchQuery}
                onChange={e => setAgizaChinaSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "10px 15px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "13px", outline: "none" }} 
              />
            </div>
            
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontWeight: "500" }}>🏠 Nyumbani</button>
              <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontWeight: "500" }}>🏪 Machimbo</button>
              <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer" }}>🇨🇳 Agiza China</button>
            </div>
            
            <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
              <span style={{ fontSize: "24px" }}>🛒</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
              <div style={{ fontSize: "10px", color: "#666" }}>Kikapu</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <h1 style={{ fontSize: "36px", color: "#333", marginBottom: "10px" }}>🇨🇳 Agiza Kutoka China</h1>
            <p style={{ color: "#666", fontSize: "16px" }}>Kampuni za Tanzania zinazokusaidia kuagiza bidhaa kutoka China</p>
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
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>🇨🇳</div>
              <h3 style={{ color: "#333" }}>Hakuna kampuni zilizopatikana</h3>
            </div>
          )}
        </div>

        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "60px", padding: "40px 0 20px", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona.com - Chimbo la Machimbo Tanzania</p>
        </footer>
      </div>
    )
  }

  // MAIN HOME PAGE
  if (currentPage === "home") {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#ffffff", minHeight: "100vh" }}>
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
          .cart-bounce { animation: bounce 0.5s ease; }
        `}</style>

        <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "8px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", color: "#666", fontSize: "12px" }}>
            <div style={{ display: "flex", gap: "20px" }}><span>🏪 Baizona.com</span><span>📞 +255 698 656 019</span><span>✉️ info@baizona.com</span></div>
            <div style={{ display: "flex", gap: "20px" }}><span>🇹🇿 Tanzania</span></div>
          </div>
        </div>

        <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "15px 20px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>BAIZONA</div>
              <div style={{ fontSize: "10px", color: "#999", letterSpacing: "1px" }}>CHIMBO LA MACHIMBO</div>
            </div>
            
            <div style={{ flex: 1, maxWidth: "500px", position: "relative" }}>
              <input 
                type="text" 
                placeholder="🔍 Tafuta bidhaa, brand, au duka..." 
                value={productSearchQuery}
                onChange={e => setProductSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "12px 18px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "14px", outline: "none" }} 
              />
              <button style={{ position: "absolute", right: "5px", top: "5px", bottom: "5px", background: "#ff6b00", border: "none", padding: "0 20px", borderRadius: "30px", color: "white", cursor: "pointer" }}>🔍 Tafuta</button>
            </div>
            
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer" }}>🏠 Nyumbani</button>
              <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>🏪 Machimbo</button>
              <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>🇨🇳 Agiza China</button>
            </div>
            
            <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
              <span style={{ fontSize: "26px" }} className={cartBounce ? "cart-bounce" : ""}>🛒</span>
              {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
              <div style={{ fontSize: "11px", color: "#666" }}>Kikapu</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
          <h2 style={{ color: "#333", marginBottom: "24px", fontSize: "22px", fontWeight: "bold" }}>📂 Kategoria za Bidhaa</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: selectedCategory === cat.id ? cat.color : "white",
                  borderRadius: "16px", padding: "24px 20px", cursor: "pointer",
                  transition: "all 0.3s ease", textAlign: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: selectedCategory === cat.id ? "none" : "1px solid #eee"
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>{cat.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: selectedCategory === cat.id ? "white" : "#333", marginBottom: "8px" }}>{cat.name}</div>
                <div style={{ fontSize: "12px", color: selectedCategory === cat.id ? "rgba(255,255,255,0.8)" : "#888" }}>{cat.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "28px" }}>🔥</span>
            <h2 style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>Bidhaa Zinazoagizwa Sana</h2>
          </div>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
            {trendingProducts.map(product => (
              <div key={product.id} style={{ minWidth: "200px" }}>
                <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
              </div>
            ))}
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ fontSize: "28px" }}>⏱️</span>
              <h2 style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>Ulitazama Hivi Karibuni</h2>
            </div>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
              {recentlyViewed.map(product => (
                <div key={product.id} style={{ minWidth: "200px" }}>
                  <SmallProductCard product={product} onClick={() => handleViewProduct(product)} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>
              {selectedCategory === "all" ? "✨ Bidhaa Zote" : PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span style={{ color: "#888", fontSize: "14px" }}>📦 {filteredProducts.length} bidhaa</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} onClick={() => handleViewProduct(product)} index={idx} />
            ))}
          </div>
        </div>

        <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "60px", padding: "40px 0 20px", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona.com - Chimbo la Machimbo Tanzania</p>
        </footer>
      </div>
    )
  }

  // SHOPS PAGE
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#ffffff", minHeight: "100vh" }}>
      <div style={{ background: "#fafafa", borderBottom: "1px solid #eee", padding: "8px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", color: "#666", fontSize: "12px" }}>
          <div style={{ display: "flex", gap: "20px" }}><span>🏪 Baizona.com</span><span>📞 +255 698 656 019</span><span>✉️ info@baizona.com</span></div>
          <div style={{ display: "flex", gap: "20px" }}><span>🇹🇿 Tanzania</span></div>
        </div>
      </div>

      <div style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "15px 20px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff6b00" }}>BAIZONA</div>
            <div style={{ fontSize: "10px", color: "#999", letterSpacing: "1px" }}>CHIMBO LA MACHIMBO</div>
          </div>
          
          <div style={{ flex: 1, maxWidth: "500px", position: "relative" }}>
            <input 
              type="text" 
              placeholder="🔍 Tafuta machimbo, duka, brand, au mahali..." 
              value={shopSearchQuery}
              onChange={e => setShopSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "12px 18px", border: "2px solid #ff6b00", borderRadius: "30px", fontSize: "14px", outline: "none" }} 
            />
            <button style={{ position: "absolute", right: "5px", top: "5px", bottom: "5px", background: "#ff6b00", border: "none", padding: "0 20px", borderRadius: "30px", color: "white", cursor: "pointer" }}>🔍 Tafuta</button>
          </div>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <button onClick={() => { setCurrentPage("home"); setSelectedCategory("all"); setProductSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>🏠 Nyumbani</button>
            <button onClick={() => { setCurrentPage("shops"); setShopSearchQuery("") }} style={{ background: "none", border: "none", color: "#ff6b00", fontWeight: "bold", cursor: "pointer" }}>🏪 Machimbo</button>
            <button onClick={() => { setCurrentPage("agizaChina"); setAgizaChinaSearchQuery("") }} style={{ background: "none", border: "none", color: "#333", cursor: "pointer" }}>🇨🇳 Agiza China</button>
          </div>
          
          <div onClick={() => setShowCart(true)} style={{ cursor: "pointer", position: "relative" }}>
            <span style={{ fontSize: "26px" }}>🛒</span>
            {getTotalItems() > 0 && <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#ff6b00", color: "white", fontSize: "10px", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>{getTotalItems()}</span>}
            <div style={{ fontSize: "11px", color: "#666" }}>Kikapu</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <h1 style={{ fontSize: "36px", color: "#333", marginBottom: "10px" }}>🏪 Machimbo Tanzania</h1>
          <p style={{ color: "#666", fontSize: "16px" }}>Wauzaji wa uhakika wa bidhaa za jumla nchini Tanzania</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} onClick={() => handleViewShop(shop)} />
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🏪</div>
            <h3 style={{ color: "#333" }}>Hakuna machimbo yaliyopatikana</h3>
          </div>
        )}
      </div>

      <footer style={{ background: "#1a1a2e", color: "#fff", marginTop: "60px", padding: "40px 0 20px", textAlign: "center" }}>
        <p style={{ color: "#888", fontSize: "12px" }}>© 2024 Baizona.com - Chimbo la Machimbo Tanzania</p>
      </footer>
    </div>
  )
}