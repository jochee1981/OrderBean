import { StockStatus } from '@/types/inventory'

// 재고 임계값
export const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK: 5,
  WARNING_THRESHOLD: 5
} as const

// 재고 상태 텍스트
export const STOCK_STATUS_TEXT: Record<StockStatus, string> = {
  [StockStatus.OUT_OF_STOCK]: '품절',
  [StockStatus.LOW]: '주의',
  [StockStatus.NORMAL]: '정상'
}

// 재고 상태 색상
export const STOCK_STATUS_COLORS: Record<StockStatus, string> = {
  [StockStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
  [StockStatus.LOW]: 'bg-yellow-100 text-yellow-800',
  [StockStatus.NORMAL]: 'bg-green-100 text-green-800'
}
