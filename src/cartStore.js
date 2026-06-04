// src/stores/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get()
        const key = `${newItem.id}__${newItem.variant || ''}`
        const existing = items.find(i => `${i.id}__${i.variant || ''}` === key)
        if (existing) {
          set({ items: items.map(i => `${i.id}__${i.variant || ''}` === key ? { ...i, quantity: i.quantity + newItem.quantity } : i) })
        } else {
          set({ items: [...items, { ...newItem, cartKey: key }] })
        }
      },

      removeItem: (id, variant) => {
        const key = `${id}__${variant || ''}`
        set(s => ({ items: s.items.filter(i => `${i.id}__${i.variant || ''}` !== key) }))
      },

      updateQuantity: (id, variant, quantity) => {
        const key = `${id}__${variant || ''}`
        if (quantity <= 0) {
          set(s => ({ items: s.items.filter(i => `${i.id}__${i.variant || ''}` !== key) }))
        } else {
          set(s => ({ items: s.items.map(i => `${i.id}__${i.variant || ''}` === key ? { ...i, quantity } : i) }))
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),

      getTotalPrice: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      getGroupedBySeller: () => {
        const { items } = get()
        return items.reduce((acc, item) => {
          const sid = item.sellerId || item.sellerName || 'unknown'
          if (!acc[sid]) {
            acc[sid] = { sellerName: item.sellerName, sellerPhone: item.sellerPhone, items: [] }
          }
          acc[sid].items.push(item)
          return acc
        }, {})
      },
    }),
    {
      name: 'baizona-cart',
      version: 2,
    }
  )
)
