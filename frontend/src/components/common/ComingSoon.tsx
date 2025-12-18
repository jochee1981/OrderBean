interface ComingSoonProps {
  title: string
  description?: string
  features?: string[]
}

export default function ComingSoon({ 
  title, 
  description = '이 기능은 현재 개발 중입니다.',
  features = []
}: ComingSoonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          {/* 아이콘 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
              <svg 
                className="w-16 h-16 text-purple-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          {/* 설명 */}
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>

          {/* 예정 기능 목록 */}
          {features.length > 0 && (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🚀 예정된 기능
              </h2>
              <ul className="space-y-2 text-left">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 진행 상태 */}
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>개발 진행 중</span>
          </div>
        </div>
      </div>
    </div>
  )
}
