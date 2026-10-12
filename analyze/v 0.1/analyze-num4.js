/**
 * num4 분석 및 다음 회차 예측 (통계적 참고용)
 *
 * 사용법:
 *   node analyze-num4.js <num3>     예) node analyze-num4.js 18
 *   (num3 인자를 생략하면 방법 E로 num4 전체 분포에서 자체 선택)
 *
 * 흐름:
 *   1) num3 값을 커맨드라인 param으로 받음 (없으면 방법 E로 자체 선택)
 *   2) 선택된 num3 값을 반영하여 num4 예측
 *      (num4는 항상 num3보다 크므로, num3보다 큰 값만 후보로 사용)
 *
 * ⚠️ 로또는 독립 시행(완전 무작위)입니다.
 *    아래 결과는 데이터 분석 연습/참고용이며 적중을 보장하지 않습니다.
 */

const data = require("./lotto-numbers.json");

const n3 = data.map((d) => d.num3);
const n4 = data.map((d) => d.num4);
const N = data.length;
const last = data[N - 1];

console.log("=".repeat(55));
console.log(" num4 분석 리포트 (num3 선택값 반영)");
console.log("=".repeat(55));
console.log(`총 회차        : ${N}회`);
console.log(`마지막 회차    : ${last.lot_seq}회 (${last.lot_date})`);
console.log(`예측 대상      : ${last.lot_seq + 1}회`);
console.log("");

// --- 공통: 빈도표 & 빈도 가중 랜덤 ---
function buildFreq(arr) {
  const f = {};
  arr.forEach((v) => (f[v] = (f[v] || 0) + 1));
  return f;
}
function freqSorted(freq) {
  return Object.entries(freq)
    .map(([val, cnt]) => ({ val: Number(val), cnt }))
    .sort((a, b) => b.cnt - a.cnt || a.val - b.val);
}
// 특정 후보 집합(sorted) 안에서만 빈도 가중 랜덤 추출
function weightedRandom(sorted) {
  const total = sorted.reduce((a, b) => a + b.cnt, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const { val, cnt } of sorted) {
    acc += cnt;
    if (r < acc) return val;
  }
  return sorted[sorted.length - 1].val;
}

// =========================================================
// STEP 1. num3 값 결정
//   - 커맨드라인 인자로 받음:  node analyze-num4.js <num3>
//     예) node analyze-num4.js 18
//   - 인자가 없으면 방법 E (num4 전체 분포에서 빈도 가중 랜덤 5개 → 1개) 로 자체 선택
// =========================================================
const n4Freq = buildFreq(n4);
const n4Sorted = freqSorted(n4Freq);

const argNum3 = process.argv[2]; // 세 번째 인자 (node, 파일경로 다음)
let n3Pick;
let n3Samples = null;

if (argNum3 !== undefined) {
  // param 으로 받은 경우
  const parsed = Number(argNum3);
  if (!Number.isInteger(parsed) || parsed < 1) {
    console.error(`[오류] num3 인자가 올바르지 않습니다: "${argNum3}"`);
    console.error("사용법: node analyze-num4.js <num3(1 이상의 정수)>");
    console.error("예시  : node analyze-num4.js 18");
    process.exit(1);
  }
  n3Pick = parsed;
} else {
  // 인자가 없으면 방법 E 로 자체 선택 (하위 호환) - num4 전체 분포 사용
  n3Samples = Array.from({ length: 5 }, () => weightedRandom(n4Sorted));
  n3Pick = n3Samples[Math.floor(Math.random() * n3Samples.length)];
}

console.log("-".repeat(55));
console.log(" [STEP 1] num3 값 결정");
console.log("-".repeat(55));
if (argNum3 !== undefined) {
  console.log(` 입력 방식          : 커맨드라인 param`);
} else {
  console.log(` 입력 방식          : param 없음 → 방법 E 자체 선택`);
  console.log(` 빈도 가중 랜덤 5개 : ${n3Samples.join(", ")}`);
}
console.log(` 선택된 num3        : ${n3Pick}`);
console.log("");

// =========================================================
// STEP 2. num4 분석 (전체 데이터 기준)
// =========================================================
console.log("-".repeat(55));
console.log(" [1] num4 빈도 분석 (범위: " + Math.min(...n4) + " ~ " + Math.max(...n4) + ")");
console.log("-".repeat(55));
console.log(" 값  | 횟수 | 비율   | 막대");
n4Sorted.forEach(({ val, cnt }) => {
  const pct = ((cnt / N) * 100).toFixed(1);
  console.log(
    ` ${String(val).padStart(2)} | ${String(cnt).padStart(3)}  | ${pct.padStart(4)}% | ${"#".repeat(cnt)}`
  );
});
const n4Mode = n4Sorted[0];
console.log(`\n 최빈값(mode): ${n4Mode.val} (${n4Mode.cnt}회, ${((n4Mode.cnt / N) * 100).toFixed(1)}%)`);

// --- 통계량 ---
const sum = n4.reduce((a, b) => a + b, 0);
const mean = sum / N;
const sorted = [...n4].sort((a, b) => a - b);
const median = N % 2 === 0 ? (sorted[N / 2 - 1] + sorted[N / 2]) / 2 : sorted[(N - 1) / 2];
const std = Math.sqrt(n4.reduce((a, b) => a + (b - mean) ** 2, 0) / N);

console.log("-".repeat(55));
console.log(" [2] num4 통계량");
console.log("-".repeat(55));
console.log(` 평균(mean)     : ${mean.toFixed(2)}`);
console.log(` 중앙값(median) : ${median}`);
console.log(` 최빈값(mode)   : ${n4Mode.val}`);
console.log(` 표준편차(std)  : ${std.toFixed(2)}`);
console.log(` 최소 / 최대    : ${Math.min(...n4)} / ${Math.max(...n4)}`);

// =========================================================
// STEP 3. 선택된 num3 를 반영한 num4 (num4 > num3 제약)
// =========================================================
const condSorted = n4Sorted.filter((x) => x.val > n3Pick);
const condVals = n4.filter((v) => v > n3Pick);
const condMean = condVals.length
  ? condVals.reduce((a, b) => a + b, 0) / condVals.length
  : null;
const condMedianSorted = [...condVals].sort((a, b) => a - b);
const condMedian = condVals.length
  ? condVals.length % 2 === 0
    ? (condMedianSorted[condVals.length / 2 - 1] + condMedianSorted[condVals.length / 2]) / 2
    : condMedianSorted[(condVals.length - 1) / 2]
  : null;

console.log("-".repeat(55));
console.log(` [3] 선택된 num3(=${n3Pick}) 반영 → num4 후보 (num4 > ${n3Pick})`);
console.log("-".repeat(55));
console.log(` 조건 만족 과거 데이터 수 : ${condVals.length}개 / ${N}개`);
if (condVals.length) {
  console.log(` 조건부 평균              : ${condMean.toFixed(2)}`);
  console.log(` 조건부 중앙값            : ${condMedian}`);
  console.log(` 조건부 최빈값            : ${condSorted[0].val} (${condSorted[0].cnt}회)`);
} else {
  console.log(" (조건을 만족하는 과거 데이터가 없습니다)");
}

// =========================================================
// STEP 4. 최종 num4 예측값
// =========================================================
const condSamples = condVals.length
  ? Array.from({ length: 5 }, () => weightedRandom(condSorted))
  : [];

console.log("=".repeat(55));
console.log(` [4] ${last.lot_seq + 1}회 예측값 (참고용)`);
console.log("=".repeat(55));
console.log(` 선택된 num3                      : ${n3Pick}`);
if (condVals.length) {
  console.log(` 방법 A) 조건부 최빈값            : ${condSorted[0].val}`);
  console.log(` 방법 B) 조건부 평균 반올림       : ${Math.round(condMean)}`);
  console.log(` 방법 C) 조건부 중앙값            : ${condMedian}`);
  console.log(` 방법 E) 조건부 빈도 가중 랜덤 5개 : ${condSamples.join(", ")}`);
} else {
  console.log(" 조건 만족 데이터가 없어 예측 불가");
}
console.log("");
console.log(" ⚠️  로또는 독립 시행이므로 위 값은 통계적 참고치일 뿐");
console.log("     실제 적중을 보장하지 않습니다.");
console.log("=".repeat(55));
