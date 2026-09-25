import { Plugin, Tool } from "@codeworksh/plugin";
import { resolveConfig } from "./config.js";
import { createExaSearchTool } from "./tool.js";

export * from "./constants.js";
export * from "./schemas.js";
export * from "./config.js";
export * from "./format.js";
export * from "./client.js";
export * from "./tool.js";

export default Plugin.define({
  id: "codework.tool.exa",
  kind: "tool",
  setup(ctx, options) {
    const config = resolveConfig(options);
    const tool = createExaSearchTool(config);
    ctx.plugin.tools.add(Tool.register(tool));
  },
});
