import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const PAGE_SIZE = 1000;
const RECENT_WINDOW = 10;

type DrawRow = {
  lot_seq: number;
  lot_date: string;
  num1: number;
};

type Frequency = {
  value: number;
  count: number;
  percentage: number;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function combination(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  const terms = Math.min(r, n - r);
  let numerator = 1;
  let denominator = 1;

  for (let i = 0; i < terms; i++) {
    numerator *= n - i;
    denominator *= i + 1;
  }

  return numerator / denominator;
}

function weightedRandom(frequencies: Frequency[], totalDraws: number): number {
  const randomValue = Math.random() * totalDraws;
  let accumulated = 0;

  for (const frequency of frequencies) {
    accumulated += frequency.count;
    if (randomValue < accumulated) return frequency.value;
  }

  return frequencies[0].value;
}

function analyzeDraws(draws: DrawRow[]) {
  const values = draws.map(({ num1 }) => num1);
  const count = values.length;
  const min = values.reduce((current, value) => Math.min(current, value), values[0]);
  const max = values.reduce((current, value) => Math.max(current, value), values[0]);
  const frequenciesByValue = new Map<number, number>();

  for (const value of values) {
    frequenciesByValue.set(value, (frequenciesByValue.get(value) ?? 0) + 1);
  }

  const frequencies = [...frequenciesByValue.entries()]
    .map(([value, occurrences]) => ({
      value,
      count: occurrences,
      percentage: (occurrences / count) * 100,
    }))
    .sort((a, b) => b.count - a.count || a.value - b.value);
  const mode = frequencies[0];
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = count % 2 === 0
    ? (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2
    : sortedValues[(count - 1) / 2];
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count;
  const standardDeviation = Math.sqrt(variance);
  const recentDraws = draws.slice(-RECENT_WINDOW);
  const recentValues = recentDraws.map(({ num1 }) => num1);
  const recentMean = recentValues.reduce((sum, value) => sum + value, 0) / recentValues.length;
  const weightedTotal = (recentValues.length * (recentValues.length + 1)) / 2;
  const weightedMean = recentValues.reduce(
    (sum, value, index) => sum + value * (index + 1),
    0,
  ) / weightedTotal;
  const totalCombinations = combination(45, 6);
  const theoreticalMinimumDistribution = Array.from({ length: 40 }, (_, index) => {
    const value = index + 1;
    return {
      value,
      probability: combination(45 - value, 5) / totalCombinations,
      actualPercentage: ((frequenciesByValue.get(value) ?? 0) / count) * 100,
    };
  });
  const theoreticalMean = theoreticalMinimumDistribution.reduce(
    (sum, { value, probability }) => sum + value * probability,
    0,
  );
  const firstDraw = draws[0];
  const lastDraw = draws[count - 1];

  return {
    summary: {
      drawCount: count,
      firstDraw,
      lastDraw,
      targetDraw: lastDraw.lot_seq + 1,
    },
    frequency: {
      min,
      max,
      values: frequencies,
      mode: {
        value: mode.value,
        count: mode.count,
        percentage: mode.percentage,
      },
    },
    statistics: {
      mean,
      median,
      mode: mode.value,
      standardDeviation,
      min,
      max,
    },
    theoreticalComparison: {
      distribution: theoreticalMinimumDistribution,
      topEight: theoreticalMinimumDistribution.slice(0, 8),
      theoreticalMean,
      actualMean: mean,
    },
    recentTrend: {
      window: recentValues.length,
      values: recentValues,
      mean: recentMean,
      weightedMean,
    },
    predictions: {
      mode: mode.value,
      roundedMean: Math.round(mean),
      median,
      roundedRecentWeightedMean: Math.round(weightedMean),
      frequencyWeightedRandomSamples: Array.from(
        { length: 5 },
        () => weightedRandom(frequencies, count),
      ),
    },
    disclaimer: "Lottery draws are independent and random. These statistics are for reference only and do not guarantee a winning result.",
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable");
    return jsonResponse({ error: "Function is not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: request.headers.get("Authorization") ?? `Bearer ${supabaseAnonKey}`,
      },
    },
  });

  const draws: DrawRow[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("lt_win_numbers")
      .select("lot_seq, lot_date, num1")
      .order("lot_seq", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Failed to load lotto draw data:", error.message);
      return jsonResponse({ error: "Failed to load lotto draw data" }, 500);
    }

    if (!data) {
      console.error("Supabase returned no data for lotto draw query");
      return jsonResponse({ error: "Failed to load lotto draw data" }, 500);
    }

    for (const row of data) {
      if (
        !Number.isInteger(row.lot_seq) ||
        row.lot_seq < 1 ||
        typeof row.lot_date !== "string" ||
        row.lot_date.length === 0 ||
        !Number.isInteger(row.num1) ||
        row.num1 < 1 ||
        row.num1 > 45
      ) {
        console.error("Invalid row found in lt_win_numbers");
        return jsonResponse({ error: "Lotto draw data contains an invalid row" }, 500);
      }

      draws.push(row as DrawRow);
    }

    if (data.length < PAGE_SIZE) break;
  }

  if (draws.length === 0) {
    return jsonResponse({ error: "No lotto draw data found" }, 404);
  }

  return jsonResponse(analyzeDraws(draws));
});
