import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { AdminRoute } from './components/common'
import { ROUTE_PATHS } from './constants/routes'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminMenuPage from './pages/admin/MenuPage'
import AdminOrdersPage from './pages/admin/OrdersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        
        {/* 레이아웃이 있는 라우트 */}
        <Route path={ROUTE_PATHS.HOME} element={<Layout />}>
          {/* 홈페이지 */}
          <Route index element={<HomePage />} />
          
          {/* 고객 페이지 */}
          <Route path={ROUTE_PATHS.MENU} element={<MenuPage />} />
          <Route path={ROUTE_PATHS.ORDER} element={<OrderPage />} />
          <Route path={ROUTE_PATHS.ORDER_HISTORY} element={<OrderHistoryPage />} />
          <Route path={ROUTE_PATHS.ORDER_TRACKING} element={<OrderTrackingPage />} />
          
          {/* 관리자 페이지 - 보호된 라우트 */}
          <Route path={ROUTE_PATHS.ADMIN_DASHBOARD} element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
          <Route path={ROUTE_PATHS.ADMIN_MENUS} element={
            <AdminRoute>
              <AdminMenuPage />
            </AdminRoute>
          } />
          <Route path={ROUTE_PATHS.ADMIN_ORDERS} element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
