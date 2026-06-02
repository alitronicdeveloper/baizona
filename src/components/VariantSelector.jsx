// src/components/VariantSelector.jsx
import { useState } from 'react'

export const VariantSelector = ({ variants, onVariantChange }) => {
  const [selected, setSelected] = useState({})

  const handleSelect = (type, value) => {
    const newSelected = { ...selected, [type]: value }
    setSelected(newSelected)
    onVariantChange?.(newSelected)
  }

  if (!variants || variants.length === 0) return null

  const colorMap = {
    'Nyeusi': '#1e293b',
    'Nyekundu': '#ef4444',
    'Nyeupe': '#f8fafc',
    'Bluu': '#3b82f6',
    'Kijani': '#10b981'
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      {variants.map(variant => (
        <div key={variant.type} style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            🎨 {variant.name}:
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {variant.options.map(option => (
              <button
                key={option}
                onClick={() => handleSelect(variant.type, option)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor: selected[variant.type] === option ? "#6366f1" : "#e2e8f0",
                  background: selected[variant.type] === option ? "#eef2ff" : "white",
                  color: selected[variant.type] === option ? "#6366f1" : "#64748b",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                {variant.type === "color" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: colorMap[option] || "#94a3b8"
                    }}></span>
                    {option}
                  </span>
                ) : option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}