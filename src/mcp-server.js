#!/usr/bin/env node

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

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

const mcpServer = new McpServer({
  name: 'matt-vst-lfr',
  version: '1.0.0',
});

// Register prompts
mcpServer.registerPrompt('voice-style-tone', {
  description: "Matt's complete voice, style, and tone preferences for writing",
}, async () => {
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
});

mcpServer.registerPrompt('writing-guidelines', {
  description: 'Specific writing guidelines and formatting rules',
}, async () => {
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
});

mcpServer.registerPrompt('banned-phrases', {
  description: 'List of banned phrases and patterns to avoid',
}, async () => {
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
});

// Register resources
mcpServer.registerResource('voice://matt/full-profile', {
  name: 'Full Voice Profile',
  description: 'Complete voice, style, and tone profile',
  mimeType: 'application/json',
}, async () => {
  return {
    contents: [
      {
        uri: 'voice://matt/full-profile',
        mimeType: 'application/json',
        text: JSON.stringify(voiceData, null, 2),
      },
    ],
  };
});

mcpServer.registerResource('voice://matt/signature-moves', {
  name: 'Signature Moves',
  description: 'List of signature writing moves',
  mimeType: 'text/plain',
}, async () => {
  return {
    contents: [
      {
        uri: 'voice://matt/signature-moves',
        mimeType: 'text/plain',
        text: voiceData.voice.signatureMoves.join('\n'),
      },
    ],
  };
});

mcpServer.registerResource('voice://matt/banned-elements', {
  name: 'Banned Elements',
  description: 'List of banned phrases and patterns',
  mimeType: 'text/plain',
}, async () => {
  return {
    contents: [
      {
        uri: 'voice://matt/banned-elements',
        mimeType: 'text/plain',
        text: voiceData.voice.banned.join('\n'),
      },
    ],
  };
});

// Register tools
mcpServer.registerTool('apply-voice-style', {
  description: 'Apply Matt\'s voice, style, and tone guidelines to improve text',
  inputSchema: {
    text: z.string().describe('Text to improve using Matt\'s voice and style guidelines'),
  },
}, async ({ text }) => {
  const guidelines = `
**Matt's Voice & Style Guidelines Applied:**

**Original:** ${text}

**Improved with Matt's Voice:**
- Remove any rhetorical questions (${voiceData.voice.banned.includes('Hypophora') ? '✓ Avoiding hypophora' : ''})
- Make it ${voiceData.voice.tone}
- Structure: ${voiceData.voice.style}
- Position as: ${voiceData.voice.positioning}

**Key Improvements:**
• ${voiceData.voice.signatureMoves[0]}
• ${voiceData.voice.signatureMoves[1]}
• ${voiceData.voice.signatureMoves[2]}

**Avoided:**
• ${voiceData.voice.banned.slice(0, 3).join('\n• ')}

**Suggested Revision:**
[Apply the above guidelines to create a more grounded, no-polish version that shows work rather than postures]
`;

  return {
    content: [
      {
        type: 'text',
        text: guidelines,
      },
    ],
  };
});

mcpServer.registerTool('get-voice-guidelines', {
  description: 'Get a quick reference of Matt\'s voice, style, and tone guidelines',
  inputSchema: {},
}, async () => {
  return {
    content: [
      {
        type: 'text',
        text: `**Matt's Voice Guidelines:**

**Tone:** ${voiceData.voice.tone}
**Style:** ${voiceData.voice.style}
**Positioning:** ${voiceData.voice.positioning}

**Do:**
${voiceData.voice.signatureMoves.map(move => `• ${move}`).join('\n')}

**Never:**
${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}

**Formatting:**
• Paragraphs: ${voiceData.voice.formatting.paragraphs}
• Headings: ${voiceData.voice.formatting.headings}
• Emphasis: ${voiceData.voice.formatting.emphasis}
• Spacing: ${voiceData.voice.formatting.spacing}`,
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error('Matt VST-LFR MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
}); 