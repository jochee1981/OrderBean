// 에러 메시지
export const ERROR_MESSAGES = {
  // 인증
  AUTH: {
    LOGIN_FAILED: '로그인에 실패했습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.'
  },
  
  // 주문
  ORDER: {
    CREATE_FAILED: '주문 생성에 실패했습니다.',
    UPDATE_FAILED: '주문 상태 변경에 실패했습니다.',
    NOT_FOUND: '주문을 찾을 수 없습니다.',
    EMPTY_CART: '장바구니가 비어있습니다.'
  },
  
  // 메뉴
  MENU: {
    LOAD_FAILED: '메뉴를 불러오는데 실패했습니다.',
    OUT_OF_STOCK: '재고가 부족합니다.',
    NOT_AVAILABLE: '현재 이용할 수 없는 메뉴입니다.'
  },
  
  // 네트워크
  NETWORK: {
    CONNECTION_ERROR: '네트워크 연결을 확인해주세요.',
    TIMEOUT: '요청 시간이 초과되었습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.'
  },
  
  // 일반
  GENERAL: {
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
    TRY_AGAIN: '다시 시도해주세요.'
  }
} as const

// 성공 메시지
export const SUCCESS_MESSAGES = {
  ORDER: {
    CREATED: '주문이 완료되었습니다!',
    STATUS_UPDATED: '주문 상태가 변경되었습니다.',
    CANCELLED: '주문이 취소되었습니다.'
  },
  
  AUTH: {
    LOGIN_SUCCESS: '로그인 되었습니다.',
    LOGOUT_SUCCESS: '로그아웃 되었습니다.'
  },
  
  MENU: {
    CREATED: '메뉴가 등록되었습니다.',
    UPDATED: '메뉴가 수정되었습니다.',
    DELETED: '메뉴가 삭제되었습니다.',
    STOCK_UPDATED: '재고가 업데이트되었습니다.'
  }
} as const
