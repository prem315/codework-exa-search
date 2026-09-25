import { Schema } from "effect";
/** Exa's search types. `neural` and `keyword` were retired; `auto` picks for you. */
export declare const SearchType: Schema.Literals<readonly ["auto", "fast", "instant", "deep"]>;
export declare const ExaSearchParams: Schema.Struct<{
    readonly query: Schema.String;
    readonly numResults: Schema.optional<Schema.Number>;
    readonly type: Schema.optional<Schema.Literals<readonly ["auto", "fast", "instant", "deep"]>>;
    readonly includeDomains: Schema.optional<Schema.$Array<Schema.String>>;
    readonly excludeDomains: Schema.optional<Schema.$Array<Schema.String>>;
}>;
export declare const ExaSearchResult: Schema.Struct<{
    readonly title: Schema.NullOr<Schema.String>;
    readonly url: Schema.String;
    readonly publishedDate: Schema.NullOr<Schema.String>;
    readonly author: Schema.NullOr<Schema.String>;
    readonly text: Schema.optional<Schema.String>;
    readonly highlights: Schema.optional<Schema.$Array<Schema.String>>;
}>;
export declare const ExaSearchSuccess: Schema.Struct<{
    readonly query: Schema.String;
    readonly results: Schema.$Array<Schema.Struct<{
        readonly title: Schema.NullOr<Schema.String>;
        readonly url: Schema.String;
        readonly publishedDate: Schema.NullOr<Schema.String>;
        readonly author: Schema.NullOr<Schema.String>;
        readonly text: Schema.optional<Schema.String>;
        readonly highlights: Schema.optional<Schema.$Array<Schema.String>>;
    }>>;
}>;
/**
 * What the Exa API sends back, decoded rather than cast: a response missing `results`, or a result
 * without a `url`, is a failed search, not a crash inside the tool.
 */
export declare const ExaApiResult: Schema.Struct<{
    readonly title: Schema.optional<Schema.NullOr<Schema.String>>;
    readonly url: Schema.String;
    readonly publishedDate: Schema.optional<Schema.NullOr<Schema.String>>;
    readonly author: Schema.optional<Schema.NullOr<Schema.String>>;
    readonly text: Schema.optional<Schema.String>;
    readonly highlights: Schema.optional<Schema.$Array<Schema.String>>;
}>;
export declare const ExaApiResponse: Schema.Struct<{
    readonly results: Schema.$Array<Schema.Struct<{
        readonly title: Schema.optional<Schema.NullOr<Schema.String>>;
        readonly url: Schema.String;
        readonly publishedDate: Schema.optional<Schema.NullOr<Schema.String>>;
        readonly author: Schema.optional<Schema.NullOr<Schema.String>>;
        readonly text: Schema.optional<Schema.String>;
        readonly highlights: Schema.optional<Schema.$Array<Schema.String>>;
    }>>;
}>;
declare const ExaSearchFailed_base: Schema.Class<ExaSearchFailed, Schema.TaggedStruct<"ExaSearchFailed", {
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class ExaSearchFailed extends ExaSearchFailed_base {
}
export type SearchType = typeof SearchType.Type;
export type ExaSearchParams = typeof ExaSearchParams.Type;
export type ExaSearchResult = typeof ExaSearchResult.Type;
export type ExaSearchSuccess = typeof ExaSearchSuccess.Type;
export type ExaApiResult = typeof ExaApiResult.Type;
export type ExaApiResponse = typeof ExaApiResponse.Type;
export {};
//# sourceMappingURL=schemas.d.ts.map