/**
 * Low-Power Hardware & Network Gating Check.
 * 
 * Strict condition:
 * Gate ONLY on (pointer: coarse) AND (deviceMemory <= 2 OR hardwareConcurrency <= 2 OR navigator.connection?.saveData).
 * Any undefined value is treated as NOT gated.
 * Desktop/laptop users (pointer: fine) are NEVER gated.
 * Server-rendering / initial HTML returns false (not gated, no gate button in initial HTML).
 */
export function isLowPowerGated(): boolean {
  if (typeof window === "undefined") return false;

  const isCoarse = Boolean(
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches
  );

  const lowMemory =
    typeof (navigator as any).deviceMemory === "number" &&
    (navigator as any).deviceMemory <= 2;

  const lowConcurrency =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 2;

  const saveData = Boolean((navigator as any).connection?.saveData);

  return Boolean(isCoarse && (lowMemory || lowConcurrency || saveData));
}
