# Figma 디자인 검수 및 컴포넌트 생성 가이드

이 가이드는 Figma 디자인을 기반으로 UI 코드를 검수하거나 생성할 때 반드시 숙지해야 합니다.

---

## 1. 마크업 규칙

- 모든 마크업은 **Mantine 라이브러리** 또는 **공용 컴포넌트**를 **우선 사용**해서 작성합니다.
- 순수 HTML Tag(`div`, `span`, `button` 등)는 Mantine/공용 컴포넌트로 대체가 어렵거나, semantic/접근성 목적이 명확한 경우에만 예외적으로 사용합니다.
- 순수 HTML Tag 사용이 필요한 경우, 작업 전에 **사용 목적과 필요성(대체 불가 사유 포함)**을 정리해 확인(승인)받은 뒤 진행합니다.
- 레이아웃은 Mantine의 `Flex`, `Stack`, `Group`, `Box`, `Grid` 등을 활용합니다.
- 텍스트는 Mantine의 `Text`, `Title` 컴포넌트를 사용합니다.

---

## 2. 공용 컴포넌트

공용 컴포넌트는 `src/components` 폴더에 위치하며, 3가지 카테고리로 구분됩니다.

### 카테고리 구조

| 카테고리  | 경로                     | 설명                               |
| --------- | ------------------------ | ---------------------------------- |
| `atom`    | `src/components/atom`    | 가장 작은 단위의 기본 컴포넌트     |
| `common`  | `src/components/common`  | atom을 조합한 중간 단위 컴포넌트   |
| `special` | `src/components/special` | 특정 도메인에 특화된 복합 컴포넌트 |

### atom 컴포넌트 목록

| 컴포넌트                                                 | 용도               |
| -------------------------------------------------------- | ------------------ |
| `CSButton`                                               | 공통 버튼          |
| `CSInput`                                                | 공통 입력 필드     |
| `CSSelect`                                               | 공통 셀렉트 박스   |
| `CSCheckBox` / `CSCheckBoxGroup`                         | 체크박스           |
| `CSRadio` / `CSRadioGroup`                               | 라디오 버튼        |
| `CSChip`                                                 | 칩 선택 UI         |
| `CSTabs`                                                 | 탭 UI              |
| `CSBadge`                                                | 뱃지               |
| `CSIcon`                                                 | 아이콘 이미지      |
| `CSBox`                                                  | 공통 박스 컨테이너 |
| `CSDrawer`                                               | 드로어             |
| `CSAccordion`                                            | 아코디언           |
| `CSFormLayout` (CSFormRow, CSFormField, CSFormGuideText) | 폼 레이아웃        |
| `CSSegmentedControl`                                     | 세그먼트 컨트롤    |
| `CSAutocomplete`                                         | 자동완성 입력      |
| `CSSelectList`                                           | 선택 목록          |
| `CSHourPicker`                                           | 시간 선택          |
| `CSLottie`                                               | Lottie 애니메이션  |

### common 컴포넌트 목록

| 컴포넌트                   | 용도                          |
| -------------------------- | ----------------------------- |
| `CSCommonModal`            | 공통 모달                     |
| `CSCommonAlert`            | 공통 알럿                     |
| `CSCommonAlertButtons`     | 공통 알럿 버튼 그룹           |
| `CSDataTable`              | 데이터 테이블                 |
| `CSDualTable`              | 듀얼 테이블                   |
| `CSDataTablePopup`         | 테이블 팝업                   |
| `CSDataSearchSelectPopup`  | 검색 선택 팝업                |
| `CSPageStepButtons`        | 페이지 단계 버튼              |
| `CSStepper`                | 스텝퍼                        |
| `CSCalendar`               | 캘린더                        |
| `CSBasicInfo`              | 기본 정보 표시                |
| `CSBasicInfoIcon`          | 기본 정보 아이콘 표시         |
| `CSBasicInfoItem`          | 기본 정보 항목 표시           |
| `CSBasicInfoRemainInstall` | 기본 정보 잔여 할부 정보 표시 |
| `CSLoadingOverlay`         | 로딩 오버레이                 |
| `CSEmptyResult`            | 빈 결과 표시                  |
| `CSPopover`                | 팝오버                        |
| `CSSelectListDrawer`       | 선택 목록 드로어              |
| `CSSelectInput`            | 선택 입력                     |
| `CSCommonGroupButton`      | 그룹 버튼                     |
| `CSAddressInput`           | 주소 입력                     |
| `CSRightMenuDrawer`        | 우측 메뉴 드로어              |
| `CSErrorCodeText`          | 에러 코드 텍스트              |

---

## 3. 스토리북 참고

`atom`, `common` 카테고리의 컴포넌트는 **스토리북이 작성**되어 있습니다.
컴포넌트 사용 전 반드시 스토리북을 통해 **props 종류, 기본값, 각 variant 형태**를 꼼꼼하게 확인하세요.

- 스토리 파일 위치: `src/stories/`
- `special` 카테고리 일부는 스토리가 없을 수 있으니 소스 코드를 직접 확인합니다.
  ([스토리 커버리지 현황](../../docs/development/story-coverage.md) 참고)

---

## 4. 아이콘 사용

아이콘(UI 내부 반복 아이콘)은 반드시 `CSIcon` 컴포넌트를 사용하며, `icon` prop에 아이콘 키 이름을 전달합니다.

```tsx
<CSIcon icon="graySearch" width={24} height={24} />
```

사용 가능한 아이콘 목록은 아래 두 폴더에서 확인합니다:

- `src/assets/icon/CSIconSection/` — 섹션별 아이콘
- `src/assets/icon/CSIconEntire/` — 전체 아이콘

일반 이미지(사진, 동의서 이미지, 신분증/OCR 결과 이미지, QR 이미지 등)는 `next/image` 사용을 기본으로 합니다.

```tsx
import Image from 'next/image';

<Image src={imageSrc} alt={'example-image'} width={640} height={360} />;
```

`<img>` 태그는 예외 케이스에서만 사용합니다. (예: `data/blob/base64` 미리보기, 라이브러리 제약, 즉시 렌더링이 필요한 경우)

`<img>` 태그 사용이 필요한 경우, 작업 전에 **사용 목적과 필요성(대체 불가 사유 포함)**을 정리해 보고하고 확인(승인)받은 뒤 진행합니다.

---

## 5. 색상 시스템

### CSS 변수 (전역)

`src/assets/css/global.css` 또는 Mantine 컬러 팔레트에 이미 정의된 색상은 반드시 토큰(변수/팔레트)으로 사용합니다.

정의된 색상이 없는 경우에는 아래 순서로 처리합니다.

- 먼저 `src/assets/css/global.css`(필요 시 `src/assets/data/colorSet.ts`)에 토큰을 추가한 뒤 사용합니다.
- 토큰 추가가 당장 어려운 예외 상황에서만 hex 하드코딩을 임시 허용합니다.
- hex 임시 사용 시, 사용 목적/필요성(대체 불가 사유)과 후속 토큰화 계획을 정리해 확인(승인)받은 뒤 반영합니다.

**기본 색상 변수:**

| 변수명                   | 색상      | 용도               |
| ------------------------ | --------- | ------------------ |
| `--cs-pink`              | `#E6007E` | 브랜드 핑크 (강조) |
| `--cs-black`             | `#262626` | 기본 텍스트        |
| `--cs-gray`              | `#DADADA` | 기본 회색          |
| `--cs-gray-dark`         | `#666666` | 진한 회색          |
| `--cs-gray-light`        | `#999999` | 연한 회색          |
| `--cs-white`             | `#FFFFFF` | 흰색               |
| `--cs-border-color`      | `#E7EBEE` | 기본 테두리        |
| `--cs-blue`              | `#AC43FF` | 보라 계열          |
| `--cs-input-error-color` | `#F15222` | 에러 색상          |

**상태 색상 변수:**

| 변수명                         | 색상      | 용도           |
| ------------------------------ | --------- | -------------- |
| `--cs-color-status-activation` | `#EB0084` | 활성 상태      |
| `--cs-color-status-stop`       | `#B57A0C` | 정지/보류 상태 |
| `--cs-color-status-cancle`     | `#6E6E6E` | 취소/해지 상태 |

**레이아웃 변수:**

| 변수명                      | 값        | 용도             |
| --------------------------- | --------- | ---------------- |
| `--cs-header-height`        | `56px`    | 헤더 높이        |
| `--cs-page-top-space`       | `52px`    | 페이지 상단 여백 |
| `--cs-drawer-padding`       | `20px`    | 드로어 내부 패딩 |
| `--cs-box-border-color`     | `#D8D9DA` | 박스 테두리 색상 |
| `--cs-box-background-color` | `#F3F3F4` | 박스 기본 배경   |
| `--button-radius`           | `10px`    | 버튼 기본 radius |

> 전체 변수 목록은 `src/assets/css/global.css`를 직접 확인합니다.

### Mantine 커스텀 컬러

`src/assets/data/colorSet.ts`에 정의된 Mantine 컬러 팔레트를 사용합니다.

| 컬러명        | 용도                       |
| ------------- | -------------------------- |
| `default`     | 기본 핑크 브랜드 컬러      |
| `buttonBlack` | 검정 버튼 (기본 버튼 색상) |
| `buttonWhite` | 흰색 버튼                  |
| `black`       | 텍스트/배경 검정 계열      |
| `gray`        | 회색 계열                  |

---

## 6. 폼 레이아웃 패턴

폼 UI는 `CSFormLayout` 컴포넌트 조합을 사용합니다.

```tsx
<CSFormRow>
  <CSFormField label="이름" withAsterisk>
    <CSInput inputType={InputTypeEnum.NAME} useType="T2" />
  </CSFormField>
</CSFormRow>
```

- `CSFormRow`: 한 행을 구성하는 wrapper (`layout`, `appearance` prop으로 변형 가능)
- `CSFormField`: 레이블 + 입력 필드 쌍 (`labelWidth` 기본값 98px)
- `CSFormGuideText`: 폼 하단 안내 텍스트

---

## 7. 공통 CSS 클래스

`src/assets/css/` 폴더의 CSS 파일에 공통 클래스가 정의되어 있습니다. 중복 스타일 작성 전 반드시 확인합니다.

| 파일         | 주요 클래스                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `layout.css` | `.lightgray_container`, `.detail_drawer_container`, `.label_value_container` |
| `button.css` | `.check_auth_button`, `.inner_right_arrow_button`                            |
| `text.css`   | `.title_article_text`                                                        |

---

## 8. 타입스크립트 타입 및 Enum import

- 컴포넌트 props 타입은 `src/types/components/` 에서 확인합니다.
- 도메인 타입은 `src/types/domain/` 에서 확인합니다.
- 전역 열거형은 `src/enums/` 에서 확인합니다.

**import 경로 패턴:**

```tsx
import { InputTypeEnum, ButtonVariantEnum, BadgeTypeEnum } from '@/enums';
import type { ICSButtonTypeProps, ICSInputProps } from '@/types';
import { CSButton, CSInput } from '@/components';
```

> `@/enums`, `@/types`, `@/components` 경로 alias를 기본으로 사용합니다.
>
> 다음 경우에는 상대 경로 import를 허용합니다.
>
> - 배럴 파일(`index.ts`)에서 하위 모듈을 import/re-export할 때
> - 동일 컴포넌트 디렉토리 내부(하위 파일 포함)에서 로컬 모듈을 참조할 때
>
> 레이어 간(`atom/common/special/features/widgets`) import는 alias를 사용하고, 루트 배럴(`@/components`) 재경유로 순환 참조가 생기지 않는지 확인합니다.

---

## 9. 이미지 및 에셋 관리

### 에셋 폴더 구조

모든 정적 에셋은 `src/assets/` 하위에 종류별로 분리하여 저장합니다.

| 폴더                             | 용도                                             | 포맷           |
| -------------------------------- | ------------------------------------------------ | -------------- |
| `src/assets/icon/CSIconSection/` | UI에서 반복적으로 사용되는 소형 아이콘           | `.svg`         |
| `src/assets/icon/CSIconEntire/`  | 페이지/섹션 단위의 일러스트, 캐릭터, 배경 이미지 | `.svg`         |
| `src/assets/image/`              | 실제 사진, 동의서 이미지 등 래스터 이미지        | `.png`, `.jpg` |
| `src/assets/animation/`          | Lottie 애니메이션 파일                           | `.json`        |

### 아이콘 분류 기준

- **CSIconSection** — 버튼, 입력 필드, 리스트 등 UI 요소 내부에 삽입되는 작은 아이콘 (화살표, 검색, 체크, 경고 등)
- **CSIconEntire** — 페이지 전체 또는 섹션을 장식하는 큰 일러스트/캐릭터 이미지 (로그인 배경, 무너 캐릭터, 빈 결과 이미지 등)

### 새 이미지/아이콘 추가 방법

1. 파일을 적절한 폴더에 저장합니다.
2. 해당 폴더의 `index.ts`에 import 및 export를 추가합니다.

```ts
// 예: src/assets/icon/CSIconSection/index.ts
import newIcon from './newIcon.svg';
export { newIcon };
```

3. 아이콘은 `CSIcon` 컴포넌트의 `icon` prop으로 키 이름을 전달해 사용합니다.

```tsx
<CSIcon icon="newIcon" width={24} height={24} />
```

4. 일반 이미지(`src/assets/image/`)는 `src/assets/index.ts`에 export되어 있지 않으므로, 해당 폴더의 `index.ts`에서 직접 import해서 사용합니다.
5. 일반 이미지 렌더링은 `next/image`를 기본으로 사용합니다. `<img>` 태그는 예외 승인 케이스에서만 사용합니다.

### Lottie 애니메이션 추가 방법

1. `.json` 파일을 `src/assets/animation/{이름}/` 폴더에 저장합니다.
2. 해당 폴더에 `index.ts`를 만들어 export합니다.
3. `src/assets/animation/index.ts`에 re-export를 추가합니다.
4. `CSLottie` 컴포넌트를 사용해 렌더링합니다.

### 주의사항

- 아이콘은 반드시 `.svg` 포맷을 사용합니다. `.png` 아이콘 추가는 금지합니다.
- `src/assets/index.ts`는 `icons`, `animations`, `pdf`만 export합니다. `image`는 포함되지 않으므로 직접 경로로 import합니다.
- 이미지를 `public/` 폴더에 저장하지 않습니다. 모든 에셋은 `src/assets/` 하위에서 관리합니다.
- 동의서 이미지처럼 도메인별로 분류가 필요한 경우 `src/assets/image/{도메인}/` 하위 폴더를 만들어 관리합니다.
- `<img>` 태그를 사용해야 할 때는 사용 목적/필요성과 대체 불가 사유를 먼저 정리하고, 확인(승인) 후 반영합니다.

---

## 10. 폰트

- 기본 폰트: `Pretendard` (전역 적용)
- 폰트 파일 위치: `src/assets/font/`
- 임의로 다른 폰트를 지정하지 않습니다.

---

## 11. CSInput 상세 사용법

`CSInput`은 `inputType` prop이 **필수**입니다. `InputTypeEnum`에서 값을 가져옵니다.

```tsx
import { InputTypeEnum } from '@/enums';
import { CSInput } from '@/components';

// ❌ 잘못된 사용 - inputType 누락
<CSInput placeholder="입력" />

// ✅ 올바른 사용
<CSInput inputType={InputTypeEnum.TEXT} useType="T2" placeholder="이름을 입력하세요" />
```

### InputTypeEnum 값 목록

| 값                               | 용도                           |
| -------------------------------- | ------------------------------ |
| `InputTypeEnum.TEXT`             | 일반 텍스트                    |
| `InputTypeEnum.NUMBER`           | 숫자 입력                      |
| `InputTypeEnum.PASSWORD`         | 비밀번호                       |
| `InputTypeEnum.PHONE`            | 휴대폰 번호 (자동 포맷)        |
| `InputTypeEnum.NAME`             | 이름                           |
| `InputTypeEnum.SSN`              | 주민등록번호 (마스킹 지원)     |
| `InputTypeEnum.BUSINESS`         | 사업자번호                     |
| `InputTypeEnum.DRIVER_LICENSE`   | 운전면허번호                   |
| `InputTypeEnum.CORPORATE_NUMBER` | 법인번호                       |
| `InputTypeEnum.CARD_NUMBER`      | 카드번호                       |
| `InputTypeEnum.CARD_EXPIRY_DATE` | 카드 유효기간                  |
| `InputTypeEnum.BANK_ACCOUNT`     | 계좌번호                       |
| `InputTypeEnum.DATE`             | 날짜                           |
| `InputTypeEnum.PASSPORT`         | 여권번호                       |
| `InputTypeEnum.SELECT`           | 셀렉트 타입 (읽기 전용 표시용) |
| `InputTypeEnum.USER_ID`          | 사용자 ID                      |

### useType — UI 스타일 변형

| 값          | 설명                  | 주 사용처                     |
| ----------- | --------------------- | ----------------------------- |
| `T1`        | 라벨 + 밑줄 스타일    | 간편 입력, 상단 폼            |
| `T2`        | 회색 배경 + 사각형    | 일반 폼 입력 (가장 많이 사용) |
| `T3`        | 회색 배경 + 다중 섹션 | 검색 필드 등                  |
| `T4`        | 흰색 배경             | 고객정보 변경, 팝업 내 입력   |
| `T4_border` | 흰색 배경 + 테두리    | T4 변형                       |
| `T5`        | 스타일 변형           | 스토리북 확인                 |
| `T6`        | 스타일 변형           | 스토리북 확인                 |

### 주요 선택적 props

```tsx
// 마스킹 처리 (주민번호 뒷자리 등)
<CSInput inputType={InputTypeEnum.SSN} isUseMasking />

// blur 시 유효성 검증 (사업자번호, 휴대폰 번호)
<CSInput inputType={InputTypeEnum.PHONE} isUseBlurValid />

// 삭제 버튼 표시
<CSInput inputType={InputTypeEnum.TEXT} useDeleteButton />
```

### 전체 props 목록

| prop                      | 타입                                                          | 필수 | 설명                                        |
| ------------------------- | ------------------------------------------------------------- | ---- | ------------------------------------------- |
| `inputType`               | `InputTypeEnum`                                               | ✅   | 입력 타입                                   |
| `useType`                 | `'T1'\|'T2'\|'T3'\|'T4'\|'T4_border'\|'T5'\|'T6'`             |      | UI 스타일 변형                              |
| `value`                   | `string \| number`                                            |      | 입력값 (controlled)                         |
| `defaultValue`            | `string \| number`                                            |      | 초기값 (uncontrolled)                       |
| `onChange`                | `(e: string \| number, authed?: boolean) => void`             |      | 변경 콜백 (`authed`: 휴대폰 인증 완료 여부) |
| `onBlur`                  | `(e: FocusEvent<HTMLInputElement>, authed?: boolean) => void` |      | blur 콜백                                   |
| `onValidBlur`             | `(e: string \| number, authed?: boolean) => void`             |      | blur 후 유효성 검증 콜백                    |
| `placeholder`             | `string`                                                      |      | placeholder 텍스트                          |
| `label`                   | `string`                                                      |      | 입력 필드 레이블                            |
| `labelType`               | `'row'\|'col'`                                                |      | 레이블 정렬 방향                            |
| `error`                   | `ReactNode`                                                   |      | 에러 메시지                                 |
| `required`                | `boolean`                                                     |      | 필수 여부                                   |
| `withAsterisk`            | `boolean`                                                     |      | 필수 별표 표시 여부                         |
| `disabled`                | `boolean`                                                     |      | 비활성화                                    |
| `readOnly`                | `boolean`                                                     |      | 읽기 전용                                   |
| `maxLength`               | `number`                                                      |      | 최대 입력 글자 수                           |
| `leftSection`             | `ReactNode`                                                   |      | 입력 필드 왼쪽 영역                         |
| `rightSection`            | `ReactNode`                                                   |      | 입력 필드 오른쪽 영역                       |
| `isUseMasking`            | `boolean`                                                     |      | 마스킹 처리 여부                            |
| `isUseBlurValid`          | `boolean`                                                     |      | blur 시 유효성 검증 여부                    |
| `useDeleteButton`         | `boolean`                                                     |      | 삭제(X) 버튼 표시 여부                      |
| `isLoading`               | `boolean`                                                     |      | 로딩 상태 표시                              |
| `w`                       | `CSSProperties['width']`                                      |      | 입력 필드 너비                              |
| `options`                 | `ICSSelectListData[]`                                         |      | SELECT 타입 전용 옵션 목록                  |
| `bankCode`                | `string`                                                      |      | BANK_ACCOUNT 타입 전용 은행 코드            |
| `datePattern`             | `string`                                                      |      | DATE 타입 전용 포맷 (기본: `YYYY-MM-DD`)    |
| `isOnlyPhone`             | `boolean`                                                     |      | PHONE 타입 전용 — 휴대폰 번호만 허용        |
| `checkBusinessClosure`    | `boolean`                                                     |      | BUSINESS 타입 전용 — 휴/폐업 조회 여부      |
| `isEmailId`               | `boolean`                                                     |      | 이메일 아이디 입력 여부 (영문+숫자만 허용)  |
| `isEmailDomain`           | `boolean`                                                     |      | 이메일 도메인 입력 여부                     |
| `isNonIndividualBusiness` | `boolean`                                                     |      | BUSINESS 타입 전용 — 개인사업자 미검증      |
| `isInvalidClear`          | `boolean`                                                     |      | blur 유효성 실패 시 값 초기화 여부          |
| `preventFocus`            | `boolean`                                                     |      | focus 이벤트 비활성화 여부                  |

---

## 12. CSButton 상세 사용법

버튼은 `designSize` prop으로 크기를 지정합니다. `designSize` 없이 사용하면 디자인 기준 크기와 달라질 수 있습니다.

### designSize 값 목록

| 값           | 크기                  | 용도                                                                   |
| ------------ | --------------------- | ---------------------------------------------------------------------- |
| `m`          | 너비 200px, 높이 50px | 페이지 주요 액션 버튼                                                  |
| `s`          | 너비 150px, 높이 44px | 보조 버튼, 쌍으로 쓰는 버튼                                            |
| `default-xs` | 초소형 (height 32px)  | 테이블 내 인라인 버튼 — 테두리(`border`) 자동 적용됨, 별도 추가 불필요 |
| `default-s`  | 소형 (height 40px)    | 인라인 버튼                                                            |
| `default-m`  | 중간 (height 48px)    | 일반 폼 내 버튼                                                        |
| `icon-m`     | 48×48px 정사각형      | 아이콘만 있는 버튼 — 크기 고정이므로 width/height 별도 지정 불필요     |

### 사용 예시

```tsx
import { CSButton } from '@/components';

// 주요 액션 버튼
<CSButton label="확인" variant="filled" color="default" designSize="m" />

// 취소 버튼 (쌍으로 사용)
<CSButton label="취소" variant="outline" color="buttonBlack" designSize="s" />

// 검정 버튼 (기본 색상)
<CSButton label="저장" variant="filled" color="buttonBlack" designSize="m" />
```

### color 기본값 규칙

- 핑크 브랜드 버튼: `color="default"`
- 검정 버튼: `color="buttonBlack"` (가장 많이 사용)
- 흰색 버튼: `color="buttonWhite"`

### 스타일 오버라이드 원칙 (`!important` 사용 기준)

- `border-radius`, `height`, `padding`, `font-size`, `color` 같은 기본 UI 속성은 먼저 **Mantine prop** 또는 **공통 컴포넌트 prop**(`designSize`, `radius`, `variant`, `color`, `w`, `h`, `classNames`)으로 해결합니다.
- 화면(도메인) CSS에서 `!important`로 덮어쓰는 방식은 **기본 금지**합니다.
- 필요한 표현을 prop으로 해결할 수 없다면, 화면 CSS 오버라이드보다 **공통 컴포넌트 API/토큰을 먼저 보완**한 뒤 사용합니다.
- `className` 주입 시 공통 컴포넌트의 기본 클래스가 유지되는지(merge되는지) 반드시 확인합니다. 기본 클래스가 덮이면 `designSize`/radius 토큰이 무효화될 수 있습니다.
- `!important`는 아래 조건을 모두 만족할 때만 예외 허용합니다.
  - 외부 라이브러리 inline style 또는 높은 specificity 충돌로 prop 기반 해결이 불가능함이 확인된 경우
  - 적용 범위를 단일 selector/단일 화면으로 제한한 경우
  - 사유와 제거 계획(TODO)을 코드 또는 PR 설명에 명시한 경우

버튼 radius 예시 (before / after):

**Before (지양)** — 화면 CSS에서 `!important`로 강제 오버라이드

```tsx
<CSButton className={styles.customer_info_button} designSize="default-m" label="공공마이데이터" />
```

```css
.customer_info_button {
  border-radius: 8px !important;
}
```

**After (권장 1)** — 공통 토큰(`designSize`)으로 해결

```tsx
<CSButton designSize="default-m" label="공공마이데이터" />
```

**After (권장 2)** — 토큰으로 해결 불가 시 공통 컴포넌트 API 확장 후 사용

```tsx
// CSButton 공통 컴포넌트에 preset/variant를 추가한 뒤 화면에서 사용
<CSButton designSize="default-m" radiusPreset="form-inline" label="공공마이데이터" />
```

- `CSButton`은 기본적으로 `designSize="default-m"` 등 디자인 토큰을 우선 사용합니다.
- 토큰과 다른 radius가 반복적으로 필요하면 화면별 `!important`가 아니라, `CSButton` 공통 API 확장으로 해결합니다.

---

## 13. Alert / Confirm 패턴

알림창과 확인창은 반드시 `openAlert` 유틸리티를 사용합니다. `window.alert`, `window.confirm`, 커스텀 모달을 직접 만들지 않습니다.

```tsx
import { openAlert } from '@/utils';
```

### 단순 알림 (alert)

```tsx
openAlert.open({
  title: '안내',
  message: '처리가 완료되었습니다.',
});
```

### 경고 알림 (warning)

```tsx
openAlert.warning({
  title: '주의',
  message: '입력값을 확인해 주세요.',
});
```

### 확인/취소 다이얼로그 (confirm)

```tsx
const confirmed = await openAlert.confirm({
  title: '삭제 확인',
  message: '정말 삭제하시겠습니까?',
});

if (confirmed) {
  // 확인 클릭
} else {
  // 취소 클릭
}
```

### API 에러 처리

```tsx
try {
  await someApiCall();
} catch (error) {
  openAlert.handleAPIError(error);
}
```

---

## 14. 새 컴포넌트 추가 절차

새 공용 컴포넌트를 추가할 때 아래 파일 구조를 따릅니다.

### 파일 구조

```
src/components/atom/CSNewComponent/
├── CSNewComponent.tsx          # 컴포넌트 본체
├── CSNewComponent.module.css   # CSS 모듈 (필요 시)
└── index.ts                    # named export

src/types/components/atom/
└── ICSNewComponentProps.d.ts   # props 타입 정의

src/stories/atom/CSNewComponent/
└── CSNewComponent.stories.tsx  # 스토리북
```

### 각 파일 필수 사항

**컴포넌트 본체 (`CSNewComponent.tsx`):**

```tsx
import { CSButton } from '@/components';
import type { ICSNewComponentProps } from '@/types';
import styles from './CSNewComponent.module.css';

const CSNewComponent = ({ ... }: ICSNewComponentProps) => {
  return (...);
};

export default CSNewComponent;
```

**index.ts:**

```ts
export { default as CSNewComponent } from './CSNewComponent';
```

**카테고리 barrel (`src/components/atom/index.ts`)에 추가:**

```ts
export * from './CSNewComponent';
```

**스토리 파일 패턴:**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CSNewComponent } from '@/components';

const meta: Meta<typeof CSNewComponent> = {
  title: 'SmartCS/공통컴포넌트/atom/CSNewComponent',
  component: CSNewComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '설명. 컴포넌트 식별자 ID: SCSCO-XXXX',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CSNewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

---

## 15. CSCommonModal / CSCommonAlert 상세 사용법

### openAlert vs CSCommonModal — 언제 무엇을 쓰나

| 상황                                        | 사용할 것                                     |
| ------------------------------------------- | --------------------------------------------- |
| 단순 안내 메시지, 확인/취소 다이얼로그      | `openAlert` (섹션 13 참고)                    |
| 폼, 테이블 등 복잡한 콘텐츠가 들어가는 모달 | `CSCommonModal` 직접 사용                     |
| CSCommonAlert를 직접 JSX로 렌더링           | 특수한 경우에만 — 일반적으로 `openAlert` 사용 |

### CSCommonModal 사용법

`CSCommonModal`은 Mantine `Modal`을 기반으로 하며, `opened`/`onClose`가 필수입니다.

```tsx
import { useState } from 'react';
import { CSCommonModal } from '@/components';
import { CSInput } from '@/components';
import { InputTypeEnum } from '@/enums';

const [opened, setOpened] = useState(false);

<CSCommonModal
  opened={opened}
  onClose={() => setOpened(false)}
  title="고객 정보 수정"
  size="600px"
  isFooter
  onConfirm={() => {
    // 저장 처리
    setOpened(false);
  }}
  onCancel={() => setOpened(false)}
  confirmText="저장"
  cancelText="취소"
>
  {/* 모달 본문 — 자유롭게 작성 */}
  <CSInput inputType={InputTypeEnum.NAME} useType="T4" label="이름" />
</CSCommonModal>;
```

### CSCommonModal 주요 props

| prop                    | 타입                                                  | 필수 | 설명                                              |
| ----------------------- | ----------------------------------------------------- | ---- | ------------------------------------------------- |
| `opened`                | `boolean`                                             | ✅   | 모달 열림 여부                                    |
| `onClose`               | `() => void`                                          | ✅   | 닫기 콜백                                         |
| `title`                 | `ReactNode`                                           |      | 모달 제목                                         |
| `children`              | `ReactNode`                                           |      | 모달 본문 콘텐츠                                  |
| `size`                  | `string`                                              |      | 모달 너비 (예: `'600px'`, `'lg'`)                 |
| `centered`              | `boolean`                                             |      | 화면 중앙 배치 여부 (Mantine `ModalProps`)        |
| `isFooter`              | `boolean`                                             |      | 하단 확인/취소 버튼 영역 표시 여부 (기본: `true`) |
| `headerContent`         | `ReactNode`                                           |      | 스크롤 영역 제외 — 헤더 고정 콘텐츠               |
| `onConfirm`             | `() => void`                                          |      | 확인 버튼 콜백                                    |
| `onCancel`              | `() => void`                                          |      | 취소 버튼 콜백                                    |
| `confirmText`           | `string`                                              |      | 확인 버튼 문구 (기본: `'확인'`)                   |
| `cancelText`            | `string`                                              |      | 취소 버튼 문구 (기본: `'취소'`)                   |
| `hideConfirmButton`     | `boolean`                                             |      | 확인 버튼 숨김                                    |
| `hideCancelButton`      | `boolean`                                             |      | 취소 버튼 숨김                                    |
| `hideSpecialButton`     | `boolean`                                             |      | special 버튼 숨김                                 |
| `disabledConfirmButton` | `boolean`                                             |      | 확인 버튼 비활성화                                |
| `disabledCancelButton`  | `boolean`                                             |      | 취소 버튼 비활성화                                |
| `onSpecial`             | `() => void`                                          |      | special 버튼 콜백                                 |
| `specialText`           | `string`                                              |      | special 버튼 문구                                 |
| `justify`               | `'center'\|'flex-start'\|'flex-end'\|'space-between'` |      | 버튼 그룹 정렬                                    |
| `marginTop`             | `number\|string`                                      |      | 버튼 그룹 상단 여백 (드물게 사용)                 |
| `buttonGap`             | `number\|string`                                      |      | 버튼 간격                                         |
| `withCloseButton`       | `boolean`                                             |      | 우상단 X 버튼 표시 여부                           |

### CSCommonAlert 주요 props (직접 사용 시)

> 대부분의 경우 `openAlert`를 사용합니다. 아래는 JSX로 직접 렌더링해야 하는 예외 상황용입니다.

| prop                    | 타입                                                  | 필수 | 설명                                                |
| ----------------------- | ----------------------------------------------------- | ---- | --------------------------------------------------- |
| `opened`                | `boolean`                                             | ✅   | 알럿 열림 여부                                      |
| `type`                  | `'alert'\|'confirm'\|'popup'\|'special'`              |      | 알럿 종류 (`alert`: 버튼 1개, `confirm`: 버튼 2개)  |
| `title`                 | `string \| ReactNode`                                 |      | 타이틀 영역                                         |
| `message`               | `string \| ReactNode`                                 |      | 메시지 영역                                         |
| `info`                  | `ReactNode`                                           |      | 추가 정보 영역                                      |
| `icon`                  | `string`                                              |      | 아이콘 키 (`CSIcon` 키 이름, 예: `'orangeWarning'`) |
| `hideIcon`              | `boolean`                                             |      | 아이콘 숨김                                         |
| `onConfirm`             | `(payload?: any) => void`                             | ✅   | 확인 버튼 콜백                                      |
| `onCancel`              | `() => void`                                          | ✅   | 취소 버튼 콜백                                      |
| `onSpecial`             | `() => void`                                          |      | special 버튼 콜백                                   |
| `confirmText`           | `string`                                              |      | 확인 버튼 문구                                      |
| `cancelText`            | `string`                                              |      | 취소 버튼 문구                                      |
| `specialText`           | `string`                                              |      | special 버튼 문구                                   |
| `hideConfirmButton`     | `boolean`                                             |      | 확인 버튼 숨김                                      |
| `hideCancelButton`      | `boolean`                                             |      | 취소 버튼 숨김                                      |
| `hideSpecialButton`     | `boolean`                                             |      | special 버튼 숨김                                   |
| `disabledConfirmButton` | `boolean`                                             |      | 확인 버튼 비활성화                                  |
| `disabledCancelButton`  | `boolean`                                             |      | 취소 버튼 비활성화                                  |
| `marginTop`             | `number\|string`                                      |      | 버튼 그룹 상단 여백 (드물게 사용)                   |
| `sectionSpacing`        | `{ title?: string; message?: string; info?: string }` |      | 각 영역 상단 여백 커스텀                            |
| `preventConfirmClose`   | `boolean`                                             |      | 확인 클릭 시 자동 닫힘 방지                         |
| `closeOnEscape`         | `boolean`                                             |      | ESC 키로 닫기 여부                                  |
| `closeOnClickOutside`   | `boolean`                                             |      | 외부 클릭으로 닫기 여부                             |

---

## 16. 검수 체크리스트

Figma 디자인을 코드로 변환하거나 검수할 때 아래 항목을 확인합니다.

- [ ] Mantine 또는 공용 컴포넌트 우선 사용
- [ ] 순수 HTML 태그 사용 시, 사용 목적/필요성(대체 불가 사유) 정리 및 사전 확인 완료
- [ ] UI 아이콘은 `CSIcon` 컴포넌트 사용
- [ ] 일반 이미지는 `next/image` 사용
- [ ] `<img>` 태그 이미지 사용 시, 사용 목적/필요성(대체 불가 사유) 정리 및 사전 확인 완료
- [ ] 정의된 색상은 CSS 변수 또는 Mantine 컬러 팔레트로 사용
- [ ] 미정의 색상은 토큰 추가 후 사용, 불가 시 hex 임시 사용 사전 확인 완료
- [ ] 폼 레이아웃은 `CSFormRow` + `CSFormField` 패턴 사용
- [ ] `CSInput`에 `inputType` (InputTypeEnum) 및 `useType` 지정 여부 확인
- [ ] 버튼은 `CSButton` 사용 (`color`, `variant`, `designSize` prop 확인)
- [ ] 알림/확인창은 `openAlert` 유틸리티 사용 (`window.alert` / `window.confirm` 미사용)
- [ ] 복잡한 모달은 `CSCommonModal` 사용, 단순 알림은 `openAlert` 사용
- [ ] 스토리북에서 해당 컴포넌트의 props 및 variant 확인
- [ ] import는 alias 기본 사용, 배럴/동일 디렉토리 내부만 상대 경로 허용
- [ ] 레이어 간 import 시 루트 배럴(`@/components`) 재경유로 인한 순환 참조 여부 확인
- [ ] 공통 CSS 클래스 재사용 가능 여부 확인
- [ ] TypeScript 타입 및 Enum 활용 여부 확인
- [ ] 새 컴포넌트 추가 시 타입 파일 + 스토리 파일 함께 작성
