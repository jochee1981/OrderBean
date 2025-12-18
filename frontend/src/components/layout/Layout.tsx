import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'
import { isAdmin } from '@/types/auth'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={ROUTES.HOME} className="text-2xl font-bold text-purple-600">
                OrderBean – 커피 주문
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={ROUTES.CUSTOMER.MENU}
                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                주문하기
              </Link>
              {user ? (
                <>
                  {isAdmin(user) && (
                    <Link
                      to={ROUTES.ADMIN.DASHBOARD}
                      className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      관리자
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.ADMIN.DASHBOARD}
                    className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-colors"
                  >
                    관리자
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

