import { Effect } from "effect";
import { ExaSearchFailed, type ExaSearchParams, type ExaSearchSuccess } from "./schemas.js";
export interface SearchExaOptions {
    readonly apiKey?: string;
    readonly params: ExaSearchParams;
    readonly defaultNumResults?: number;
    readonly fetchFn?: typeof fetch;
    readonly apiUrl?: string;
}
export declare const clampNumResults: (requested?: number, fallback?: number) => number;
export declare const buildSearchRequestBody: (params: ExaSearchParams, numResults: number) => {
    excludeDomains?: readonly string[] | undefined;
    includeDomains?: readonly string[] | undefined;
    query: string;
    numResults: number;
    type: "auto" | "fast" | "instant" | "deep";
    contents: {
        highlights: {
            maxCharacters: number;
        };
        text: {
            maxCharacters: number;
        };
    };
};
export declare const searchExa: (options: SearchExaOptions) => Effect.Effect<ExaSearchSuccess, ExaSearchFailed>;
//# sourceMappingURL=client.d.ts.map