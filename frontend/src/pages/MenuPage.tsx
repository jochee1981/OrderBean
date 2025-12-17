import { useCartStore } from '@/stores/cartStore'

const menus = [
  { id: '1', name: '아메리카노 (ICE)', price: 4000 },
  { id: '2', name: '아메리카노 (HOT)', price: 4000 },
  { id: '3', name: '카페라떼', price: 4500 },
]

export default function MenuPage() {
  const { items, addItem, getTotal } = useCartStore()

  const handleAddToCart = (menu: typeof menus[0]) => {
    addItem({
      id: menu.id,
      name: menu.name,
      price: menu.price,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">메뉴</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            data-testid="menu-card"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{menu.name}</h2>
            <p className="text-gray-600 mb-4">{menu.price.toLocaleString()}원</p>
            <button
              onClick={() => handleAddToCart(menu)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              담기
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">장바구니</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">장바구니가 비어있습니다.</p>
        ) : (
          <>
            <ul className="mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">총 금액</span>
              <span className="text-xl font-bold">
                {getTotal().toLocaleString()}원
              </span>
            </div>
            <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
              주문하기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
