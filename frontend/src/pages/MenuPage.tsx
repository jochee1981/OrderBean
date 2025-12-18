import { useState } from 'react'
import { useCartStore, CartItem } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'

interface ProductOption {
  id: string
  name: string
  priceAdjustment: number
}

interface Menu {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string | null
  options: ProductOption[]
}

const menus: Menu[] = [
  {
    id: '1',
    name: '아메리카노 (ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    imageUrl: '/images/ice-americano.png',
    options: [
      { id: 'shot', name: '샷 추가', priceAdjustment: 500 },
      { id: 'syrup', name: '시럽 추가', priceAdjustment: 0 },
    ],
  },
  {
    id: '2',
    name: '아메리카노 (HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    imageUrl: '/images/hot-americano.png',
    options: [
      { id: 'shot', name: '샷 추가', priceAdjustment: 500 },
      { id: 'syrup', name: '시럽 추가', priceAdjustment: 0 },
    ],
  },
  {
    id: '3',
    name: '카페라떼',
    price: 4500,
    description: '부드러운 우유와 에스프레소의 조화',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop&q=80',
    options: [
      { id: 'shot', name: '샷 추가', priceAdjustment: 500 },
      { id: 'syrup', name: '시럽 추가', priceAdjustment: 0 },
    ],
  },
  {
    id: '4',
    name: '카푸치노',
    price: 4500,
    description: '우유 거품이 올라간 부드러운 카푸치노',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80',
    options: [
      { id: 'shot', name: '샷 추가', priceAdjustment: 500 },
      { id: 'syrup', name: '시럽 추가', priceAdjustment: 0 },
    ],
  },
  {
    id: '5',
    name: '바닐라라떼',
    price: 5000,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80',
    options: [
      { id: 'shot', name: '샷 추가', priceAdjustment: 500 },
      { id: 'syrup', name: '시럽 추가', priceAdjustment: 0 },
    ],
  },
]

export default function MenuPage() {
  const { items, addItem, getTotal, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[]
  }>({})

  const handleOptionChange = (menuId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[menuId] || []
      const isSelected = current.includes(optionId)
      return {
        ...prev,
        [menuId]: isSelected
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      }
    })
  }

  const handleAddToCart = (menu: Menu) => {
    const selected = selectedOptions[menu.id] || []
    const optionPrices = selected.reduce((sum, optionId) => {
      const option = menu.options.find((opt) => opt.id === optionId)
      return sum + (option?.priceAdjustment || 0)
    }, 0)

    const totalPrice = menu.price + optionPrices
    const optionNames = selected
      .map((id) => menu.options.find((opt) => opt.id === id)?.name)
      .filter(Boolean) as string[]

    const cartItem: CartItem = {
      id: menu.id,
      name: menu.name,
      price: totalPrice,
      quantity: 1,
      options: optionNames,
    }

    addItem(cartItem)
    
    // 옵션 선택 초기화
    setSelectedOptions((prev) => ({
      ...prev,
      [menu.id]: [],
    }))
  }

  const handleOrder = () => {
    if (items.length === 0) return

    // 주문 데이터 생성
    const orderItems = items.map((item) => ({
      menuName: (item.options && item.options.length > 0)
        ? `${item.name} (${item.options.join(', ')})`
        : item.name,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    // 주문 추가
    addOrder(orderItems, getTotal())

    // 장바구니 비우기
    clearCart()

    // 성공 알림
    alert('주문이 완료되었습니다! 관리자 대시보드에서 확인할 수 있습니다.')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">메뉴</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => {
          const selected = selectedOptions[menu.id] || []
          const optionPrices = selected.reduce((sum, optionId) => {
            const option = menu.options.find((opt) => opt.id === optionId)
            return sum + (option?.priceAdjustment || 0)
          }, 0)
          const displayPrice = menu.price + optionPrices

          return (
            <div
              key={menu.id}
              data-testid="menu-card"
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl"
            >
              {/* 이미지 영역 */}
              <div
                data-testid="product-image"
                className="w-full h-56 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden"
              >
                {menu.imageUrl ? (
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">☕</div>
                )}
              </div>

              <div className="p-6">
                {/* 제품명 */}
                <h2 className="text-xl font-semibold mb-2">{menu.name}</h2>

                {/* 가격 */}
                <p className="text-lg font-bold mb-2 text-purple-600">
                  {displayPrice.toLocaleString()}원
                </p>

                {/* 설명 */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {menu.description}
                </p>

                {/* 옵션 */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">옵션:</p>
                  {menu.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center mb-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(option.id)}
                        onChange={() => handleOptionChange(menu.id, option.id)}
                        className="w-5 h-5 mr-2 text-purple-600"
                      />
                      <span className="text-sm">
                        {option.name}
                        {option.priceAdjustment > 0 && (
                          <span className="text-purple-600 ml-1">
                            (+{option.priceAdjustment.toLocaleString()}원)
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>

                {/* 담기 버튼 */}
                <button
                  onClick={() => handleAddToCart(menu)}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  담기
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 장바구니 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">장바구니</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">장바구니가 비어있습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 왼쪽: 주문 내역 */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">주문 내역</h3>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li
                    key={`${item.id}-${index}`}
                    data-testid="cart-item"
                    className="flex justify-between items-start py-2 border-b border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      {item.options && item.options.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          옵션: {item.options.join(', ')}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        수량: {item.quantity}개
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-purple-600">
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        개당 {item.price.toLocaleString()}원
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 오른쪽: 총 금액 및 주문하기 */}
            <div className="md:col-span-1 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">결제 정보</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>주문 수량</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)}개</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">총 금액</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {getTotal().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
              <button
                data-testid="order-button"
                onClick={handleOrder}
                disabled={items.length === 0}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                주문하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
