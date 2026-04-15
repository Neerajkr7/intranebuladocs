# MCP Crash Course — Build an MCP Server and Client (Model Context Protocol)

## Key Points
- MCP = Model Context Protocol: a protocol (like REST/GraphQL) that standardizes communication between MCP servers and clients.
- An MCP server is built from four main pieces: tools, resources, prompts, and samplings. Tools and resources are the most used.
- Tools: server-side callable functions (e.g., create user) with typed inputs, descriptions and annotations to help AI decide when/how to call them.
- Resources: data endpoints (files, DB rows, files, etc.) exposed with URIs and optionally URI templates for dynamic params.
- Prompts: pre-built prompt templates the server can supply to clients for consistent prompting.
- Samplings: when the server asks the client to run a model call (client executes the LLM prompt and returns results to the server).
- Two main transports: standard IO (stdin/stdout for local integrations) and HTTP streaming (for remote/web).
- The MCP project provides SDKs (TypeScript used in the video) and an inspector tool (like Postman for MCP) for testing.
- VS Code & GitHub Copilot integration demonstrated (add server via MCP config, use hashtags or slash commands to trigger tools/prompts).
- Example end-to-end: implement a TypeScript MCP server with a create-user tool, users resource (including a users/{id} template), a generate-fake-user prompt, and a create-random-user tool that uses sampling to ask the client to generate fake user data via an LLM.
- Client side: MCP client that lists tools/resources/prompts and can (via a CLI) call tools, resources, prompts, or query an LLM with tool access. Gemini (Google) used as example LLM with a free tier.
- Practical tips: use Zod or JSON Schema for parameter validation, annotate tools (read-only, idempotent, destructive, open-world), restart clients/VS Code when server capability list changes, and validate/clean LLM output before saving to DB.

## Summary
The video is a practical, end-to-end crash course on MCP (Model Context Protocol). It starts by explaining what MCP is: a standardized protocol for communication between AI clients and servers, composed primarily of tools, resources, prompts, and samplings.

The presenter builds a TypeScript MCP server using the official SDK and demonstrates:
- Setting up a server and choosing a transport (standard IO for local use).
- Installing and using the inspector to inspect and test server capabilities.
- Creating a tool (create user) with typed inputs (using Zod), annotations (title, readOnly, destructive, idempotent, openWorld), and an implementation that writes to a JSON file as a demo database.
- Creating resources: a users collection endpoint and a users/{id} resource template, returning JSON content with MIME types.
- Creating a prompt (generate fake user) that returns a formatted prompt message that clients can run.
- Implementing sampling: building a server-side tool (create random user) that sends a sampling request to the client asking it to run a model prompt; the client runs the LLM prompt and returns JSON; the server parses that JSON and creates a user.

The video then builds a client:
- A TypeScript CLI client using the MCP SDK and inquirer (for interactive prompts).
- The client connects to the server (standard IO), lists tools/resources/prompts, and implements handlers to call tools, read resources (including handling URI templates and dynamic parameters), run prompts, and query an LLM while exposing tools for the model to call (providing an execute hook so the LLM agent can invoke server tools).
- For LLM calls, the presenter uses Google Gemini via an AI SDK, demonstrating text generation, and showing how sampling requests from the server are handled by the client and forwarded to the LLM.

Throughout the build the presenter demonstrates testing with the inspector and VS Code Copilot integration, debugging tips (watch rebuilding, using node debug mode), and fixes for common issues (e.g., trimming/parsing LLM output, environment variables, experimental Node JSON import warnings).

## Takeaways
- MCP standardizes AI client↔server interactions; you can expose programmatic capabilities (tools), data (resources), canned prompts, and request client-run LLM samples (samplings).
- Start with the official SDK for your language (TypeScript in this example) and use the inspector to iterate quickly.
- Design tools with clear schemas and annotations so the AI knows what each tool does and when to use it (Zod or JSON Schema works well).
- Resources should include URIs (and templates) plus MIME types so clients can fetch and parse content.
- Samplings let the server solicit model outputs from the client: server asks → client runs model → client returns results back to server. Validate and clean LLM outputs before saving to persistent storage.
- Choose transport depending on deployment: use standard IO for local/IDE integrations and HTTP streaming for web/remote clients.
- Integrate with editor AI tooling (e.g., Copilot) for a seamless developer experience, but remember to restart or re-register servers when capabilities change.
- Always validate/sanitize LLM responses before acting on them; use schema validation and error handling.
- Use environment variables (and .env) for LLM API keys and be mindful of developer conveniences (like omitting tokens for easier local testing) vs. security.
- The MCP stack enables powerful workflows: letting AIs call application functions, fetch structured data, receive templated prompts, and even request the client to execute model prompts — useful building blocks for advanced AI-enabled apps.