import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          OrderBean에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          빠르고 편리한 커피 주문 서비스
        </p>
        <Link
          to={ROUTES.CUSTOMER.MENU}
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          메뉴 보기
        </Link>
      </div>
    </div>
  )
}

