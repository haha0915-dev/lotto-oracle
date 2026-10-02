# Git Commit Message 가이드

Stage 영역에 올려진 파일들을 분석해서 적절한 message를 생성합니다.

## 기본 형식

```
<type>(<scope>): <subject>

[선택] <body>

[선택] <footer>
```

- 단순 변경(파일 소수, 의도 명확)일 때는 제목 한 줄만 사용합니다.
- 변경 영향이나 맥락 설명이 필요한 경우에만 `body`를 추가합니다.
- `footer`는 기본적으로 생략합니다. (이슈 추적은 PR 단위로 수행)

---

## 자동 생성 규칙

### 1. 입력 범위
- Stage(`git diff --cached`)에 올라온 변경만 분석합니다.

### 2. type 결정 규칙

| 값 | 기준 |
|---|---|
| `fix` | 런타임 오동작/회귀/누락 복구 |
| `feat` | 신규 기능/컴포넌트/props/API 추가 |
| `refactor` | 동작 변경 없는 구조 개선 |
| `test` | 테스트/스토리 전용 변경 |
| `docs` | 문서 전용 변경 |
| `style` | 포맷팅 전용 변경 (동작 변화 없음) |
| `chore` | 빌드/의존성/스크립트/CI 변경 |

혼합 변경 시 우선순위: `fix > feat > refactor > test > docs > style > chore`

### 3. scope 추출 규칙

변경 파일 경로 기준으로 대표 scope 1개만 선택합니다.

| 경로 패턴 | scope |
|---|---|
| `src/components/atom/**` | `atom` |
| `src/components/common/**` | `common` |
| `src/components/special/**` | `special` |
| `src/features/**` | `feature` |
| `src/stories/**`, `.storybook/**` | `storybook` |
| `src/services/**` | `api` |
| `src/types/**` | `types` |
| `src/assets/**` | `assets` |
| `ai/**`, `docs/**`, `*.md` | `docs` |
| 위 규칙에 매핑되지 않으면 | `core` |

### 4. subject 규칙
- 항상 한국어로 작성합니다.
- 마침표(`.`) 없이 간결하게 작성합니다.
- 모호한 표현(`수정`, `변경`) 단독 사용을 피하고 대상+행위를 함께 작성합니다.

### 5. body 규칙
- 아래 조건 중 하나라도 충족하면 body를 작성합니다.
  - 변경 파일이 3개 이상
  - 변경 파일 경로가 2개 이상 scope에 매핑
  - 동작 영향/리스크 설명이 필요한 경우
- 1~3개 불릿으로 작성합니다.

### 6. footer 규칙
- 기본적으로 생성하지 않습니다.
- 예외: 단일 커밋으로 바로 머지하는 경우(hotfix 등)에만 브랜치명에서 `SCP-숫자` 패턴을 추출하여 첨부합니다.
  - `fix` 타입: `Fixes: SCP-xxxx`
  - 그 외 타입: `Closes: SCP-xxxx`
  - 문의/요청 대응 성격 명확: `Resolves: SCP-xxxx`

---

## 예시

```
fix(common): CSCommonModal 버튼 비활성 조건 복구
```

```
refactor(feature): BundleDiscountTypeSelector 코드 품질 개선

- 불필요한 Fragment, 중첩 Flex, 미사용 import(React, useEffect) 및 console.log 제거
- 미사용 CSS 클래스 9개 제거, 배경색 --cs-box-background-color 토큰 전환
- Header/TypeSelector 코드 품질 검수 결과 리뷰 문서 반영
```

```
fix(core): 긴급 로그인 검증 로직 복구

Fixes: SCP-2931
```
> ↑ 단일 커밋 hotfix로 바로 머지하는 경우에만 footer 첨부
