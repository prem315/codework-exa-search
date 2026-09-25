import { Effect, Schema } from "effect";
import { DEFAULT_HIGHLIGHTS_MAX_CHARACTERS, DEFAULT_NUM_RESULTS, DEFAULT_SEARCH_TYPE, DEFAULT_TEXT_MAX_CHARACTERS, EXA_API_KEY_ENV, EXA_API_URL, MAX_NUM_RESULTS, MIN_NUM_RESULTS, } from "./constants.js";
import { ExaApiResponse, ExaSearchFailed, } from "./schemas.js";
export const clampNumResults = (requested, fallback = DEFAULT_NUM_RESULTS) => {
    const count = requested ?? fallback;
    return Math.min(Math.max(Math.floor(count), MIN_NUM_RESULTS), MAX_NUM_RESULTS);
};
export const buildSearchRequestBody = (params, numResults) => ({
    query: params.query,
    numResults,
    type: params.type ?? DEFAULT_SEARCH_TYPE,
    contents: {
        highlights: { maxCharacters: DEFAULT_HIGHLIGHTS_MAX_CHARACTERS },
        text: { maxCharacters: DEFAULT_TEXT_MAX_CHARACTERS },
    },
    ...(params.includeDomains && params.includeDomains.length > 0
        ? { includeDomains: params.includeDomains }
        : {}),
    ...(params.excludeDomains && params.excludeDomains.length > 0
        ? { excludeDomains: params.excludeDomains }
        : {}),
});
const decodeResponse = Schema.decodeUnknownEffect(ExaApiResponse);
export const searchExa = (options) => Effect.gen(function* () {
    const { apiKey, params, defaultNumResults, fetchFn = fetch, apiUrl = EXA_API_URL } = options;
    if (!apiKey) {
        return yield* new ExaSearchFailed({
            message: `Exa API key is not configured. Set ${EXA_API_KEY_ENV} in the environment, or \`options.apiKey\` on this plugin's entry in .codework/settings.jsonc.`,
        });
    }
    const numResults = clampNumResults(params.numResults, defaultNumResults);
    const body = buildSearchRequestBody(params, numResults);
    const json = yield* Effect.tryPromise({
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
            return (await res.json());
        },
        catch: (err) => new ExaSearchFailed({
            message: err instanceof Error ? err.message : String(err),
        }),
    });
    const response = yield* decodeResponse(json).pipe(Effect.mapError((issue) => new ExaSearchFailed({ message: `Exa API returned an unexpected response: ${issue.message}` })));
    const results = response.results.map((r) => ({
        title: r.title ?? null,
        url: r.url,
        publishedDate: r.publishedDate ?? null,
        author: r.author ?? null,
        ...(r.text === undefined ? {} : { text: r.text }),
        ...(r.highlights === undefined ? {} : { highlights: r.highlights }),
    }));
    return {
        query: params.query,
        results,
    };
});
//# sourceMappingURL=client.js.map