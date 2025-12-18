// 재고 아이템
export interface InventoryItem {
  id: string
  name: string
  stock: number
}

// 재고 상태
export enum StockStatus {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW = 'LOW',
  NORMAL = 'NORMAL'
}

// 재고 상태 텍스트
export const getStockStatusText = (status: StockStatus): string => {
  const statusMap: Record<StockStatus, string> = {
    [StockStatus.OUT_OF_STOCK]: '품절',
    [StockStatus.LOW]: '주의',
    [StockStatus.NORMAL]: '정상'
  }
  return statusMap[status]
}

// 재고 상태 색상
export const getStockStatusColor = (status: StockStatus): string => {
  const colorMap: Record<StockStatus, string> = {
    [StockStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
    [StockStatus.LOW]: 'bg-yellow-100 text-yellow-800',
    [StockStatus.NORMAL]: 'bg-green-100 text-green-800'
  }
  return colorMap[status]
}

// 재고 수량으로 상태 계산
export const calculateStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return StockStatus.OUT_OF_STOCK
  if (stock < 5) return StockStatus.LOW
  return StockStatus.NORMAL
}
