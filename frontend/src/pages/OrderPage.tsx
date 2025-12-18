import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function OrderPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // OrderPage는 MenuPage에서 이미 주문 기능을 제공하므로
    // 자동으로 MenuPage로 리다이렉트
    navigate(ROUTES.CUSTOMER.MENU, { replace: true })
  }, [navigate])

  return null
}
