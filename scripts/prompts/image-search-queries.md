# Image Search Queries (Hirst artworks + bio specimens)

`scripts/fetch-hirst-images.mjs` 와 `scripts/fetch-bio-specimen-images.mjs` 가 공유하는 검색 전략. 작품 메타데이터(title, year)로 쿼리 문자열을 런타임에 동적 생성한 뒤 Wikipedia → Wikimedia Commons → Bing 이미지 → Google 이미지를 병렬 호출하고, 후보 URL 8개까지 순차로 다운로드 검증한다.

## 쿼리 패턴

- tight: `Damien Hirst "{title}" {year}`
- loose: `Damien Hirst {title}`
- commons: `Hirst {title}`
- wiki: 정확한 page title (`{title}` 그대로)

`title`은 `(...)` 부속어를 제거하고 공백을 정규화한 형태(`titleClean`)를 사용한다.

## 예시 쿼리

- `Damien Hirst "The Physical Impossibility of Death in the Mind of Someone Living" 1991`
- `Damien Hirst "For the Love of God" 2007`
- `Damien Hirst "The Wrath of God" 2005` (bio specimen)
- `Damien Hirst Mother and Child Divided` (loose variant)

## 검증 규칙

- HTTP 응답 `content-type` 이 `image/*` 또는 `octet-stream` 인지 확인
- 최소 3KB 이상
- MD5 해시 dedupe + `scripts/output/hirst-banned-hashes.json` 의 banned hash 목록 (예: Wikipedia "Damien Hirst" portrait page lead `f70141e6232eee98a288f598ac13bf36`) 자동 폐기
- 동일 패턴이 `fetch-bio-specimen-images.mjs` 에도 그대로 적용되며, 출력 경로만 `/public/images/hirst/bio/` 로 분기된다.
