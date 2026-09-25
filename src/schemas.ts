import { Schema } from "effect";

/** Exa's search types. `neural` and `keyword` were retired; `auto` picks for you. */
export const SearchType = Schema.Literals(["auto", "fast", "instant", "deep"]);

export const ExaSearchParams = Schema.Struct({
  query: Schema.String.annotate({
    description: "The search query to look up on the web.",
  }),
  numResults: Schema.optional(
    Schema.Number.annotate({
      description: "Number of search results to return (default: 5, max: 20).",
    }),
  ),
  type: Schema.optional(
    SearchType.annotate({
      description:
        "Search type: 'auto' (default, balanced), 'fast' or 'instant' (lower latency), or 'deep' (slower, more thorough).",
    }),
  ),
  includeDomains: Schema.optional(
    Schema.Array(Schema.String).annotate({
      description: "Only include results from these domains (e.g. ['github.com', 'docs.rs']).",
    }),
  ),
  excludeDomains: Schema.optional(
    Schema.Array(Schema.String).annotate({
      description: "Exclude results from these domains.",
    }),
  ),
});

export const ExaSearchResult = Schema.Struct({
  title: Schema.NullOr(Schema.String),
  url: Schema.String,
  publishedDate: Schema.NullOr(Schema.String),
  author: Schema.NullOr(Schema.String),
  text: Schema.optional(Schema.String),
  highlights: Schema.optional(Schema.Array(Schema.String)),
});

export const ExaSearchSuccess = Schema.Struct({
  query: Schema.String,
  results: Schema.Array(ExaSearchResult),
});

/**
 * What the Exa API sends back, decoded rather than cast: a response missing `results`, or a result
 * without a `url`, is a failed search, not a crash inside the tool.
 */
export const ExaApiResult = Schema.Struct({
  title: Schema.optional(Schema.NullOr(Schema.String)),
  url: Schema.String,
  publishedDate: Schema.optional(Schema.NullOr(Schema.String)),
  author: Schema.optional(Schema.NullOr(Schema.String)),
  text: Schema.optional(Schema.String),
  highlights: Schema.optional(Schema.Array(Schema.String)),
});

export const ExaApiResponse = Schema.Struct({
  results: Schema.Array(ExaApiResult),
});

export class ExaSearchFailed extends Schema.TaggedError<ExaSearchFailed>()("ExaSearchFailed", {
  message: Schema.String,
}) {}

export type SearchType = typeof SearchType.Type;
export type ExaSearchParams = typeof ExaSearchParams.Type;
export type ExaSearchResult = typeof ExaSearchResult.Type;
export type ExaSearchSuccess = typeof ExaSearchSuccess.Type;
export type ExaApiResult = typeof ExaApiResult.Type;
export type ExaApiResponse = typeof ExaApiResponse.Type;
