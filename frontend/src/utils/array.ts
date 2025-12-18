// 배열이 비어있는지 확인
export const isEmpty = <T>(arr: T[]): boolean => {
  return arr.length === 0
}

// 배열에서 중복 제거
export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr))
}

// 배열을 청크로 나누기
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

// 배열 섞기 (Fisher-Yates 알고리즘)
export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 배열에서 특정 조건에 맞는 첫 번째 요소 찾기
export const findFirst = <T>(
  arr: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  return arr.find(predicate)
}

// 배열 정렬 (안전한 정렬)
export const sortBy = <T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}
