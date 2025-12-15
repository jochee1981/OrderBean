import { useParams } from 'react-router-dom'

export default function OrderTrackingPage() {
  const { id } = useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">주문 추적</h1>
      <p>주문 ID: {id}</p>
      {/* 주문 상태 추적 UI가 여기에 표시됩니다 */}
    </div>
  )
}

