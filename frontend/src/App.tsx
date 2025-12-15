import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminMenuPage from './pages/admin/MenuPage'
import AdminOrdersPage from './pages/admin/OrdersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderTrackingPage />} />
          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="menus" element={<AdminMenuPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

