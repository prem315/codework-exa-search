import test from "node:test";
import assert from "node:assert/strict";
import plugin, {
  resolveConfig,
  formatResults,
  formatError,
  clampNumResults,
  buildSearchRequestBody,
  createExaSearchTool,
  searchExa,
  ExaSearchFailed,
  DEFAULT_NUM_RESULTS,
  MIN_NUM_RESULTS,
  MAX_NUM_RESULTS,
} from "../dist/index.js";
import { Effect } from "effect";

test("plugin has correct id and kind", () => {
  assert.equal(plugin.id, "exa.tool.search");
  // The harness refuses the reserved `codework.` namespace and anything but `vendor.domain.context`.
  assert.match(plugin.id, /^(?!codework\.)[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*){2}$/);
  assert.equal(plugin.kind, "tool");
});

test("plugin registers tool on setup", () => {
  const tools = [];
  const mockCtx = {
    plugin: {
      tools: {
        add: (registeredTool) => tools.push(registeredTool),
      },
    },
  };

  plugin.setup(mockCtx, { apiKey: "test-key", defaultNumResults: 10 });
  assert.equal(tools.length, 1);
  assert.equal(tools[0].definition.name, "exa_search");
  assert.equal(tools[0].definition.label, "web search");
});

test("resolveConfig correctly handles options and environment variables", () => {
  const origEnv = process.env.EXA_API_KEY;
  try {
    delete process.env.EXA_API_KEY;

    // Default with no env
    const emptyConfig = resolveConfig({});
    assert.equal(emptyConfig.apiKey, undefined);
    assert.equal(emptyConfig.defaultNumResults, DEFAULT_NUM_RESULTS);

    // With env var
    process.env.EXA_API_KEY = "env-secret-key";
    const envConfig = resolveConfig({});
    assert.equal(envConfig.apiKey, "env-secret-key");

    // Option overrides env var
    const explicitConfig = resolveConfig({ apiKey: "explicit-key", defaultNumResults: 15 });
    assert.equal(explicitConfig.apiKey, "explicit-key");
    assert.equal(explicitConfig.defaultNumResults, 15);

    // Clamps below min and above max
    const lowConfig = resolveConfig({ defaultNumResults: -5 });
    assert.equal(lowConfig.defaultNumResults, MIN_NUM_RESULTS);

    const highConfig = resolveConfig({ defaultNumResults: 50 });
    assert.equal(highConfig.defaultNumResults, MAX_NUM_RESULTS);
  } finally {
    if (origEnv !== undefined) {
      process.env.EXA_API_KEY = origEnv;
    } else {
      delete process.env.EXA_API_KEY;
    }
  }
});

test("formatResults produces readable markdown", () => {
  const emptyOutput = formatResults({ query: "typescript effect", results: [] });
  assert.equal(emptyOutput, 'No results found for query: "typescript effect"');

  const formatted = formatResults({
    query: "test query",
    results: [
      {
        title: "Example Title",
        url: "https://example.com",
        publishedDate: "2024-01-01",
        author: "Alice",
        highlights: ["First highlight", "Second highlight"],
      },
      {
        title: null,
        url: "https://example.org/doc",
        publishedDate: null,
        author: null,
        text: "Some fallback text content that is longer",
      },
    ],
  });

  assert.ok(formatted.includes("1. [Example Title](https://example.com)"));
  assert.ok(formatted.includes("Published: 2024-01-01"));
  assert.ok(formatted.includes("Author: Alice"));
  assert.ok(formatted.includes("> First highlight"));
  assert.ok(formatted.includes("> Second highlight"));
  assert.ok(formatted.includes("2. [Untitled](https://example.org/doc)"));
  assert.ok(formatted.includes("Content: Some fallback text content that is longer"));
  // Short text is shown whole, with no ellipsis pretending it was cut.
  assert.ok(!formatted.includes("longer..."));

  const long = formatResults({
    query: "q",
    results: [{ title: "t", url: "https://e.com", publishedDate: null, author: null, text: "x".repeat(600) }],
  });
  assert.ok(long.includes(`Content: ${"x".repeat(500)}...`));
});

test("formatError produces readable error string", () => {
  const err = new ExaSearchFailed({ message: "Network connection lost" });
  assert.equal(formatError(err), "Search failed: Network connection lost");
});

test("clampNumResults clamps bounds", () => {
  assert.equal(clampNumResults(undefined, 5), 5);
  assert.equal(clampNumResults(-1), MIN_NUM_RESULTS);
  assert.equal(clampNumResults(0), MIN_NUM_RESULTS);
  assert.equal(clampNumResults(100), MAX_NUM_RESULTS);
  assert.equal(clampNumResults(8), 8);
});

test("buildSearchRequestBody formats payload correctly", () => {
  const body = buildSearchRequestBody(
    {
      query: "codework agents",
      includeDomains: ["github.com"],
      excludeDomains: ["badsite.com"],
      type: "deep",
    },
    8,
  );

  assert.equal(body.query, "codework agents");
  assert.equal(body.numResults, 8);
  assert.equal(body.type, "deep");
  // Retired by Exa: autoprompting is gone, and highlights are sized in characters.
  assert.equal("useAutoprompt" in body, false);
  assert.deepEqual(body.contents.highlights, { maxCharacters: 600 });
  assert.equal(buildSearchRequestBody({ query: "q" }, 5).type, "auto");
  assert.deepEqual(body.includeDomains, ["github.com"]);
  assert.deepEqual(body.excludeDomains, ["badsite.com"]);
});

test("searchExa fails if apiKey is missing", async () => {
  const effect = searchExa({
    params: { query: "test" },
  });

  const failure = await Effect.runPromise(Effect.flip(effect));
  assert.ok(failure instanceof ExaSearchFailed);
  assert.ok(failure.message.includes("Exa API key is not configured"));
  assert.ok(failure.message.includes("EXA_API_KEY"));
});

test("searchExa handles successful API response", async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => ({
      results: [
        {
          title: "Result 1",
          url: "https://example.com/1",
          publishedDate: "2024-01-01",
          author: "Jane Doe",
          highlights: ["highlight 1"],
          text: "sample text",
        },
      ],
    }),
  });

  const effect = searchExa({
    apiKey: "dummy-key",
    params: { query: "test query" },
    fetchFn: mockFetch,
  });

  const result = await Effect.runPromise(effect);
  assert.equal(result.query, "test query");
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].title, "Result 1");
  assert.equal(result.results[0].url, "https://example.com/1");
});

test("searchExa handles API errors gracefully", async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 401,
    statusText: "Unauthorized",
    text: async () => "Invalid API key",
  });

  const effect = searchExa({
    apiKey: "invalid-key",
    params: { query: "test query" },
    fetchFn: mockFetch,
  });

  const failure = await Effect.runPromise(Effect.flip(effect));
  assert.ok(failure instanceof ExaSearchFailed);
  assert.ok(failure.message.includes("Exa API returned 401: Invalid API key"));
});

test("searchExa fails cleanly on a response it does not recognise", async () => {
  const mockFetch = async () => ({ ok: true, json: async () => ({ error: "nope" }) });
  const failure = await Effect.runPromise(
    Effect.flip(searchExa({ apiKey: "k", params: { query: "q" }, fetchFn: mockFetch })),
  );
  assert.ok(failure instanceof ExaSearchFailed);
  assert.ok(failure.message.startsWith("Exa API returned an unexpected response"));
});

test("createExaSearchTool definition has correct metadata and encoders", () => {
  const tool = createExaSearchTool({ apiKey: "test-key", defaultNumResults: 5 });
  assert.equal(tool.definition.name, "exa_search");
  assert.equal(tool.definition.label, "web search");

  const content = tool.definition.encodeContent({ query: "hi", results: [] });
  assert.deepEqual(content, [{ type: "text", text: 'No results found for query: "hi"' }]);

  const failContent = tool.definition.encodeFailureContent(
    new ExaSearchFailed({ message: "boom" }),
  );
  assert.deepEqual(failContent, [{ type: "text", text: "Search failed: boom" }]);
});
