import { Effect } from "effect";
import {
  DEFAULT_HIGHLIGHTS_NUM_SENTENCES,
  DEFAULT_HIGHLIGHTS_PER_URL,
  DEFAULT_NUM_RESULTS,
  DEFAULT_SEARCH_TYPE,
  DEFAULT_TEXT_MAX_CHARACTERS,
  EXA_API_URL,
  MAX_NUM_RESULTS,
  MIN_NUM_RESULTS,
} from "./constants.js";
import {
  ExaSearchFailed,
  type ExaSearchParams,
  type ExaSearchResult,
  type ExaSearchSuccess,
} from "./schemas.js";

export interface ExaApiRawResult {
  readonly title?: string | null;
  readonly url: string;
  readonly publishedDate?: string | null;
  readonly author?: string | null;
  readonly text?: string;
  readonly highlights?: string[];
}

export interface ExaApiResponse {
  readonly results: readonly ExaApiRawResult[];
}

export interface SearchExaOptions {
  readonly apiKey?: string;
  readonly params: ExaSearchParams;
  readonly defaultNumResults?: number;
  readonly fetchFn?: typeof fetch;
  readonly apiUrl?: string;
}

export const clampNumResults = (requested?: number, fallback = DEFAULT_NUM_RESULTS): number => {
  const count = requested ?? fallback;
  return Math.min(Math.max(Math.floor(count), MIN_NUM_RESULTS), MAX_NUM_RESULTS);
};

export const buildSearchRequestBody = (params: ExaSearchParams, numResults: number) => ({
  query: params.query,
  numResults,
  type: params.type ?? DEFAULT_SEARCH_TYPE,
  useAutoprompt: true,
  contents: {
    highlights: {
      numSentences: DEFAULT_HIGHLIGHTS_NUM_SENTENCES,
      highlightsPerUrl: DEFAULT_HIGHLIGHTS_PER_URL,
    },
    text: {
      maxCharacters: DEFAULT_TEXT_MAX_CHARACTERS,
    },
  },
  ...(params.includeDomains && params.includeDomains.length > 0
    ? { includeDomains: params.includeDomains }
    : {}),
  ...(params.excludeDomains && params.excludeDomains.length > 0
    ? { excludeDomains: params.excludeDomains }
    : {}),
});

export const searchExa = (
  options: SearchExaOptions,
): Effect.Effect<ExaSearchSuccess, ExaSearchFailed> =>
  Effect.gen(function* () {
    const { apiKey, params, defaultNumResults, fetchFn = fetch, apiUrl = EXA_API_URL } = options;

    if (!apiKey) {
      return yield* new ExaSearchFailed({
        message:
          "EXA_API_KEY is not configured. Please set EXA_API_KEY in your environment or in .codework/settings.jsonc.",
      });
    }

    const numResults = clampNumResults(params.numResults, defaultNumResults);
    const body = buildSearchRequestBody(params, numResults);

    const response = yield* Effect.tryPromise({
      try: async (signal) => {
        const res = await fetchFn(apiUrl, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
          signal,
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(`Exa API returned ${res.status}: ${errorText || res.statusText}`);
        }

        return (await res.json()) as ExaApiResponse;
      },
      catch: (err) =>
        new ExaSearchFailed({
          message: err instanceof Error ? err.message : String(err),
        }),
    });

    const results: ExaSearchResult[] = response.results.map((r) => ({
      title: r.title ?? null,
      url: r.url,
      publishedDate: r.publishedDate ?? null,
      author: r.author ?? null,
      text: r.text,
      highlights: r.highlights,
    }));

    return {
      query: params.query,
      results,
    };
  });
