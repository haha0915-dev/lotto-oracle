# num1 분석 출력 항목 매핑

원본 [analyze-num1.js](../analyze/v%200.1/analyze-num1.js)의 콘솔 출력과
[analyze_num1 SQL 함수](./migrations/20261014085000_create_analyze_num1.sql)의
JSON 반환값을 비교한 문서입니다.

JSON 경로는 반환된 객체를 기준으로 하며, `[]`는 배열의 각 항목을 의미합니다.

## 0. 기본 정보

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 설명 |
|---|---|---|---|
| 총 회차 | `N` | `summary.drawCount` | 분석한 행 수 |
| 시작 회차 | `first.lot_seq` | `summary.firstDraw.lot_seq` | 최초 회차 |
| 시작 날짜 | `first.lot_date` | `summary.firstDraw.lot_date` | 최초 회차 날짜 |
| 마지막 회차 | `last.lot_seq` | `summary.lastDraw.lot_seq` | 마지막 회차 |
| 마지막 날짜 | `last.lot_date` | `summary.lastDraw.lot_date` | 마지막 회차 날짜 |
| 예측 대상 | `last.lot_seq + 1` | `summary.targetDraw` | 마지막 회차 + 1 |

## 1. 빈도 분석

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 표시 방법 및 설명 |
|---|---|---|---|
| num1 범위: 최소 | `Math.min(...n1)` | `frequency.min` | 숫자 그대로 |
| num1 범위: 최대 | `Math.max(...n1)` | `frequency.max` | 숫자 그대로 |
| 값 | `val` | `frequency.values[].value` | 출현한 번호 |
| 횟수 | `cnt` | `frequency.values[].count` | 출현 횟수 |
| 비율 | `(cnt / N * 100).toFixed(1)` | `frequency.values[].percentage` | 소수점 1자리 + `%` |
| 막대 | `"#".repeat(cnt)` | 직접 반환하지 않음 | `count`만큼 `#`를 반복하면 재현 가능 |
| 최빈값 | `mode.val` | `frequency.mode.value` | 가장 많이 출현한 번호 |
| 최빈값 횟수 | `mode.cnt` | `frequency.mode.count` | 최빈값 출현 횟수 |
| 최빈값 비율 | `(mode.cnt / N * 100).toFixed(1)` | `frequency.mode.percentage` | 소수점 1자리 + `%` |

두 구현 모두 횟수 내림차순, 번호 오름차순으로 정렬합니다.
공동 최빈값이 있으면 작은 번호를 선택합니다.

## 2. 통계량

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 표시 방법 및 설명 |
|---|---|---|---|
| 평균 | `mean.toFixed(2)` | `statistics.mean` | 소수점 2자리 |
| 중앙값 | `median` | `statistics.median` | 숫자 그대로 |
| 최빈값 | `mode.val` | `statistics.mode` | 숫자 그대로 |
| 표준편차 | `std.toFixed(2)` | `statistics.standardDeviation` | 소수점 2자리 |
| 최소 | `Math.min(...n1)` | `statistics.min` | 숫자 그대로 |
| 최대 | `Math.max(...n1)` | `statistics.max` | 숫자 그대로 |

표준편차는 두 구현 모두 분산 계산 시 `N`으로 나누는 모집단 방식입니다.

## 3. 이론적 최솟값 분포 비교

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 표시 방법 및 설명 |
|---|---|---|---|
| 비교 번호 | `k` | `theoreticalComparison.topEight[].value` | 1~8 |
| 이론확률 | `(theoProb[k] * 100).toFixed(1)` | `theoreticalComparison.topEight[].probability` | 100을 곱한 뒤 소수점 1자리 + `%` |
| 실제비율 | `((freq[k] \|\| 0) / N * 100).toFixed(1)` | `theoreticalComparison.topEight[].actualPercentage` | 소수점 1자리 + `%` |
| 이론적 기댓값 | `theoMean.toFixed(2)` | `theoreticalComparison.theoreticalMean` | 소수점 2자리 |
| 실제 평균 | `mean.toFixed(2)` | `theoreticalComparison.actualMean` | 소수점 2자리 |

- `probability`는 0~1, `actualPercentage`는 0~100 단위입니다.
- 제목의 "상위 8개"는 빈도 순위가 아니라 번호 1~8을 뜻합니다.
- 이론 분포는 `num1`이 당첨 번호 6개 중 최소값이라는 전제입니다.

## 4. 최근 추세

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 표시 방법 및 설명 |
|---|---|---|---|
| 최근 회차 수 | `recentWindow` | `recentTrend.window` | JS 제목은 항상 10, SQL은 실제 분석 수인 최대 10 |
| 최근 num1 값 | `recent.join(", ")` | `recentTrend.values` | 배열을 `, `로 연결 |
| 최근 단순평균 | `recentMean.toFixed(2)` | `recentTrend.mean` | 소수점 2자리 |
| 최근 가중평균 | `weightedMean.toFixed(2)` | `recentTrend.weightedMean` | 소수점 2자리 |

가중치는 오래된 회차부터 `1, 2, ...` 순서로 커집니다.

## 5. 종합 예측값

| JS 출력 항목 | JS 값 | SQL JSON 경로 | 설명 |
|---|---|---|---|
| 예측 대상 회차 | `last.lot_seq + 1` | `summary.targetDraw` | 예측 제목에 사용 |
| 방법 A: 최빈값 | `mode.val` | `predictions.mode` | 가장 많이 출현한 번호 |
| 방법 B: 평균 반올림 | `Math.round(mean)` | `predictions.roundedMean` | 전체 평균 반올림 |
| 방법 C: 중앙값 | `median` | `predictions.median` | 중앙값 그대로, 소수 가능 |
| 방법 D: 최근 가중평균 반올림 | `Math.round(weightedMean)` | `predictions.roundedRecentWeightedMean` | 최근 가중평균 반올림 |
| 방법 E: 빈도 가중 랜덤 5개 | `samples.join(", ")` | `predictions.frequencyWeightedRandomSamples` | 배열을 `, `로 연결 |
| 독립 시행 및 적중 보장 불가 안내 | 마지막 경고 문구 | `disclaimer` | SQL에서는 같은 취지의 영문 안내 |

랜덤 5개는 추출 방식이 같지만 JS와 SQL이 별도로 난수를 생성하므로
실제 결과가 같을 필요는 없습니다. 중복을 허용합니다.

## SQL에서 추가로 반환하는 항목

| SQL JSON 경로 | JS와의 차이 |
|---|---|
| `summary.firstDraw.num1` | JS 기본 정보에는 출력하지 않는 최초 회차의 num1 |
| `summary.lastDraw.num1` | JS 기본 정보에는 출력하지 않는 마지막 회차의 num1 |
| `theoreticalComparison.distribution` | JS 내부에서 계산하지만 콘솔에는 전체를 출력하지 않는 1~40 분포 |

## 결과 비교 시 전제

- JS는 JSON 파일의 배열 순서, SQL은 `lot_seq` 순서로 첫 회차, 마지막 회차,
  최근 회차를 결정합니다.
- JS는 파일 데이터를 분석하고, SQL은 호출자의 권한과 RLS로 조회 가능한
  테이블 행을 분석합니다.
- 동일한 데이터와 회차 순서라면 랜덤 표본을 제외한 결과는 일치해야 합니다.
  부동소수점 연산에 따른 미세한 차이는 있을 수 있습니다.
- JS는 출력 시 소수점 자릿수를 제한하지만 SQL은 계산값을 숫자로 반환합니다.
- JS의 제목, 구분선, 공백, 막대는 표시용 요소라 JSON에 직접 포함되지 않습니다.
