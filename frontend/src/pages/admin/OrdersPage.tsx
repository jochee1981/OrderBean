import ComingSoon from '@/components/ComingSoon'

export default function AdminOrdersPage() {
  return (
    <ComingSoon
      title="주문 관리"
      description="모든 주문을 통합 관리하고 상세 정보를 확인할 수 있는 기능입니다."
      features={[
        '전체 주문 목록 조회',
        '주문 상태별 필터링',
        '주문 검색 기능 (주문번호, 고객명)',
        '주문 상세 정보 확인',
        '주문 상태 일괄 변경',
        '주문 통계 및 분석',
        '주문 내역 엑셀 다운로드',
        '주문 취소 및 환불 처리'
      ]}
    />
  )
}
