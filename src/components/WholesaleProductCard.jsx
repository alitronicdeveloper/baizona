// src/components/WholesaleProductCard.jsx
import { useState } from 'react'
import { VariantSelector } from './VariantSelector'
import { useCartStore } from '../stores/cartStore'

export const WholesaleProductCard = ({ product, seller }) => {
  const [quantity, setQuantity] = useState(product.min_order_quantity || 50)
  const [selectedVariants, setSelectedVariants] = useState({})
  const addToCart = useCartStore((state) => state.addItem)
  
  const quickQuantities = [50, 100, 200, 500]

  const handleAddToCart = () => {
    // Check if variants are required
    if (product.variants && product.variants.length > 0) {
      const allSelected = product.variants.every(v => selectedVariants[v.type])
      if (!allSelected) {
        alert('Tafadhali chagua rangi na ukubwa wote!')
        return
      }
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || product.image,
      sellerId: seller?.id,
      sellerName: seller?.shop_name || product.shop,
      sellerPhone: seller?.whatsapp || seller?.phone,
      variant: JSON.stringify(selectedVariants),
      variantDisplay: Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', '),
      unit: product.bulk_unit || 'pcs',
      minOrder: product.min_order_quantity
    })
    
    // Show success message
    const toast = document.createElement('div')
    toast.innerHTML = `
      <div style="position: fixed; top: 80px; right: 20px; background: #10b981; color: white; padding: 12px 20px; border-radius: 12px; z-index: 9999; animation: slideIn 0.3s ease;">
        🛒 ${product.name} imeongezwa kwenye kikapu!
      </div>
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const totalPrice = product.price * quantity

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
      transition: "all 0.2s"
    }}>
      
      {/* Badge ya Aina ya Bidhaa */}
      <div style={{
        background: "#f59e0b",
        color: "white",
        padding: "4px 12px",
        fontSize: "11px",
        fontWeight: "bold",
        display: "inline-block",
        margin: "10px 0 0 10px",
        borderRadius: "20px"
      }}>
        🏭 JUMLA (MOQ: {product.min_order_quantity} {product.bulk_unit})
      </div>

      {/* Picha */}
      <div style={{ height: "200px", overflow: "hidden", cursor: "pointer", position: "relative" }}>
        <img 
          src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500"} 
          alt={product.name} 
          style={{ width: "100%", height: "100%", objectFit: "contain", background: "#f8fafc" }} 
        />
      </div>
      
      {/* Maelezo */}
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", background: "#eef2ff", color: "#6366f1", padding: "4px 10px", borderRadius: "8px", fontWeight: "600" }}>
            🏪 {seller?.shop_name || product.shop}
          </span>
          <span style={{ fontSize: "11px", color: "#10b981" }}>
            ⭐ {seller?.shop_rating || 4.5}
          </span>
        </div>
        
        <h3 style={{ margin: "8px 0 6px", fontSize: "15px", fontWeight: "bold", color: "#1e293b" }}>
          {product.name}
        </h3>
        
        <p style={{ color: "#6366f1", fontWeight: "bold", fontSize: "18px", margin: "4px 0" }}>
          Tsh {product.price.toLocaleString()}
        </p>
        <p style={{ fontSize: "11px", color: "#64748b", marginTop: "-4px", marginBottom: "8px" }}>
          / {product.bulk_unit}
        </p>
        
        {/* Variant Selector (Rangi, Ukubwa) */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector 
            variants={product.variants}
            onVariantChange={setSelectedVariants}
          />
        )}
        
        {/* Quantity Selector */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>
            📦 Kiasi ({product.bulk_unit}):
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {quickQuantities.map(q => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                style={{
                  background: quantity === q ? "#6366f1" : "#f1f5f9",
                  color: quantity === q ? "white" : "#64748b",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px"
                }}
              >
                {q}
              </button>
            ))}
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(product.min_order_quantity || 1, parseInt(e.target.value) || 1))}
              min={product.min_order_quantity || 1}
              style={{
                width: "80px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                textAlign: "center"
              }}
            />
          </div>
          <p style={{ fontSize: "10px", color: "#f59e0b" }}>
            ⚡ Kiwango cha chini: {product.min_order_quantity} {product.bulk_unit}
          </p>
        </div>

        {/* Jumla */}
        <div style={{
          background: "#f1f5f9",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "12px",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>💰 Jumla: </span>
          <strong style={{ fontSize: "16px", color: "#6366f1" }}>
            Tsh {totalPrice.toLocaleString()}
          </strong>
        </div>
        
        <button 
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "12px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🛒 Weka Kikapuni
        </button>

        <button 
          onClick={() => {
            const msg = `*🏭 AGIZO LA JUMLA - BAIZONA*\n\n` +
              `📦 Bidhaa: ${product.name}\n` +
              `💰 Bei: Tsh ${product.price.toLocaleString()} / ${product.bulk_unit}\n` +
              `📦 Kiasi: ${quantity} ${product.bulk_unit}\n` +
              `💵 Jumla: Tsh ${totalPrice.toLocaleString()}\n\n` +
              `👤 Namba yangu: [Ingiza namba yako]\n` +
              `📍 Nafika: [Weka anwani yako]\n\n` +
              `Asante, ngoja maelekezo yako.`
            window.open(`https://wa.me/${seller?.whatsapp || seller?.phone || '255700000000'}?text=${encodeURIComponent(msg)}`, '_blank')
          }}
          style={{
            width: "100%",
            padding: "10px",
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "13px",
            marginTop: "8px"
          }}
        >
          💬 Agiza Sasa (WhatsApp)
        </button>
      </div>
    </div>
  )
}