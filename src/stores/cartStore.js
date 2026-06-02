// src/stores/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id && i.variant === item.variant)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id && i.variant === item.variant
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id, variant) => set((state) => ({
        items: state.items.filter(i => !(i.id === id && i.variant === variant))
      })),
      
      updateQuantity: (id, variant, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.id === id && i.variant === variant
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
      
      getGroupedBySeller: () => {
        const grouped = {}
        get().items.forEach(item => {
          if (!grouped[item.sellerId]) {
            grouped[item.sellerId] = {
              sellerName: item.sellerName,
              sellerPhone: item.sellerPhone,
              items: []
            }
          }
          grouped[item.sellerId].items.push(item)
        })
        return grouped
      }
    }),
    {
      name: 'baizona-cart'
    }
  )
)