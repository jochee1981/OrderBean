import { useState } from 'react'
import { useOrderStore } from '@/stores/orderStore'

interface InventoryItem {
  id: string
  name: string
  stock: number
}

// 초기 재고 데이터
const initialInventory: InventoryItem[] = [
  { id: '1', name: '아메리카노 (ICE)', stock: 10 },
  { id: '2', name: '아메리카노 (HOT)', stock: 10 },
  { id: '3', name: '카페라떼', stock: 10 },
  { id: '4', name: '카푸치노', stock: 10 },
  { id: '5', name: '바닐라라떼', stock: 10 },
]

export default function AdminDashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const { orders, updateOrderStatus: updateStatus } = useOrderStore()

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 관리자 대시보드 헤더 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
              <p className="text-gray-600">실시간 주문 및 재고 관리</p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </div>
          </div>
          
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <div className="text-purple-100 text-sm font-medium">총 주문</div>
                <div className="text-3xl">📋</div>
              </div>
              <div data-testid="stat-count-total" className="text-4xl font-bold">
                {totalOrders}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-100 text-sm font-medium">주문 접수</div>
                <div className="text-3xl">🔔</div>
              </div>
              <div data-testid="stat-count-pending" className="text-4xl font-bold">
                {pendingOrders}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <div className="text-yellow-100 text-sm font-medium">제조 중</div>
                <div className="text-3xl">⚡</div>
              </div>
              <div data-testid="stat-count-preparing" className="text-4xl font-bold">
                {preparingOrders}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-100 text-sm font-medium">제조 완료</div>
                <div className="text-3xl">✅</div>
              </div>
              <div data-testid="stat-count-ready" className="text-4xl font-bold">
                {readyOrders}
              </div>
            </div>
          </div>
        </section>

        {/* 재고 현황 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">재고 현황</h2>
            <span className="text-sm text-gray-500">실시간 업데이트</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {inventory.map((item) => {
              const status = getStockStatus(item.stock)
              return (
                <div
                  key={item.id}
                  data-testid="inventory-item"
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-purple-600">{item.stock}</div>
                      <span className="text-gray-500 text-sm">개</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span
                      data-testid="stock-status"
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${getStockStatusColor(
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
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-bold text-lg shadow-md"
                    >
                      +
                    </button>
                    <button
                      data-testid="stock-decrease-btn"
                      onClick={() => decreaseStock(item.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-bold text-lg shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">주문 현황</h2>
            <span className="text-sm text-gray-500">최근 주문 목록</span>
          </div>
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">주문이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = {
                  PENDING: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', icon: '🔔' },
                  PREPARING: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
                  READY: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800', icon: '✅' },
                  COMPLETED: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800', icon: '✔️' },
                }[order.status]

                return (
                  <div
                    key={order.id}
                    data-testid="order-item"
                    className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{statusConfig.icon}</span>
                          <div>
                            <div className="text-lg font-bold text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-800 font-medium">
                                  {item.menuName} <span className="text-purple-600">x {item.quantity}</span>
                                </span>
                                <span className="text-gray-600">
                                  {item.subtotal.toLocaleString()}원
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-gray-700 font-semibold">총 금액</span>
                            <span className="text-2xl font-bold text-purple-600">
                              {order.totalAmount.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col items-end gap-2">
                        <span className={`${statusConfig.badge} px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap`}>
                          {order.status === 'PENDING' && '주문 접수'}
                          {order.status === 'PREPARING' && '제조 중'}
                          {order.status === 'READY' && '제조 완료'}
                          {order.status === 'COMPLETED' && '픽업 완료'}
                        </span>
                        
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(order.id, 'PREPARING')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap font-bold shadow-md"
                          >
                            제조 시작
                          </button>
                        )}
                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => updateStatus(order.id, 'READY')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all whitespace-nowrap font-bold shadow-md"
                          >
                            제조 완료
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            onClick={() => updateStatus(order.id, 'COMPLETED')}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all whitespace-nowrap font-bold shadow-md"
                          >
                            픽업 완료
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
