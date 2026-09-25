import { Schema } from "effect";

export const SearchType = Schema.Literals(["auto", "neural", "keyword"]);

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
      description: "Search type: 'auto', 'neural' (semantic/concept search), or 'keyword'.",
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

export class ExaSearchFailed extends Schema.TaggedError<ExaSearchFailed>()("ExaSearchFailed", {
  message: Schema.String,
}) {}

export type SearchType = typeof SearchType.Type;
export type ExaSearchParams = typeof ExaSearchParams.Type;
export type ExaSearchResult = typeof ExaSearchResult.Type;
export type ExaSearchSuccess = typeof ExaSearchSuccess.Type;
