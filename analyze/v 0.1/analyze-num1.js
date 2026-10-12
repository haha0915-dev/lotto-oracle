/**
 * num1 분석 및 다음 회차 예측 (통계적 참고용)
 *
 * ⚠️ 로또는 독립 시행(완전 무작위)입니다.
 *    아래 결과는 데이터 분석 연습/참고용이며 적중을 보장하지 않습니다.
 */

const data = require("./lotto-numbers.json");

// --- 0. 기본 정보 ---
const n1 = data.map((d) => d.num1);
const N = n1.length;
const first = data[0];
const last = data[N - 1];

console.log("=".repeat(55));
console.log(" num1 분석 리포트");
console.log("=".repeat(55));
console.log(`총 회차        : ${N}회`);
console.log(`시작 회차      : ${first.lot_seq}회 (${first.lot_date})`);
console.log(`마지막 회차    : ${last.lot_seq}회 (${last.lot_date})`);
console.log(`예측 대상      : ${last.lot_seq + 1}회`);
console.log("");

// --- 1. 빈도 분석 ---
const freq = {};
n1.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
const sortedByFreq = Object.entries(freq)
  .map(([val, cnt]) => ({ val: Number(val), cnt }))
  .sort((a, b) => b.cnt - a.cnt || a.val - b.val);

console.log("-".repeat(55));
console.log(" [1] 빈도 분석 (num1 범위: " + Math.min(...n1) + " ~ " + Math.max(...n1) + ")");
console.log("-".repeat(55));
console.log(" 값  | 횟수 | 비율   | 막대");
sortedByFreq.forEach(({ val, cnt }) => {
  const pct = ((cnt / N) * 100).toFixed(1);
  const bar = "#".repeat(cnt);
  console.log(
    ` ${String(val).padStart(2)} | ${String(cnt).padStart(3)}  | ${pct.padStart(4)}% | ${bar}`
  );
});
const mode = sortedByFreq[0];
console.log(`\n 최빈값(mode): ${mode.val} (${mode.cnt}회, ${((mode.cnt / N) * 100).toFixed(1)}%)`);

// --- 2. 통계량 ---
const sum = n1.reduce((a, b) => a + b, 0);
const mean = sum / N;
const sorted = [...n1].sort((a, b) => a - b);
const median =
  N % 2 === 0 ? (sorted[N / 2 - 1] + sorted[N / 2]) / 2 : sorted[(N - 1) / 2];
const variance = n1.reduce((a, b) => a + (b - mean) ** 2, 0) / N;
const std = Math.sqrt(variance);

console.log("-".repeat(55));
console.log(" [2] 통계량");
console.log("-".repeat(55));
console.log(` 평균(mean)        : ${mean.toFixed(2)}`);
console.log(` 중앙값(median)    : ${median}`);
console.log(` 최빈값(mode)      : ${mode.val}`);
console.log(` 표준편차(std)     : ${std.toFixed(2)}`);
console.log(` 최소 / 최대       : ${Math.min(...n1)} / ${Math.max(...n1)}`);

// --- 3. 이론적 최솟값 분포 비교 ---
// 1~45에서 6개를 뽑을 때 최솟값이 k일 확률 = C(45-k, 5) / C(45, 6)
function comb(n, r) {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let num = 1,
    den = 1;
  for (let i = 0; i < r; i++) {
    num *= n - i;
    den *= i + 1;
  }
  return num / den;
}
const totalComb = comb(45, 6);
let theoMean = 0;
const theoProb = {};
for (let k = 1; k <= 40; k++) {
  const p = comb(45 - k, 5) / totalComb;
  theoProb[k] = p;
  theoMean += k * p;
}

console.log("-".repeat(55));
console.log(" [3] 이론적 최솟값 분포 vs 실제 (상위 8개)");
console.log("-".repeat(55));
console.log(" 값 | 이론확률 | 실제비율");
for (let k = 1; k <= 8; k++) {
  const theo = (theoProb[k] * 100).toFixed(1);
  const act = (((freq[k] || 0) / N) * 100).toFixed(1);
  console.log(` ${String(k).padStart(2)} |  ${theo.padStart(5)}% |  ${act.padStart(5)}%`);
}
console.log(`\n 이론적 기댓값(45개 중 6개 뽑을 때 최솟값): ${theoMean.toFixed(2)}`);
console.log(` 실제 평균                                 : ${mean.toFixed(2)}`);

// --- 4. 최근 추세 (가중 이동평균) ---
const recentWindow = 10;
const recent = n1.slice(-recentWindow);
const recentMean = recent.reduce((a, b) => a + b, 0) / recent.length;
// 최근일수록 가중치 큼 (선형 가중)
let wSum = 0,
  wTot = 0;
recent.forEach((v, i) => {
  const w = i + 1;
  wSum += v * w;
  wTot += w;
});
const weightedMean = wSum / wTot;

console.log("-".repeat(55));
console.log(" [4] 최근 추세 (최근 " + recentWindow + "회)");
console.log("-".repeat(55));
console.log(` 최근 num1 값      : ${recent.join(", ")}`);
console.log(` 최근 단순평균     : ${recentMean.toFixed(2)}`);
console.log(` 최근 가중평균     : ${weightedMean.toFixed(2)} (최근일수록 높은 가중치)`);

// --- 5. 종합 예측값 (여러 방법) ---
// 가중 랜덤 샘플링: 빈도를 확률로 사용
function weightedRandom() {
  const r = Math.random() * N;
  let acc = 0;
  for (const { val, cnt } of sortedByFreq) {
    acc += cnt;
    if (r < acc) return val;
  }
  return sortedByFreq[0].val;
}
const samples = Array.from({ length: 5 }, () => weightedRandom());

console.log("=".repeat(55));
console.log(` [5] ${last.lot_seq + 1}회 num1 예측값 (참고용)`);
console.log("=".repeat(55));
console.log(` 방법 A) 최빈값 기준          : ${mode.val}`);
console.log(` 방법 B) 평균 반올림 기준     : ${Math.round(mean)}`);
console.log(` 방법 C) 중앙값 기준          : ${median}`);
console.log(` 방법 D) 최근 가중평균 반올림 : ${Math.round(weightedMean)}`);
console.log(` 방법 E) 빈도 가중 랜덤 5개   : ${samples.join(", ")}`);
console.log("");
console.log(" ⚠️  로또는 독립 시행이므로 위 값은 통계적 참고치일 뿐");
console.log("     실제 적중을 보장하지 않습니다.");
console.log("=".repeat(55));
