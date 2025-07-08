# Matt's Voice, Style, and Tone MCP Server

HTTP server implementing the Model Context Protocol (MCP) to serve Matt's voice, style, and tone preferences.

## Installation (Private Package)

### Prerequisites
You need access to this private repository and GitHub authentication configured:
```bash
# Authenticate with GitHub (if not already done)
gh auth login

# Add GitHub Package Registry configuration
echo "@mattdowney:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

### Global Installation (Recommended)
```bash
npm install -g @mattdowney/matt-vst-lfr-mcp
```

### Use in Cursor IDE
Add to your `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "Voice and Tone": {
      "type": "stdio",
      "command": "matt-vst-lfr-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

### Setup on New Machines/Projects

1. **Install GitHub CLI and authenticate:**
   ```bash
   gh auth login
   ```

2. **Configure npm for GitHub Package Registry:**
   ```bash
   echo "@mattdowney:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
   ```

3. **Install globally:**
   ```bash
   npm install -g @mattdowney/matt-vst-lfr-mcp@latest
   ```

4. **Add to your project's `mcp.json`** and restart Cursor

### Local Development
```bash
git clone https://github.com/mattdowney/matt-vst-lfr.git
cd matt-vst-lfr
npm install
npm run mcp
```

HTTP server (optional) runs on `http://localhost:3000`

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

### Tools
- `GET /mcp/tools/list` - List available tools
- `POST /mcp/tools/call` - Call specific tool

Available tools:
- `apply-voice-style` - Apply Matt's voice guidelines to improve text
- `get-voice-guidelines` - Get quick reference of voice guidelines

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

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. **Disable Protection**: Go to your Vercel dashboard → Project Settings → Security → Disable "Vercel Authentication"
5. Your MCP server will be available at: `https://your-project.vercel.app`

**Note**: By default, Vercel Pro accounts enable authentication protection. You must disable this in the dashboard for public API access.

## GitHub Setup

```bash
# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/matt-vst-lfr.git
git push -u origin master
``` 