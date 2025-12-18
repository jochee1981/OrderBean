import { useOrderStore } from '@/stores/orderStore'
import { Link } from 'react-router-dom'

export default function OrderHistoryPage() {
  const { orders } = useOrderStore()

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 상태 한글 변환
  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      PENDING: '주문 접수',
      PREPARING: '제조 중',
      READY: '제조 완료',
      COMPLETED: '픽업 완료'
    }
    return statusMap[status] || status
  }

  // 상태별 색상
  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      PENDING: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-yellow-100 text-yellow-800',
      READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">주문 내역</h1>
        <p className="text-gray-600">나의 주문 내역을 확인하세요</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="mb-6">
            <svg 
              className="w-24 h-24 mx-auto text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">주문 내역이 없습니다</h2>
          <p className="text-gray-600 mb-6">첫 주문을 시작해보세요!</p>
          <Link
            to="/menu"
            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            메뉴 보러가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {order.totalAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">주문 상품</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-800">
                        {item.menuName}
                        <span className="text-purple-600 ml-2">x {item.quantity}</span>
                      </span>
                      <span className="text-gray-600">
                        {item.subtotal.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'READY' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg 
                        className="w-5 h-5 text-green-600 mr-2" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-green-800 font-semibold">
                        주문이 준비되었습니다! 픽업 카운터에서 수령해주세요.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
