import { DEFAULT_NUM_RESULTS, EXA_API_KEY_ENV, MAX_NUM_RESULTS, MIN_NUM_RESULTS } from "./constants.js";

export interface ExaPluginOptions {
  readonly apiKey?: string;
  readonly defaultNumResults?: number;
}

export interface ResolvedExaConfig {
  readonly apiKey: string | undefined;
  readonly defaultNumResults: number;
}

/**
 * Safely parse and normalize options provided to the Exa plugin.
 * Falls back to process.env.EXA_API_KEY if apiKey is not explicitly passed.
 */
export const resolveConfig = (options: Record<string, unknown> = {}): ResolvedExaConfig => {
  const apiKey =
    typeof options["apiKey"] === "string" && options["apiKey"].trim().length > 0
      ? options["apiKey"].trim()
      : process.env[EXA_API_KEY_ENV];

  const rawNumResults = options["defaultNumResults"];
  const defaultNumResults =
    typeof rawNumResults === "number" && Number.isFinite(rawNumResults)
      ? Math.min(Math.max(Math.floor(rawNumResults), MIN_NUM_RESULTS), MAX_NUM_RESULTS)
      : DEFAULT_NUM_RESULTS;

  return {
    apiKey,
    defaultNumResults,
  };
};
