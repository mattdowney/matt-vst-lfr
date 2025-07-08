const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

// MCP-style endpoints
app.get('/mcp/capabilities', (req, res) => {
  res.json({
    capabilities: {
      prompts: {
        listChanged: true
      },
      resources: {
        listChanged: true
      },
      tools: {
        listChanged: true
      }
    },
    protocolVersion: "0.1.0",
    serverInfo: {
      name: "matt-vst-lfr-mcp",
      version: "1.0.0"
    }
  });
});

// List available prompts
app.get('/mcp/prompts/list', (req, res) => {
  res.json({
    prompts: [
      {
        name: "voice-style-tone",
        description: "Get Matt's voice, style, and tone preferences for writing",
        arguments: []
      },
      {
        name: "writing-guidelines",
        description: "Get specific writing guidelines and formatting rules",
        arguments: []
      },
      {
        name: "banned-phrases",
        description: "Get list of banned phrases and patterns to avoid",
        arguments: []
      }
    ]
  });
});

// Get specific prompt
app.post('/mcp/prompts/get', (req, res) => {
  const { name } = req.body;
  
  let prompt = {
    description: "",
    messages: []
  };
  
  switch (name) {
    case 'voice-style-tone':
      prompt = {
        description: "Matt's complete voice, style, and tone preferences",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
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
• Spacing: ${voiceData.voice.formatting.spacing}`
            }
          }
        ]
      };
      break;
      
    case 'writing-guidelines':
      prompt = {
        description: "Specific writing guidelines and formatting rules",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Follow these writing guidelines:

**Core Principles:**
• ${voiceData.voice.tone}
• ${voiceData.voice.style}
• ${voiceData.voice.positioning}

**Do This:**
${voiceData.voice.signatureMoves.map(move => `• ${move}`).join('\n')}

**Never Do This:**
${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}`
            }
          }
        ]
      };
      break;
      
    case 'banned-phrases':
      prompt = {
        description: "List of banned phrases and patterns to avoid",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Avoid these banned elements in all writing:

${voiceData.voice.banned.map(item => `• ${item}`).join('\n')}

These create fake-smart, overly theatrical, or clichéd writing that goes against the grounded, no-polish voice.`
            }
          }
        ]
      };
      break;
      
    default:
      return res.status(404).json({ error: 'Prompt not found' });
  }
  
  res.json(prompt);
});

// List available resources
app.get('/mcp/resources/list', (req, res) => {
  res.json({
    resources: [
      {
        uri: "voice://matt/full-profile",
        name: "Full Voice Profile",
        description: "Complete voice, style, and tone profile",
        mimeType: "application/json"
      },
      {
        uri: "voice://matt/signature-moves",
        name: "Signature Moves",
        description: "List of signature writing moves",
        mimeType: "text/plain"
      },
      {
        uri: "voice://matt/banned-elements",
        name: "Banned Elements",
        description: "List of banned phrases and patterns",
        mimeType: "text/plain"
      }
    ]
  });
});

// Get specific resource
app.post('/mcp/resources/read', (req, res) => {
  const { uri } = req.body;
  
  switch (uri) {
    case 'voice://matt/full-profile':
      res.json({
        contents: [
          {
            uri: uri,
            mimeType: "application/json",
            text: JSON.stringify(voiceData, null, 2)
          }
        ]
      });
      break;
      
    case 'voice://matt/signature-moves':
      res.json({
        contents: [
          {
            uri: uri,
            mimeType: "text/plain",
            text: voiceData.voice.signatureMoves.join('\n')
          }
        ]
      });
      break;
      
    case 'voice://matt/banned-elements':
      res.json({
        contents: [
          {
            uri: uri,
            mimeType: "text/plain",
            text: voiceData.voice.banned.join('\n')
          }
        ]
      });
      break;
      
    default:
      return res.status(404).json({ error: 'Resource not found' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'matt-vst-lfr-mcp'
  });
});

// Root endpoint with service info
app.get('/', (req, res) => {
  res.json({
    service: "Matt's Voice, Style, and Tone MCP Server",
    version: "1.0.0",
    endpoints: {
      capabilities: "/mcp/capabilities",
      prompts: "/mcp/prompts/list",
      resources: "/mcp/resources/list",
      health: "/health"
    },
    description: "Model Context Protocol server serving Matt's voice, style, and tone preferences"
  });
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Capabilities: http://localhost:${PORT}/mcp/capabilities`);
}); 