import { useState, useEffect } from 'react'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types/order'
import { OrderStatus, getOrderStatusText, getOrderStatusColor, canTransitionStatus } from '@/types/order'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all')
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const statusFilters = [
    { id: 'all', name: '전체', color: 'bg-gray-100 text-gray-800' },
    { id: OrderStatus.PENDING, name: '주문 접수', color: 'bg-blue-100 text-blue-800' },
    { id: OrderStatus.PREPARING, name: '제조 중', color: 'bg-yellow-100 text-yellow-800' },
    { id: OrderStatus.READY, name: '준비 완료', color: 'bg-green-100 text-green-800' },
    { id: OrderStatus.PICKED, name: '픽업 완료', color: 'bg-purple-100 text-purple-800' },
  ]

  useEffect(() => {
    loadOrders()

    // 자동 새로고침 (10초마다)
    const interval = setInterval(() => {
      loadOrders()
    }, 10000)

    setRefreshInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedStatus])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await orderService.getOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        page: 1,
        limit: 50,
      })

      setOrders(response.orders)
    } catch (err) {
      setError('주문을 불러오는데 실패했습니다.')
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, currentStatus: OrderStatus, newStatus: OrderStatus) => {
    // 상태 전환 검증
    if (!canTransitionStatus(currentStatus, newStatus)) {
      alert(`${getOrderStatusText(currentStatus)}에서 ${getOrderStatusText(newStatus)}로 변경할 수 없습니다.`)
      return
    }

    if (!confirm(`주문 상태를 "${getOrderStatusText(newStatus)}"(으)로 변경하시겠습니까?`)) {
      return
    }

    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus })
      alert('주문 상태가 업데이트되었습니다.')
      loadOrders()
    } catch (err) {
      alert('주문 상태 업데이트에 실패했습니다.')
      console.error('Failed to update order status:', err)
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const transitions: Record<OrderStatus, OrderStatus | null> = {
      [OrderStatus.PENDING]: OrderStatus.PREPARING,
      [OrderStatus.PREPARING]: OrderStatus.READY,
      [OrderStatus.READY]: OrderStatus.PICKED,
      [OrderStatus.PICKED]: OrderStatus.COMPLETED,
      [OrderStatus.COMPLETED]: null,
      [OrderStatus.CANCELLED]: null,
    }
    return transitions[currentStatus]
  }

  const getStatusActionText = (status: OrderStatus): string => {
    const nextStatus = getNextStatus(status)
    if (!nextStatus) return ''
    
    const actionMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: '제조 시작',
      [OrderStatus.PREPARING]: '제조 완료',
      [OrderStatus.READY]: '픽업 완료',
      [OrderStatus.PICKED]: '주문 완료',
      [OrderStatus.COMPLETED]: '',
      [OrderStatus.CANCELLED]: '',
    }
    return actionMap[status] || ''
  }

  // 주문을 상태별로 그룹화
  const groupedOrders = {
    [OrderStatus.PENDING]: orders.filter(o => o.status === OrderStatus.PENDING),
    [OrderStatus.PREPARING]: orders.filter(o => o.status === OrderStatus.PREPARING),
    [OrderStatus.READY]: orders.filter(o => o.status === OrderStatus.READY),
  }

  const renderOrderCard = (order: Order) => {
    const nextStatus = getNextStatus(order.status)
    const actionText = getStatusActionText(order.status)

    return (
      <div
        key={order.id}
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        {/* 주문 헤더 */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-lg">{order.orderNumber}</div>
            <div className="text-sm text-gray-500">
              {new Date(order.orderTime).toLocaleString('ko-KR')}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusText(order.status)}
          </span>
        </div>

        {/* 주문 내역 */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">주문 내역</div>
          <ul className="space-y-1">
            {order.items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex justify-between">
                <span>
                  {item.menuName} × {item.quantity}
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.selectedOptions.map(opt => opt.optionName).join(', ')})
                    </span>
                  )}
                </span>
                <span className="font-medium">{item.subtotal.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
          {order.notes && (
            <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded">
              💬 {order.notes}
            </div>
          )}
        </div>

        {/* 금액 정보 */}
        <div className="mb-3 space-y-1">
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>할인</span>
              <span className="text-red-600">-{order.discountAmount.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-medium">총 금액</span>
            <span className="font-bold text-lg text-purple-600">
              {order.finalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {nextStatus && (
            <button
              onClick={() => handleStatusChange(order.id, order.status, nextStatus)}
              className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors font-medium"
            >
              {actionText}
            </button>
          )}
          {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PREPARING) && (
            <button
              onClick={() => handleStatusChange(order.id, order.status, OrderStatus.CANCELLED)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </div>
    )
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">주문을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">주문 현황</h1>
          <p className="text-gray-600 mt-1">실시간 주문 관리</p>
        </div>
        <button
          onClick={loadOrders}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedStatus(filter.id as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedStatus === filter.id
                ? 'bg-purple-500 text-white'
                : `${filter.color} hover:opacity-80`
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* 주문 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">주문 접수</div>
          <div className="text-3xl font-bold text-blue-700">
            {groupedOrders[OrderStatus.PENDING].length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600 font-medium">제조 중</div>
          <div className="text-3xl font-bold text-yellow-700">
            {groupedOrders[OrderStatus.PREPARING].length}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">준비 완료</div>
          <div className="text-3xl font-bold text-green-700">
            {groupedOrders[OrderStatus.READY].length}
          </div>
        </div>
      </div>

      {/* 주문 목록 */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">주문이 없습니다.</p>
        </div>
      ) : selectedStatus === 'all' ? (
        // 전체 주문: 상태별 그룹으로 표시
        <div className="space-y-8">
          {/* 주문 접수 */}
          {groupedOrders[OrderStatus.PENDING].length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                주문 접수 ({groupedOrders[OrderStatus.PENDING].length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedOrders[OrderStatus.PENDING].map(renderOrderCard)}
              </div>
            </div>
          )}

          {/* 제조 중 */}
          {groupedOrders[OrderStatus.PREPARING].length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                제조 중 ({groupedOrders[OrderStatus.PREPARING].length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedOrders[OrderStatus.PREPARING].map(renderOrderCard)}
              </div>
            </div>
          )}

          {/* 준비 완료 */}
          {groupedOrders[OrderStatus.READY].length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                준비 완료 ({groupedOrders[OrderStatus.READY].length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedOrders[OrderStatus.READY].map(renderOrderCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        // 필터된 주문: 일반 그리드 표시
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  )
}
