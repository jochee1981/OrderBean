#!/usr/bin/env python
"""
FastAPI 서버 상태 확인 스크립트
"""
import requests
import json
from typing import Dict, Any


def test_endpoint(url: str, name: str) -> bool:
    """엔드포인트 테스트"""
    try:
        print(f"\n[테스트] {name}")
        print(f"URL: {url}")
        
        response = requests.get(url, timeout=5)
        print(f"상태 코드: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"응답:\n{json.dumps(data, indent=2, ensure_ascii=False)}")
            print("[SUCCESS] 성공")
            return True
        else:
            print(f"[FAIL] 실패: 상태 코드 {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("[FAIL] 연결 실패: 서버가 실행 중인지 확인하세요")
        return False
    except requests.exceptions.Timeout:
        print("[FAIL] 타임아웃: 서버 응답이 없습니다")
        return False
    except Exception as e:
        print(f"[FAIL] 오류: {e}")
        return False


def main():
    """메인 함수"""
    print("=" * 60)
    print("FastAPI 서버 접속 테스트")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    tests = [
        (f"{base_url}/", "루트 엔드포인트"),
        (f"{base_url}/health", "헬스체크 엔드포인트"),
        (f"{base_url}/api/v1/test", "API v1 테스트 엔드포인트"),
    ]
    
    results = []
    for url, name in tests:
        success = test_endpoint(url, name)
        results.append((name, success))
    
    # 결과 요약
    print("\n" + "=" * 60)
    print("테스트 결과 요약")
    print("=" * 60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "[PASS]" if success else "[FAIL]"
        print(f"{status} - {name}")
    
    print(f"\n총 {total}개 중 {passed}개 통과 ({passed/total*100:.0f}%)")
    
    if passed == total:
        print("\n[SUCCESS] 모든 테스트를 통과했습니다!")
    else:
        print("\n[WARNING] 일부 테스트가 실패했습니다.")
    
    print("\nSwagger UI: http://localhost:8000/docs")
    print("ReDoc: http://localhost:8000/redoc")


if __name__ == "__main__":
    main()
