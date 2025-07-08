# Matt's Voice, Style, and Tone MCP Server

HTTP server implementing the Model Context Protocol (MCP) to serve Matt's voice, style, and tone preferences.

## Local Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## MCP Endpoints

### Capabilities
- `GET /mcp/capabilities` - Server capabilities

### Prompts
- `GET /mcp/prompts/list` - List available prompts
- `POST /mcp/prompts/get` - Get specific prompt

Available prompts:
- `voice-style-tone` - Complete voice profile
- `writing-guidelines` - Core writing rules
- `banned-phrases` - What to avoid

### Resources
- `GET /mcp/resources/list` - List available resources
- `POST /mcp/resources/read` - Get specific resource

Available resources:
- `voice://matt/full-profile` - Complete JSON profile
- `voice://matt/signature-moves` - Signature writing moves
- `voice://matt/banned-elements` - Banned phrases/patterns

## Usage Example

```bash
# Get capabilities
curl http://localhost:3000/mcp/capabilities

# List prompts
curl http://localhost:3000/mcp/prompts/list

# Get voice profile prompt
curl -X POST http://localhost:3000/mcp/prompts/get \
  -H "Content-Type: application/json" \
  -d '{"name": "voice-style-tone"}'
```

## Health Check

`GET /health` - Server health status 