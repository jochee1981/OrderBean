import ComingSoon from '@/components/common/ComingSoon'

export default function AdminMenuPage() {
  return (
    <ComingSoon
      title="메뉴 관리"
      description="관리자가 메뉴를 추가, 수정, 삭제할 수 있는 기능입니다."
      features={[
        '신규 메뉴 등록',
        '메뉴 정보 수정 (이름, 가격, 설명)',
        '메뉴 이미지 업로드',
        '메뉴 옵션 관리',
        '메뉴 재고 관리',
        '메뉴 활성화/비활성화',
        '메뉴 카테고리 관리'
      ]}
    />
  )
}
