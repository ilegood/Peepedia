# Peepedia · 짹과사전

> A Little Encyclopedia of Birds.  
> 다양한 새의 사진, 울음소리, 생태 정보를 한곳에서 확인할 수 있는 개인용 온라인 새 도감입니다.

## 실행 및 검증 명령어

```bash
npm install         # 의존성 설치
npm run dev         # 개발 서버 실행
npm run validate-data # 새 JSON 데이터 및 미디어 경로 검사
npm test            # 단위·컴포넌트 테스트 실행
npm run build       # 데이터 검사 + 타입 검사 + 정적 배포 빌드(dist/)
npm run preview     # 빌드 결과 로컬 미리보기
```

## 새 데이터 및 미디어 관리

- 새 데이터 추가·수정 방법은 [src/data/birds/README.md](src/data/birds/README.md)를 참고하세요.
- 현재 `src/data/birds/`에는 개발용 테스트 데이터(45종)가 들어 있으며, 실제 새 목록이 준비되면 해당 폴더의 JSON과 `public/media/birds/` 파일을 교체하면 됩니다.

## 배포 및 검색 엔진(구글) 연결

- **Vercel 배포**: 저장소를 Vercel에 연결하면 `vercel.json` 설정을 통해 SPA 라우팅(`/birds/:id` 직접 접속 포함)이 자동으로 동작합니다.
- **검색 엔진 색인 제어**: `site.config.json`의 `allowIndexing` 값으로 제어합니다.
  - 현재 기본값 `false`: `<meta name="robots" content="noindex, nofollow">` 및 `robots.txt` 차단
  - 구글 검색 연결 시: `site.config.json`에서 `"allowIndexing": true`로 변경한 뒤 다시 빌드/배포하세요.
