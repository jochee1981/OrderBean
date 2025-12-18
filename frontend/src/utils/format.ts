// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 간단한 날짜 포맷 (월/일 시:분)
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

// 가격 포맷팅
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`
}

// 숫자 포맷팅 (천단위 콤마)
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// 상대 시간 포맷 (예: "5분 전", "1시간 전")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  
  return formatDate(dateString)
}
