import { useState, useEffect } from 'react'
import { menuService } from '@/services/menuService'
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu'

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 폼 상태
  const [formData, setFormData] = useState<CreateMenuRequest>({
    cafeId: 'CAFE-001',
    name: '',
    price: 0,
    description: '',
    category: 'espresso',
    stockQuantity: 0,
    imageUrl: null,
  })

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'espresso', name: '에스프레소' },
    { id: 'latte', name: '라떼' },
    { id: 'frappuccino', name: '프라푸치노' },
    { id: 'tea', name: '차' },
  ]

  useEffect(() => {
    loadMenus()
  }, [selectedCategory])

  const loadMenus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await menuService.getMenus({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        includeInactive: true, // 관리자는 비활성 메뉴도 조회
      })
      
      setMenus(response.menus)
    } catch (err) {
      setError('메뉴를 불러오는데 실패했습니다.')
      console.error('Failed to load menus:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await menuService.createMenu(formData)
      alert('메뉴가 생성되었습니다.')
      setShowCreateForm(false)
      resetForm()
      loadMenus()
    } catch (err) {
      alert('메뉴 생성에 실패했습니다.')
      console.error('Failed to create menu:', err)
    }
  }

  const handleUpdate = async () => {
    if (!editingMenu) return
    
    try {
      const updateData: UpdateMenuRequest = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        stockQuantity: formData.stockQuantity,
        imageUrl: formData.imageUrl,
      }
      
      await menuService.updateMenu(editingMenu.id, updateData)
      alert('메뉴가 수정되었습니다.')
      setEditingMenu(null)
      resetForm()
      loadMenus()
    } catch (err) {
      alert('메뉴 수정에 실패했습니다.')
      console.error('Failed to update menu:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return
    
    try {
      await menuService.deleteMenu(id)
      alert('메뉴가 삭제되었습니다.')
      loadMenus()
    } catch (err) {
      alert('메뉴 삭제에 실패했습니다.')
      console.error('Failed to delete menu:', err)
    }
  }

  const handleStockUpdate = async (menuId: string, operation: 'increase' | 'decrease') => {
    const menu = menus.find(m => m.id === menuId)
    if (!menu) return

    const amount = prompt(`${operation === 'increase' ? '증가' : '감소'}할 재고 수량을 입력하세요:`)
    if (!amount || isNaN(Number(amount))) return

    try {
      await menuService.updateStock(menuId, {
        stockQuantity: Number(amount),
        operation,
      })
      alert('재고가 업데이트되었습니다.')
      loadMenus()
    } catch (err) {
      alert('재고 업데이트에 실패했습니다.')
      console.error('Failed to update stock:', err)
    }
  }

  const startEdit = (menu: Menu) => {
    setEditingMenu(menu)
    setFormData({
      cafeId: menu.cafeId || 'CAFE-001',
      name: menu.name,
      price: menu.price,
      description: menu.description,
      category: menu.category,
      stockQuantity: menu.stockQuantity || 0,
      imageUrl: menu.imageUrl,
    })
  }

  const resetForm = () => {
    setFormData({
      cafeId: 'CAFE-001',
      name: '',
      price: 0,
      description: '',
      category: 'espresso',
      stockQuantity: 0,
      imageUrl: null,
    })
  }

  const cancelEdit = () => {
    setEditingMenu(null)
    setShowCreateForm(false)
    resetForm()
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">메뉴 관리</h1>
          <p className="text-gray-600 mt-1">메뉴와 재고를 관리하세요</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          + 메뉴 추가
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 생성/수정 폼 */}
      {(showCreateForm || editingMenu) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingMenu ? '메뉴 수정' : '새 메뉴 추가'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">메뉴 이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: 아메리카노"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">카테고리 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="espresso">에스프레소</option>
                <option value="latte">라떼</option>
                <option value="frappuccino">프라푸치노</option>
                <option value="tea">차</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">가격 (원) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="4000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">재고 수량 *</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="100"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="메뉴 설명을 입력하세요"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">이미지 URL</label>
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={editingMenu ? handleUpdate : handleCreate}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              {editingMenu ? '수정 완료' : '생성'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 메뉴 목록 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이미지</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">메뉴명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">재고</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menus.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  메뉴가 없습니다.
                </td>
              </tr>
            ) : (
              menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {menu.imageUrl ? (
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-2xl">☕</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{menu.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{menu.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded">
                      {menu.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {menu.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        (menu.stockQuantity || 0) < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {menu.stockQuantity || 0}개
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStockUpdate(menu.id, 'increase')}
                          className="text-green-600 hover:text-green-700"
                          title="재고 증가"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStockUpdate(menu.id, 'decrease')}
                          className="text-red-600 hover:text-red-700"
                          title="재고 감소"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      menu.isActive && menu.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {menu.isActive && menu.inStock ? '판매중' : '품절'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(menu)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
