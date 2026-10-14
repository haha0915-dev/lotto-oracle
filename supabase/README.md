# num1 Database Function

Run `migrations/20261014085000_create_analyze_num1.sql` in the Supabase SQL Editor
to create `public.analyze_num1()`. The source table must be
`public.lt_win_numbers`, with numeric `lot_seq` and `num1` columns and a date or
text `lot_date` column. `num1` is assumed to be the smallest of the six winning
numbers.

Call from the SQL Editor:

```sql
SELECT public.analyze_num1();
```

Call from an existing Supabase client:

```ts
const { data, error } = await supabase.rpc("analyze_num1");
if (error) throw error;
console.log(data);
```

The function returns the Edge Function's JSON structure: `summary`, `frequency`,
`statistics`, `theoreticalComparison`, `recentTrend`, `predictions`, and
`disclaimer`. Probabilities use a 0-1 scale; percentages use a 0-100 scale.
The recent window contains at most ten draws. Five frequency-weighted random
samples are drawn with replacement and may change on each call.

This is a `SECURITY INVOKER` function. It does not bypass table permissions or
row-level security. Only rows visible to the caller are analyzed. Execution is
granted to `anon`, `authenticated`, and `service_role`; table SELECT permissions
and RLS policies must be configured separately. Empty or invalid data raises a
PostgreSQL error, propagated through RPC.

No Deno server, Edge Function deployment, or Edge Function environment variables
are needed for this Database Function. The existing TypeScript Edge Function is
retained as an alternative and is not required for RPC.
