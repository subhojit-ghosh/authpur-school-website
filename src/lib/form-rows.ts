/** Rebuilds an array of objects from inputs named `${name}[i][key]` (see RowsEditor). */
export function parseRows<K extends string>(
  formData: FormData,
  name: string,
  keys: readonly K[],
  maxLen = 200,
): Record<K, string>[] {
  const pattern = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\[(\\d+)\\]\\[(\\w+)\\]$`);
  const byIndex = new Map<number, Map<K, string>>();

  for (const [field, value] of formData.entries()) {
    const m = field.match(pattern);
    if (!m || typeof value !== "string") continue;
    const index = Number(m[1]);
    const key = m[2] as K;
    if (!keys.includes(key)) continue;
    const row = byIndex.get(index) ?? new Map<K, string>();
    row.set(key, value.trim().slice(0, maxLen));
    byIndex.set(index, row);
  }

  return [...byIndex.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => Object.fromEntries(keys.map((k) => [k, row.get(k) ?? ""])) as Record<K, string>)
    .filter((row) => keys.some((k) => row[k] !== ""));
}
