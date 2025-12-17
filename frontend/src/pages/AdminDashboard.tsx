import { useState } from 'react'

interface InventoryItem {
  id: string
  name: string
  stock: number
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  items: { menuName: string; quantity: number; subtotal: number }[]
  totalAmount: number
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'
}

// 초기 재고 데이터
const initialInventory: InventoryItem[] = [
  { id: '1', name: '아메리카노 (ICE)', stock: 10 },
  { id: '2', name: '아메리카노 (HOT)', stock: 10 },
  { id: '3', name: '카페라떼', stock: 10 },
]

// 초기 주문 데이터
const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    createdAt: '2024-07-31T13:00:00',
    items: [{ menuName: '아메리카노 (ICE)', quantity: 1, subtotal: 4000 }],
    totalAmount: 4000,
    status: 'PENDING',
  },
]

export default function AdminDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  // 재고 상태 계산
  const getStockStatus = (stock: number): string => {
    if (stock === 0) return '품절'
    if (stock < 5) return '주의'
    return '정상'
  }

  // 재고 상태 색상
  const getStockStatusColor = (status: string): string => {
    if (status === '품절') return 'bg-red-100 text-red-800'
    if (status === '주의') return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  // 재고 증가
  const increaseStock = (id: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: item.stock + 1 } : item
      )
    )
  }

  // 재고 감소
  const decreaseStock = (id: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id && item.stock > 0
          ? { ...item, stock: item.stock - 1 }
          : item
      )
    )
  }

  // 주문 상태 변경
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // 대시보드 통계 계산
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING').length
  const readyOrders = orders.filter((o) => o.status === 'READY').length

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 관리자 대시보드 */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 mb-2">총 주문</div>
            <div data-testid="stat-count-total" className="text-3xl font-bold text-purple-600">
              {totalOrders}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 mb-2">주문 접수</div>
            <div data-testid="stat-count-pending" className="text-3xl font-bold text-blue-600">
              {pendingOrders}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 mb-2">제조 중</div>
            <div data-testid="stat-count-preparing" className="text-3xl font-bold text-yellow-600">
              {preparingOrders}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 mb-2">제조 완료</div>
            <div data-testid="stat-count-ready" className="text-3xl font-bold text-green-600">
              {readyOrders}
            </div>
          </div>
        </div>
      </section>

      {/* 재고 현황 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">재고 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inventory.map((item) => {
            const status = getStockStatus(item.stock)
            return (
              <div
                key={item.id}
                data-testid="inventory-item"
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">{item.stock}개</div>
                  <span
                    data-testid="stock-status"
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid="stock-increase-btn"
                    onClick={() => increaseStock(item.id)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
                  >
                    +
                  </button>
                  <button
                    data-testid="stock-decrease-btn"
                    onClick={() => decreaseStock(item.id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold"
                    disabled={item.stock === 0}
                  >
                    -
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 주문 현황 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">주문 현황</h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            주문이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                data-testid="order-item"
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-gray-800">
                          {item.menuName} x {item.quantity}
                        </div>
                      ))}
                    </div>
                    <div className="text-lg font-semibold text-purple-600">
                      {order.totalAmount.toLocaleString()}원
                    </div>
                  </div>
                  <div className="ml-4">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                        제조 시작
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap"
                      >
                        제조 완료
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors whitespace-nowrap"
                      >
                        픽업 완료
                      </button>
                    )}
                    {order.status === 'COMPLETED' && (
                      <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md whitespace-nowrap inline-block">
                        완료됨
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

