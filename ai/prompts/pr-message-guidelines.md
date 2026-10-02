# Git PR 제목/설명 자동 생성 가이드

현재 브랜치의 변경 내용을 기준으로 PR 제목과 설명을 자동 생성할 때 사용하는 기준입니다.

---

## 1. 생성 범위

- `origin/develop` (또는 target branch) 대비 `HEAD` 변경만 분석합니다.
- 사용 명령:
  - `git log --oneline origin/develop..HEAD`
  - `git diff --stat origin/develop..HEAD`
- Unstaged/Untracked 변경은 제외합니다.

---

## 2. 출력 규칙

- 제목과 본문은 항상 한국어로 작성합니다.
- diff에 없는 내용은 추측하지 않습니다.

---

## 3. PR 제목 규칙

### 형식

```
<type>(<scope>): <subject>
```

### type / scope / subject

- commit-message-guidelines.md의 type·scope·subject 규칙을 동일하게 적용합니다.
- 혼합 변경 시 우선순위: `fix > feat > refactor > test > docs > style > chore`
- subject 권장 길이: 18~60자

---

## 4. PR 설명 템플릿

```md
## 개요
-

## 변경 내용
-

## 커밋 이력
| 커밋 | 설명 |
|------|------|
| `해시` | 메시지 |

## 영향 범위
-

## 관련 이슈
-
```

---

## 5. 섹션별 작성 규칙

### 개요

- 왜 이 변경이 필요한지 1~3줄로 작성합니다.

### 변경 내용

- 기능/도메인 단위로 묶어 작성합니다.
- 경로 나열보다 "무엇이 달라졌는지"를 우선 작성합니다.
- 변경 규모에 따라 하위 제목(`###`)으로 구분할 수 있습니다.

### 커밋 이력

- `git log --oneline origin/develop..HEAD` 결과를 테이블로 작성합니다.
- merge 커밋은 제외합니다.

### 영향 범위

- 변경이 미치는 컴포넌트/페이지/공통 모듈을 명시합니다.
- 공통 컴포넌트 변경 시 영향받는 업무 화면을 함께 기재합니다.

### 관련 이슈

- 브랜치명에서 `SCP-숫자` 패턴을 추출합니다.
- 추출된 티켓이 있으면 반드시 포함합니다.
- 기본 매핑:
  - `fix` 타입: `Fixes: SCP-xxxx`
  - 그 외 타입: `Closes: SCP-xxxx`
  - 문의/요청 대응 성격 명확: `Resolves: SCP-xxxx` 우선
- 추가 GitHub 이슈가 있으면 `See also: #123`으로 추가합니다.
- 해당 없으면 섹션 자체를 생략합니다.

---

## 6. 금지 규칙

- diff에 없는 작업/효과를 작성하지 않습니다.
- 이슈 번호를 임의로 생성하지 않습니다.
- PR 제목과 설명의 `type/scope`가 서로 충돌하지 않도록 유지합니다.

---

## 7. 생성 예시

```
제목:
fix(feature): SIM 업데이트 팝업 디자인 검수 반영
```

```md
설명:

## 개요
SIM 업데이트 팝업의 피그마 디자인 검수 결과를 반영했습니다.

## 변경 내용

### SIM 업데이트 팝업
- 모달 사이즈 570→512px, 높이 619px 고정
- 폼 라벨 width 110→100px, 필드 width 352px 고정
- 안내사항 영역 ol/li 구조로 변경, 2번 항목(재부팅 안내) 추가
- 버튼 radius 8→100px, 버튼 영역 420px 중앙 정렬

### SIM 업데이트 버튼
- 색상 핑크 → 기본 테두리/텍스트로 변경
- rightSection에 화살표 아이콘 추가

## 커밋 이력
| 커밋 | 설명 |
|------|------|
| `b6249387` | fix(feature): SIM 업데이트 팝업 디자인 검수 반영 |
| `64a455de` | fix(feature): SIM 업데이트 버튼 디자인 보정 및 우측 화살표 아이콘 추가 |

## 영향 범위
- `TerminalProductChangeServiceTypeSelector.tsx` — 단말상품변경 SIM 업데이트 버튼/팝업

## 관련 이슈
- Fixes: SCP-2931
```
