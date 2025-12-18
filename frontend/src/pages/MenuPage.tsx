import { useState, useEffect } from 'react'
import { useCartStore, CartItem } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { menuService } from '@/services/menuService'
import type { Menu, OptionGroup } from '@/types/menu'

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'espresso', name: '에스프레소' },
  { id: 'latte', name: '라떼' },
  { id: 'frappuccino', name: '프라푸치노' },
  { id: 'tea', name: '차' },
]

interface SelectedOptions {
  [menuId: string]: {
    [groupId: string]: string[] // 각 그룹별로 선택된 옵션 ID들
  }
}

export default function MenuPage() {
  const { items, addItem, getTotal, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  // 메뉴 데이터 로드
  useEffect(() => {
    loadMenus()
  }, [selectedCategory, searchTerm])

  const loadMenus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await menuService.getMenus({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        searchTerm: searchTerm || undefined,
        page: 1,
        limit: 20,
      })
      
      setMenus(response.menus)
    } catch (err) {
      setError('메뉴를 불러오는데 실패했습니다.')
      console.error('Failed to load menus:', err)
    } finally {
      setLoading(false)
    }
  }

  // 옵션 선택 핸들러
  const handleOptionChange = (
    menuId: string,
    groupId: string,
    optionId: string,
    allowMultiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      const menuOptions = prev[menuId] || {}
      const groupOptions = menuOptions[groupId] || []
      
      let newGroupOptions: string[]
      if (allowMultiple) {
        // 다중 선택: 토글
        newGroupOptions = groupOptions.includes(optionId)
          ? groupOptions.filter((id) => id !== optionId)
          : [...groupOptions, optionId]
      } else {
        // 단일 선택: 교체
        newGroupOptions = [optionId]
      }
      
      return {
        ...prev,
        [menuId]: {
          ...menuOptions,
          [groupId]: newGroupOptions,
        },
      }
    })
  }

  // 필수 옵션 검증
  const validateRequiredOptions = (menu: Menu): string | null => {
    const selected = selectedOptions[menu.id] || {}
    
    for (const group of menu.optionGroups) {
      if (group.isRequired) {
        const selectedGroupOptions = selected[group.id] || []
        if (selectedGroupOptions.length === 0) {
          return `"${group.name}" 옵션을 선택해주세요.`
        }
      }
    }
    
    return null
  }

  // 선택된 옵션의 가격 계산
  const calculateOptionPrice = (menu: Menu): number => {
    const selected = selectedOptions[menu.id] || {}
    let totalOptionPrice = 0
    
    menu.optionGroups.forEach((group) => {
      const selectedGroupOptions = selected[group.id] || []
      selectedGroupOptions.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId)
        if (option) {
          totalOptionPrice += option.optionPrice
        }
      })
    })
    
    return totalOptionPrice
  }

  // 장바구니에 추가
  const handleAddToCart = (menu: Menu) => {
    // 필수 옵션 검증
    const validationError = validateRequiredOptions(menu)
    if (validationError) {
      alert(validationError)
      return
    }

    // 재고 확인
    if (!menu.inStock) {
      alert('품절된 상품입니다.')
      return
    }

    const selected = selectedOptions[menu.id] || {}
    const optionPrice = calculateOptionPrice(menu)
    const totalPrice = menu.price + optionPrice

    // 선택된 옵션 이름 수집
    const optionNames: string[] = []
    menu.optionGroups.forEach((group) => {
      const selectedGroupOptions = selected[group.id] || []
      selectedGroupOptions.forEach((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId)
        if (option) {
          optionNames.push(option.name)
        }
      })
    })

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
      [menu.id]: {},
    }))

    // 성공 알림
    alert(`${menu.name}이(가) 장바구니에 추가되었습니다.`)
  }

  // 주문하기
  const handleOrder = () => {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    // 주문 데이터 생성
    const orderItems = items.map((item) => ({
      menuName: item.options && item.options.length > 0
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

  // 옵션 그룹 렌더링
  const renderOptionGroup = (menu: Menu, group: OptionGroup) => {
    const selected = selectedOptions[menu.id]?.[group.id] || []

    return (
      <div key={group.id} className="mb-4">
        <p className="text-sm font-medium mb-2">
          {group.name}
          {group.isRequired && <span className="text-red-500 ml-1">*</span>}
          {!group.isRequired && <span className="text-gray-500 ml-1">(선택)</span>}
        </p>
        <div className="space-y-2">
          {group.options.map((option) => {
            const isSelected = selected.includes(option.id)
            
            return (
              <label
                key={option.id}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type={group.allowMultiple ? 'checkbox' : 'radio'}
                  name={`${menu.id}-${group.id}`}
                  checked={isSelected}
                  onChange={() => 
                    handleOptionChange(menu.id, group.id, option.id, group.allowMultiple)
                  }
                  className="w-4 h-4 mr-2 text-purple-600"
                />
                <span className="text-sm flex-1">
                  {option.name}
                  {option.optionPrice > 0 && (
                    <span className="text-purple-600 ml-1">
                      (+{option.optionPrice.toLocaleString()}원)
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">메뉴를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadMenus}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">메뉴</h1>
        <p className="text-gray-600">원하시는 음료를 선택해주세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <input
            type="text"
            placeholder="메뉴 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 메뉴 그리드 */}
      {menus.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => {
            const optionPrice = calculateOptionPrice(menu)
            const displayPrice = menu.price + optionPrice

            return (
              <div
                key={menu.id}
                data-testid="menu-card"
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  !menu.inStock ? 'opacity-60' : ''
                }`}
              >
                {/* 이미지 영역 */}
                <div className="relative w-full h-56 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden">
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">☕</div>
                  )}
                  
                  {/* 품절 배지 */}
                  {!menu.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                        품절
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* 제품명 & 카테고리 */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold flex-1">{menu.name}</h2>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      {menu.category}
                    </span>
                  </div>

                  {/* 가격 */}
                  <p className="text-lg font-bold mb-2 text-purple-600">
                    {displayPrice.toLocaleString()}원
                    {optionPrice > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (기본 {menu.price.toLocaleString()}원)
                      </span>
                    )}
                  </p>

                  {/* 설명 */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {menu.description}
                  </p>

                  {/* 옵션 그룹 */}
                  {menu.optionGroups && menu.optionGroups.length > 0 && (
                    <div className="mb-4 border-t pt-4">
                      {menu.optionGroups.map((group) => renderOptionGroup(menu, group))}
                    </div>
                  )}

                  {/* 담기 버튼 */}
                  <button
                    onClick={() => handleAddToCart(menu)}
                    disabled={!menu.inStock}
                    className={`w-full px-4 py-2 rounded-md transition-colors font-medium ${
                      menu.inStock
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {menu.inStock ? '장바구니에 담기' : '품절'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 장바구니 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">장바구니</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">장바구니가 비어있습니다.</p>
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
                    className="flex justify-between items-start py-3 border-b border-gray-200"
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
