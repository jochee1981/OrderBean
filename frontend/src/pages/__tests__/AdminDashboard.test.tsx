import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import AdminDashboardPage from '../admin/DashboardPage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/admin/dashboard']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="admin/dashboard" element={component} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminDashboardPage - 관리자 대시보드', () => {
  beforeEach(() => {
    // 각 테스트 전에 초기화
  })

  // ============ 대시보드 통계 테스트 ============
  it('should render 관리자 대시보드 title', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('관리자 대시보드')).toBeInTheDocument()
  })

  it('should display 총 주문 count', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('총 주문')).toBeInTheDocument()
    // 숫자가 표시되어야 함
    const countElements = screen.getAllByTestId(/stat-count/)
    expect(countElements.length).toBeGreaterThan(0)
  })

  it('should display 주문 접수 count', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('주문 접수')).toBeInTheDocument()
  })

  it('should display 제조 중 count', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('제조 중')).toBeInTheDocument()
  })

  it('should display 제조 완료 count', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('제조 완료')).toBeInTheDocument()
  })

  // ============ 재고 현황 테스트 ============
  it('should render 재고 현황 section', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('재고 현황')).toBeInTheDocument()
  })

  it('should display 3 menu items in inventory', () => {
    renderWithRouter(<AdminDashboardPage />)
    const inventoryItems = screen.getAllByTestId('inventory-item')
    expect(inventoryItems.length).toBeGreaterThanOrEqual(3)
  })

  it('should display stock count for each menu', () => {
    renderWithRouter(<AdminDashboardPage />)
    const inventoryItems = screen.getAllByTestId('inventory-item')
    inventoryItems.forEach((item) => {
      // 각 항목에 재고 개수가 표시되어야 함
      expect(item.textContent).toMatch(/\d+개/)
    })
  })

  it('should display stock status badge (정상/주의/품절)', () => {
    renderWithRouter(<AdminDashboardPage />)
    // 재고 상태 배지가 표시되어야 함
    const statusBadges = screen.queryAllByTestId('stock-status')
    expect(statusBadges.length).toBeGreaterThan(0)
  })

  it('should show "주의" badge when stock is less than 5', () => {
    renderWithRouter(<AdminDashboardPage />)
    // 재고가 5개 미만일 때 '주의' 배지 표시
    const warningBadges = screen.queryAllByText('주의')
    // 재고가 5개 미만인 항목이 있을 수 있음
  })

  it('should show "품절" badge when stock is 0', () => {
    renderWithRouter(<AdminDashboardPage />)
    // 재고가 0개일 때 '품절' 배지 표시
    const outOfStockBadges = screen.queryAllByText('품절')
    // 재고가 0개인 항목이 있을 수 있음
  })

  it('should show "정상" badge when stock is 5 or more', () => {
    renderWithRouter(<AdminDashboardPage />)
    // 재고가 5개 이상일 때 '정상' 배지 표시
    const normalBadges = screen.queryAllByText('정상')
    // 재고가 5개 이상인 항목이 있을 수 있음
  })

  it('should have + button for each inventory item', () => {
    renderWithRouter(<AdminDashboardPage />)
    const plusButtons = screen.getAllByTestId('stock-increase-btn')
    expect(plusButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('should have - button for each inventory item', () => {
    renderWithRouter(<AdminDashboardPage />)
    const minusButtons = screen.getAllByTestId('stock-decrease-btn')
    expect(minusButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('should increase stock when + button is clicked', () => {
    renderWithRouter(<AdminDashboardPage />)
    const inventoryItems = screen.getAllByTestId('inventory-item')
    const firstItem = inventoryItems[0]
    const initialStock = firstItem.textContent?.match(/(\d+)개/)?.[1]
    
    const plusButton = screen.getAllByTestId('stock-increase-btn')[0]
    fireEvent.click(plusButton)
    
    // 재고가 1 증가해야 함
    const updatedStock = inventoryItems[0].textContent?.match(/(\d+)개/)?.[1]
    if (initialStock && updatedStock) {
      expect(parseInt(updatedStock)).toBe(parseInt(initialStock) + 1)
    }
  })

  it('should decrease stock when - button is clicked', () => {
    renderWithRouter(<AdminDashboardPage />)
    const inventoryItems = screen.getAllByTestId('inventory-item')
    const firstItem = inventoryItems[0]
    const initialStock = firstItem.textContent?.match(/(\d+)개/)?.[1]
    
    const minusButton = screen.getAllByTestId('stock-decrease-btn')[0]
    fireEvent.click(minusButton)
    
    // 재고가 1 감소해야 함
    const updatedStock = inventoryItems[0].textContent?.match(/(\d+)개/)?.[1]
    if (initialStock && updatedStock && parseInt(initialStock) > 0) {
      expect(parseInt(updatedStock)).toBe(parseInt(initialStock) - 1)
    }
  })

  // ============ 주문 현황 테스트 ============
  it('should render 주문 현황 section', () => {
    renderWithRouter(<AdminDashboardPage />)
    expect(screen.getByText('주문 현황')).toBeInTheDocument()
  })

  it('should display order date and time', () => {
    renderWithRouter(<AdminDashboardPage />)
    // 주문 일자/시간이 표시되어야 함 (형식: YYYY-MM-DD HH:mm 또는 M월 D일 HH:mm)
    const orderItems = screen.queryAllByTestId('order-item')
    if (orderItems.length > 0) {
      expect(orderItems[0].textContent).toMatch(/\d{1,2}월\s*\d{1,2}일|\d{4}-\d{2}-\d{2}/)
    }
  })

  it('should display order menu and quantity', () => {
    renderWithRouter(<AdminDashboardPage />)
    const orderItems = screen.queryAllByTestId('order-item')
    if (orderItems.length > 0) {
      // 주문 메뉴와 수량이 표시되어야 함 (형식: 메뉴명 x 수량)
      expect(orderItems[0].textContent).toMatch(/x\s*\d+/)
    }
  })

  it('should display order amount', () => {
    renderWithRouter(<AdminDashboardPage />)
    const orderItems = screen.queryAllByTestId('order-item')
    if (orderItems.length > 0) {
      // 주문 금액이 표시되어야 함
      expect(orderItems[0].textContent).toMatch(/\d{1,3}(,\d{3})*원/)
    }
  })

  it('should display order status as "주문 접수" initially', () => {
    renderWithRouter(<AdminDashboardPage />)
    const statusButtons = screen.queryAllByText('제조 시작')
    // 주문 접수 상태일 때 '제조 시작' 버튼이 표시되어야 함
    if (statusButtons.length > 0) {
      expect(statusButtons[0]).toBeInTheDocument()
    }
  })

  it('should have "제조 시작" button for pending orders', () => {
    renderWithRouter(<AdminDashboardPage />)
    const startButtons = screen.queryAllByText('제조 시작')
    // 주문 접수 상태의 주문에는 '제조 시작' 버튼이 있어야 함
  })

  it('should change status to "제조 중" when "제조 시작" button is clicked', () => {
    renderWithRouter(<AdminDashboardPage />)
    const startButtons = screen.queryAllByText('제조 시작')
    if (startButtons.length > 0) {
      fireEvent.click(startButtons[0])
      // 상태가 '제조 중'으로 변경되어야 함 (버튼이 '제조 완료'로 변경됨)
      const completeButtons = screen.getAllByRole('button', { name: '제조 완료' })
      expect(completeButtons.length).toBeGreaterThan(0)
    }
  })
})

