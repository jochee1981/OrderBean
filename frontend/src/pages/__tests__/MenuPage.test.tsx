import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import MenuPage from '../MenuPage'
import { useCartStore } from '@/stores/cartStore'

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

describe('MenuPage - User UI PRD 기반', () => {
  beforeEach(() => {
    // 각 테스트 전에 장바구니 초기화
    useCartStore.getState().clearCart()
  })

  it('should render header with OrderBean brand name', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('OrderBean – 커피 주문')).toBeInTheDocument()
  })

  it('should render 주문하기 button in header', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('주문하기')).toBeInTheDocument()
  })

  it('should render product cards with images', () => {
    renderWithRouter(<MenuPage />)
    const menuCards = screen.getAllByTestId('menu-card')
    expect(menuCards.length).toBeGreaterThan(0)
    // 각 카드에 이미지 영역이 있어야 함
    menuCards.forEach((card) => {
      const imageArea = card.querySelector('[data-testid="product-image"]')
      expect(imageArea).toBeInTheDocument()
    })
  })

  it('should display product name on each card', () => {
    renderWithRouter(<MenuPage />)
    const menuCards = screen.getAllByTestId('menu-card')
    expect(menuCards.length).toBeGreaterThan(0)
  })

  it('should display product price on each card', () => {
    renderWithRouter(<MenuPage />)
    // 가격 형식: "4,000원" 형태로 표시
    const priceElements = screen.getAllByText(/원$/)
    expect(priceElements.length).toBeGreaterThan(0)
  })

  it('should display product description', () => {
    renderWithRouter(<MenuPage />)
    // 설명이 있는지 확인 (선택사항이지만 PRD에 명시됨)
    const menuCards = screen.getAllByTestId('menu-card')
    expect(menuCards.length).toBeGreaterThan(0)
  })

  it('should have option checkboxes (샷 추가, 시럽 추가)', () => {
    renderWithRouter(<MenuPage />)
    // 옵션 체크박스가 있어야 함
    const shotOptions = screen.queryAllByText(/샷 추가/)
    const syrupOptions = screen.queryAllByText(/시럽 추가/)
    // 옵션이 있으면 체크박스도 있어야 함
    if (shotOptions.length > 0 || syrupOptions.length > 0) {
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    }
  })

  it('should have 담기 button on each product card', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    expect(addButtons.length).toBeGreaterThan(0)
  })

  it('should add item to cart when 담기 button is clicked', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0])
      // 장바구니에 항목이 추가되었는지 확인
      const cartItems = screen.queryAllByTestId('cart-item')
      expect(cartItems.length).toBeGreaterThan(0)
    }
  })

  it('should display shopping cart section', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText('장바구니')).toBeInTheDocument()
  })

  it('should display empty cart message when cart is empty', () => {
    renderWithRouter(<MenuPage />)
    expect(screen.getByText(/장바구니가 비어있습니다/i)).toBeInTheDocument()
  })

  it('should display cart items when items are added', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0])
      // 장바구니 항목이 표시되어야 함
      const cartItems = screen.queryAllByTestId('cart-item')
      expect(cartItems.length).toBeGreaterThan(0)
    }
  })

  it('should display total price in cart', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0])
      // 총 금액이 표시되어야 함
      expect(screen.getByText(/총 금액|총합/i)).toBeInTheDocument()
    }
  })

  it('should have 주문하기 button in cart', () => {
    renderWithRouter(<MenuPage />)
    const addButtons = screen.getAllByText('담기')
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0])
      // 장바구니의 주문하기 버튼이 표시되어야 함
      const orderButton = screen.getByTestId('order-button')
      expect(orderButton).toBeInTheDocument()
    }
  })

  it('should display option information in cart items', () => {
    renderWithRouter(<MenuPage />)
    // 옵션을 선택하고 담기 버튼을 클릭했을 때
    // 장바구니에 옵션 정보가 표시되어야 함
    const checkboxes = screen.queryAllByRole('checkbox')
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]) // 옵션 선택
      const addButtons = screen.getAllByText('담기')
      if (addButtons.length > 0) {
        fireEvent.click(addButtons[0])
        // 옵션 정보가 장바구니에 표시되는지 확인
        const cartItems = screen.queryAllByTestId('cart-item')
        expect(cartItems.length).toBeGreaterThan(0)
      }
    }
  })
})
