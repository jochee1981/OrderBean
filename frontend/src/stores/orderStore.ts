import { create } from 'zustand'

export interface OrderItem {
  menuName: string
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'
}

interface OrderStore {
  orders: Order[]
  orderCounter: number
  addOrder: (items: OrderItem[], totalAmount: number) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  orderCounter: 0,
  
  addOrder: (items, totalAmount) =>
    set((state) => {
      const newOrderNumber = `ORD-${String(state.orderCounter + 1).padStart(3, '0')}`
      const newOrder: Order = {
        id: String(Date.now()),
        orderNumber: newOrderNumber,
        createdAt: new Date().toISOString(),
        items,
        totalAmount,
        status: 'PENDING',
      }
      
      return {
        orders: [newOrder, ...state.orders],
        orderCounter: state.orderCounter + 1,
      }
    }),
    
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
}))
