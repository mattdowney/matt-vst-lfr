#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { 
  CallToolRequestSchema,
  ErrorCode,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  GetPromptRequestSchema,
  ReadResourceRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Voice/Style/Tone data
const voiceData = {
  "name": "Matt's Voice, Style, and Tone",
  "version": "1.0",
  "voice": {
    "tone": "Dry, grounded, no-polish. Strategic but conversational.",
    "style": "Punchy line + reflection. Mixed structure. No rhetorical filler.",
    "positioning": "Builder in the arena. Shows work, doesn't posture.",
    "signatureMoves": [
      "One strong line per section",
      "Real examples > metaphors",
      "Dry wit when earned",
      "No emotion theater"
    ],
    "banned": [
      "Hypophora",
      "Poetic fadeouts",
      "Contrast clichés",
      "Punchline stacking",
      "'The result?' fake-smart lines"
    ],
    "formatting": {
      "paragraphs": "1–3 lines",
      "headings": "Clear, semantic",
      "emphasis": "Bold for clarity, no italics",
      "quotes": "No blockquotes ever",
      "spacing": "Generous whitespace"
    }
  }
};

class MattVSTLFRServer {
  constructor() {
    this.server = new Server(
      {
        name: 'matt-vst-lfr',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'voice-style-tone',
            description: "Matt's complete voice, style, and tone preferences for writing",
            arguments: [],
          },
          {
            name: 'writing-guidelines',
            description: 'Specific writing guidelines and formatting rules',
            arguments: [],
          },
          {
            name: 'banned-phrases',
            description: 'List of banned phrases and patterns to avoid',
            arguments: [],
          },
        ],
      };
    });

    // Get specific prompt
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name } = request.params;

      switch (name) {
        case 'voice-style-tone':
          return {
            description: "Matt's complete voice, style, and tone preferences",
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Use this voice, style, and tone profile:

**Tone:** ${voiceData.voice.tone}

**Style:** ${voiceData.voice.style}

**Positioning:** ${voiceData.voice.positioning}

**Signature Moves:**
${voiceData.voice.signatureMoves.map(move => `• ${move}`).join('\n')}

**Banned Elements:**
${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}

**Formatting Rules:**
• Paragraphs: ${voiceData.voice.formatting.paragraphs}
• Headings: ${voiceData.voice.formatting.headings}
• Emphasis: ${voiceData.voice.formatting.emphasis}
• Quotes: ${voiceData.voice.formatting.quotes}
• Spacing: ${voiceData.voice.formatting.spacing}`,
                },
              },
            ],
          };

        case 'writing-guidelines':
          return {
            description: 'Specific writing guidelines and formatting rules',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Follow these writing guidelines:

**Core Principles:**
• ${voiceData.voice.tone}
• ${voiceData.voice.style}
• ${voiceData.voice.positioning}

**Do This:**
${voiceData.voice.signatureMoves.map(move => `• ${move}`).join('\n')}

**Never Do This:**
${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}`,
                },
              },
            ],
          };

        case 'banned-phrases':
          return {
            description: 'List of banned phrases and patterns to avoid',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Avoid these banned elements in all writing:

${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}

These create fake-smart, overly theatrical, or clichéd writing that goes against the grounded, no-polish voice.`,
                },
              },
            ],
          };

        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'voice://matt/full-profile',
            name: 'Full Voice Profile',
            description: 'Complete voice, style, and tone profile',
            mimeType: 'application/json',
          },
          {
            uri: 'voice://matt/signature-moves',
            name: 'Signature Moves',
            description: 'List of signature writing moves',
            mimeType: 'text/plain',
          },
          {
            uri: 'voice://matt/banned-elements',
            name: 'Banned Elements',
            description: 'List of banned phrases and patterns',
            mimeType: 'text/plain',
          },
        ],
      };
    });

    // Read specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'voice://matt/full-profile':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'application/json',
                text: JSON.stringify(voiceData, null, 2),
              },
            ],
          };

        case 'voice://matt/signature-moves':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: voiceData.voice.signatureMoves.join('\n'),
              },
            ],
          };

        case 'voice://matt/banned-elements':
          return {
            contents: [
              {
                uri: uri,
                mimeType: 'text/plain',
                text: voiceData.voice.banned.join('\n'),
              },
            ],
          };

        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
      }
    });

    // List tools (empty for now)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Matt VST-LFR MCP server running on stdio');
  }
}

const server = new MattVSTLFRServer();
server.run().catch(console.error); 