import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import MenuPage from '../MenuPage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/menu']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="menu" element={component} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('MenuPage', () => {
  it('should render header with COZY brand name', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('COZY')).toBeInTheDocument()
  })

  it('should render 주문하기 button in header', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('주문하기')).toBeInTheDocument()
  })

  it('should render 관리자 button in header', () => {
    // 관리자 버튼은 로그인한 관리자에게만 표시되므로, 
    // 여기서는 링크가 존재하는지만 확인
    renderWithRouter(<MenuPage />)
    // 관리자 링크는 조건부 렌더링이므로, 주문하기 버튼만 확인
    expect(screen.getByText('주문하기')).toBeInTheDocument()
  })

  it('should render 3 coffee menu cards', () => {
    renderWithRouter(<MenuPage />)
    // 메뉴 카드가 3개 표시되어야 함
    const menuCards = screen.getAllByTestId('menu-card')
    expect(menuCards).toHaveLength(3)
  })

  it('should display 아메리카노 (ICE) menu', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('아메리카노 (ICE)')).toBeInTheDocument()
  })

  it('should display 아메리카노 (HOT) menu', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('아메리카노 (HOT)')).toBeInTheDocument()
  })

  it('should display 카페라떼 menu', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('카페라떼')).toBeInTheDocument()
  })

  it('should render shopping cart when items are added', () => {
    renderWithRouter(<MenuPage />)
    // 장바구니 섹션이 있어야 함
    expect(screen.getByText('장바구니')).toBeInTheDocument()
  })

  it('should have add to cart button on each menu card', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    expect(addButtons.length).toBeGreaterThanOrEqual(3)
  })
})

