CREATE OR REPLACE FUNCTION public.analyze_num1()
RETURNS jsonb
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  report jsonb;
  draw_count bigint;
  invalid_count bigint;
BEGIN
  WITH draws AS MATERIALIZED (
    SELECT lot_seq, lot_date, num1
    FROM public.lt_win_numbers
  ),
  validation AS (
    SELECT
      count(*) AS total,
      count(*) FILTER (
        WHERE lot_seq IS NULL OR lot_seq < 1 OR lot_seq <> trunc(lot_seq)
          OR lot_date IS NULL OR lot_date::text = ''
          OR num1 IS NULL OR num1 < 1 OR num1 > 45 OR num1 <> trunc(num1)
      ) AS invalid
    FROM draws
  ),
  statistics AS (
    SELECT
      avg(num1::double precision) AS mean,
      percentile_cont(0.5) WITHIN GROUP (ORDER BY num1) AS median,
      stddev_pop(num1::double precision) AS standard_deviation,
      min(num1) AS minimum,
      max(num1) AS maximum
    FROM draws
  ),
  frequencies AS (
    SELECT num1 AS value, count(*) AS occurrences
    FROM draws
    GROUP BY num1
  ),
  ranked_frequencies AS (
    SELECT
      value,
      occurrences,
      occurrences::double precision / nullif(validation.total, 0) * 100 AS percentage,
      sum(occurrences) OVER (
        ORDER BY occurrences DESC, value ASC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS cumulative_count
    FROM frequencies
    CROSS JOIN validation
  ),
  mode AS (
    SELECT value, occurrences, percentage
    FROM ranked_frequencies
    ORDER BY occurrences DESC, value ASC
    LIMIT 1
  ),
  recent_draws AS (
    SELECT
      num1,
      lot_seq,
      row_number() OVER (ORDER BY lot_seq ASC) AS weight
    FROM (
      SELECT lot_seq, num1
      FROM draws
      ORDER BY lot_seq DESC
      LIMIT 10
    ) AS latest
  ),
  recent_statistics AS (
    SELECT
      count(*) AS window,
      jsonb_agg(num1 ORDER BY lot_seq ASC) AS values,
      avg(num1::double precision) AS mean,
      sum(num1::double precision * weight) / nullif(sum(weight), 0) AS weighted_mean
    FROM recent_draws
  ),
  theoretical_distribution AS (
    SELECT
      k AS value,
      ((45 - k)::double precision * (44 - k) * (43 - k) * (42 - k) * (41 - k))
        / (120.0 * 8145060.0) AS probability,
      coalesce(frequencies.occurrences, 0)::double precision
        / nullif(validation.total, 0) * 100 AS actual_percentage
    FROM generate_series(1, 40) AS numbers(k)
    LEFT JOIN frequencies ON frequencies.value = k
    CROSS JOIN validation
  ),
  random_draws AS MATERIALIZED (
    SELECT sample_index, random() * validation.total AS threshold
    FROM generate_series(1, 5) AS samples(sample_index)
    CROSS JOIN validation
  ),
  random_samples AS (
    SELECT jsonb_agg(
      (
        SELECT value
        FROM ranked_frequencies
        WHERE cumulative_count > random_draws.threshold
        ORDER BY occurrences DESC, value ASC
        LIMIT 1
      )
      ORDER BY sample_index
    ) AS values
    FROM random_draws
  )
  SELECT
    validation.total,
    validation.invalid,
    jsonb_build_object(
      'summary', jsonb_build_object(
        'drawCount', validation.total,
        'firstDraw', (
          SELECT jsonb_build_object('lot_seq', lot_seq, 'lot_date', lot_date, 'num1', num1)
          FROM draws ORDER BY lot_seq ASC LIMIT 1
        ),
        'lastDraw', (
          SELECT jsonb_build_object('lot_seq', lot_seq, 'lot_date', lot_date, 'num1', num1)
          FROM draws ORDER BY lot_seq DESC LIMIT 1
        ),
        'targetDraw', (SELECT max(lot_seq)::bigint + 1 FROM draws)
      ),
      'frequency', jsonb_build_object(
        'min', statistics.minimum,
        'max', statistics.maximum,
        'values', (
          SELECT jsonb_agg(
            jsonb_build_object('value', value, 'count', occurrences, 'percentage', percentage)
            ORDER BY occurrences DESC, value ASC
          )
          FROM ranked_frequencies
        ),
        'mode', (
          SELECT jsonb_build_object('value', value, 'count', occurrences, 'percentage', percentage)
          FROM mode
        )
      ),
      'statistics', jsonb_build_object(
        'mean', statistics.mean,
        'median', statistics.median,
        'mode', (SELECT value FROM mode),
        'standardDeviation', statistics.standard_deviation,
        'min', statistics.minimum,
        'max', statistics.maximum
      ),
      'theoreticalComparison', jsonb_build_object(
        'distribution', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'value', value, 'probability', probability, 'actualPercentage', actual_percentage
            ) ORDER BY value
          )
          FROM theoretical_distribution
        ),
        'topEight', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'value', value, 'probability', probability, 'actualPercentage', actual_percentage
            ) ORDER BY value
          )
          FROM theoretical_distribution WHERE value <= 8
        ),
        'theoreticalMean', (SELECT sum(value * probability) FROM theoretical_distribution),
        'actualMean', statistics.mean
      ),
      'recentTrend', jsonb_build_object(
        'window', recent_statistics.window,
        'values', recent_statistics.values,
        'mean', recent_statistics.mean,
        'weightedMean', recent_statistics.weighted_mean
      ),
      'predictions', jsonb_build_object(
        'mode', (SELECT value FROM mode),
        'roundedMean', floor(statistics.mean + 0.5),
        'median', statistics.median,
        'roundedRecentWeightedMean', floor(recent_statistics.weighted_mean + 0.5),
        'frequencyWeightedRandomSamples', random_samples.values
      ),
      'disclaimer', 'Lottery draws are independent and random. These statistics are for reference only and do not guarantee a winning result.'
    )
  INTO draw_count, invalid_count, report
  FROM validation
  CROSS JOIN statistics
  CROSS JOIN recent_statistics
  CROSS JOIN random_samples;

  IF draw_count = 0 THEN
    RAISE EXCEPTION 'No lotto draw data found' USING ERRCODE = 'P0002';
  END IF;

  IF invalid_count > 0 THEN
    RAISE EXCEPTION 'Lotto draw data contains an invalid row' USING ERRCODE = '22000';
  END IF;

  RETURN report;
END;
$function$;

COMMENT ON FUNCTION public.analyze_num1() IS
  'Analyzes visible lt_win_numbers rows and returns num1 statistics and reference predictions.';

REVOKE ALL ON FUNCTION public.analyze_num1() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analyze_num1() TO anon, authenticated, service_role;
