# UICP (User Interface Context Protocol) Example

An AI chat application built with the [Vercel AI SDK](https://sdk.vercel.ai/docs) and [Next.js](https://nextjs.org/) that demonstrates **automatic multi-step tool calling** and **dynamic UI component rendering** through the User Interface Context Protocol (UICP).

## 🎯 What Makes This Demo Special?

Unlike traditional chatbots that only return text, this application enables your AI assistant to:

1. **Discover and create custom UI components** on the fly
2. **Access real-world tools** like Google Search, Gmail, and GitHub  
3. **Render rich, interactive visualizations** directly in the chat
4. **Handle complex multi-step tasks** automatically

**Try it now**: Ask "Show me a Lakers vs Celtics game" and watch the AI create a beautiful, styled game score component instead of just describing it in text!

## 🎨 UICP - User Interface Context Protocol

### The Problem

Traditional chatbots can only respond with text, making it difficult to display:
- Structured data visualizations
- Rich, styled components
- Interactive UI elements
- Domain-specific displays (game scores, charts, cards, etc.)

### The Solution

**UICP** (User Interface Context Protocol) enables AI models to dynamically discover, create, and render custom React components in their responses.

### How UICP Works

#### 1. Discovery Phase
The AI calls the `get_ui_components()` tool to learn what components are available:

```typescript
// AI discovers available components
get_ui_components({ component_type: "sports" })

// Returns:
{
  "components": [{
    "uid": "NBAGameScore",
    "type": "sports",
    "description": "Display NBA basketball game scores",
    "inputs": {
      "homeTeam": { "type": "string", "required": true },
      "awayTeam": { "type": "string", "required": true },
      "homeScore": { "type": "number", "required": true },
      "awayScore": { "type": "number", "required": true },
      "gameStatus": { "type": "string", "required": false }
    }
  }]
}
```

#### 2. Creation Phase
When appropriate, the AI creates a **UICP block** - a special formatted code block:

````markdown
Here's last night's game:

```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Los Angeles Lakers",
    "awayTeam": "Boston Celtics",
    "homeScore": 108,
    "awayScore": 105,
    "gameStatus": "final"
  }
}
```

The Lakers won by 3 points!
````

#### 3. Rendering Phase
The chat interface automatically:
- Detects UICP blocks using regex pattern matching
- Validates the JSON against component schemas
- Renders the appropriate React component with provided data
- Handles errors gracefully with user-friendly messages

#### 4. Result
Users see a beautiful, styled NBA game score component inline with the text response - not just a text description!

### UICP Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Question                      │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│            AI discovers components                  │
│         get_ui_components("sports")                 │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│          AI creates UICP block with data            │
│    create_ui_component("NBAGameScore", {...})      │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│         AI returns text with UICP block             │
│     (Mixed markdown text + UICP code blocks)        │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│       Message component detects UICP blocks         │
│            hasUICPBlocks(content)                   │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│      Parser extracts, validates & renders           │
│        parseUICPContent(content)                    │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│   Beautiful React component renders in chat!        │
│        (NBAGameScore component displayed)           │
└─────────────────────────────────────────────────────┘
```

### What You Can Build With UICP

- **Sports Scores** - Game scores with live status indicators
- **Data Visualizations** - Charts, graphs, and tables
- **Weather Cards** - Current conditions with icons
- **Product Cards** - E-commerce displays with pricing
- **News Articles** - Rich article previews
- **Order Tracking** - Package status displays
- **Interactive Forms** - Surveys and data collection
- **Timeline Views** - Event sequences
- **Custom Business Components** - Domain-specific UI elements

### Implementation Files

```
your-project/
├── lib/uicp/
│   ├── definitions.json      # Component schemas & metadata
│   ├── tools.ts              # AI tools for discovery & creation
│   ├── parser.tsx            # Client-side parser & renderer
│   ├── index.ts              # Convenient exports
│   └── README.md             # Library documentation
│
├── components/
│   ├── nba-game-score.tsx    # Example: NBA game component
│   └── message.tsx           # Integrates UICP parser
│
├── app/(preview)/api/chat/
│   └── route.ts              # Integrates UICP tools
│
└── docs/
    ├── UICP_QUICK_START.md   # 5-minute getting started
    ├── UICP_IMPLEMENTATION.md # Complete technical docs
    └── UICP_SUMMARY.md        # Implementation overview
```

### Adding Your Own Components

It's incredibly simple - just **2 steps**:

#### Step 1: Create the React Component (2 minutes)

```tsx
// components/weather-card.tsx
export interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
}

export function WeatherCard({ city, temperature, condition }: WeatherCardProps) {
  return (
    <div className="bg-blue-900 p-6 rounded-lg">
      <h3 className="text-2xl font-bold">{city}</h3>
      <p className="text-4xl">{temperature}°F</p>
      <p className="text-lg">{condition}</p>
    </div>
  );
}
```

#### Step 2: Add to Definitions (2 minutes)

```json
// lib/uicp/definitions.json - Add to components array:
{
  "uid": "WeatherCard",
  "type": "weather",
  "description": "Display current weather for a city",
  "componentPath": "components/weather-card",
  "inputs": {
    "city": { "type": "string", "required": true },
    "temperature": { "type": "number", "required": true },
    "condition": { "type": "string", "required": true }
  },
  "example": {
    "uid": "WeatherCard",
    "data": {
      "city": "San Francisco",
      "temperature": 68,
      "condition": "Partly Cloudy"
    }
  }
}
```

**That's it!** The parser automatically discovers and loads your component using the `componentPath`. No manual registration needed!

Now try: *"Show me the weather in San Francisco, it's 68 degrees and partly cloudy"*

### UICP Documentation

- **[UICP Quick Start](./UICP_QUICK_START.md)** - Get started in 5 minutes with examples
- **[UICP Implementation Guide](./UICP_IMPLEMENTATION.md)** - Complete technical reference and architecture
- **[UICP Summary](./UICP_SUMMARY.md)** - High-level implementation overview
- **[Library README](./lib/uicp/README.md)** - Core library documentation and API reference

## 🚀 Arcade Tools Integration

This demo also integrates [Arcade](https://arcade.dev) tools, giving your AI agent access to real-world capabilities:

### Available Toolkits

- **Google Search** - Find current information on any topic
- **Gmail** - Read, send, and manage emails  
- **Slack** - Send messages and manage channels
- **GitHub** - Create issues, pull requests, manage repos
- **Google Calendar** - Manage events and schedules
- **Linear** - Project management and issue tracking
- **And 50+ more toolkits** available

### How It Works

The Arcade integration automatically handles:
- OAuth authentication flows
- Tool discovery and loading
- User-specific permissions
- Error handling and retries

Simply add toolkit names to enable new capabilities:

```typescript
// app/(preview)/api/chat/route.ts
const ARCADE_TOOLKITS = [
  "google_search",
  "gmail",
  "slack",
  "github"
];
```

### Documentation

- **[Arcade Setup Guide](./ARCADE_SETUP.md)** - Complete setup instructions
- **[Available Toolkits](./ARCADE_TOOLKITS.md)** - Full toolkit reference

## 🔄 Automatic Multi-Step Tool Execution

The Vercel AI SDK's `streamText` function with `maxSteps` enabled allows the AI to automatically chain multiple tool calls together without requiring additional user prompts.

**Example flow:**
1. User: "Search for recent AI news and show me a summary"
2. AI calls `GoogleSearch.Search` → Gets results
3. AI analyzes results → Generates summary
4. AI calls `create_ui_component` → Creates news card component
5. User sees: Streamed text summary + Rich news card component

All automatically, in a single response!

## 📦 Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-roundtrips&env=OPENAI_API_KEY&envDescription=API%20keys%20needed%20for%20application&envLink=platform.openai.com)

## 🚀 Getting Started

### Prerequisites

1. Sign up for an [OpenAI](https://platform.openai.com/) account
2. Sign up for an [Arcade](https://arcade.dev) account  
3. Get your API keys from both services

### Installation

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with your preferred package manager:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

```bash
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

```bash
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
# Required: OpenAI API key for the AI model
OPENAI_API_KEY=your_openai_api_key

# Required: Arcade API credentials for real-world tools
ARCADE_API_KEY=your_arcade_api_key
ARCADE_BASE_URL=https://api.arcade-ai.com
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Try These Prompts

### Test UICP Components

- "Show me a Lakers vs Celtics game with the Lakers winning 108-105"
- "Display a live Warriors vs Nets game, currently 52-48 in the 2nd quarter"
- "What UI components do you have available?"

### Test Arcade Tools

- "Search Google for the latest AI developments"
- "What's the weather in San Francisco?"
- "Find information about the Vercel AI SDK"

### Test Multi-Step Execution

- "Search for NBA scores today and show me the top game"
- "Find recent news about Next.js and create a summary card"

## 🏗️ Project Structure

```
uicp-ai-sdk-chat/
├── app/(preview)/
│   ├── api/chat/route.ts        # Chat API with UICP + Arcade tools
│   ├── page.tsx                 # Main chat interface
│   ├── layout.tsx               # App layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── message.tsx              # Message component with UICP parser
│   ├── nba-game-score.tsx       # Example UICP component
│   ├── markdown.tsx             # Markdown renderer
│   └── icons.tsx                # Icon components
│
├── lib/uicp/
│   ├── definitions.json         # UICP component schemas
│   ├── tools.ts                 # AI tools for UICP
│   ├── parser.tsx               # UICP parser & renderer
│   ├── index.ts                 # Exports
│   ├── README.md                # Library docs
│   └── examples.md              # Example UICP blocks
│
├── docs/
│   ├── UICP_QUICK_START.md      # Quick start guide
│   ├── UICP_IMPLEMENTATION.md   # Technical docs
│   ├── UICP_SUMMARY.md          # Overview
│   ├── ARCADE_SETUP.md          # Arcade setup guide
│   └── ARCADE_TOOLKITS.md       # Available toolkits
│
└── README.md                    # This file
```

## 🧪 Development

### Adding New UICP Components

1. Create React component in `components/`
2. Add definition to `lib/uicp/definitions.json`
3. Test with AI: "Show me [your component]"

See [UICP Quick Start](./UICP_QUICK_START.md) for detailed guide.

### Adding New Arcade Tools

1. Find toolkit name in [Arcade docs](https://docs.arcade.dev)
2. Add to `ARCADE_TOOLKITS` array in `app/(preview)/api/chat/route.ts`
3. Restart dev server
4. Test with AI prompt

See [Arcade Setup](./ARCADE_SETUP.md) for detailed guide.

## 📚 Learn More

### Vercel AI SDK
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [AI SDK Examples](https://sdk.vercel.ai/examples)
- [AI Playground](https://play.vercel.ai)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### UICP
- [Quick Start Guide](./UICP_QUICK_START.md)
- [Implementation Docs](./UICP_IMPLEMENTATION.md)
- [Library Reference](./lib/uicp/README.md)

### Arcade
- [Arcade Documentation](https://docs.arcade.dev)
- [Setup Guide](./ARCADE_SETUP.md)
- [Available Toolkits](./ARCADE_TOOLKITS.md)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new UICP components
- Integrate additional Arcade toolkits
- Improve documentation
- Report issues or suggest features

## 📄 License

See [LICENSE.txt](./LICENSE.txt) for details.

## 🎉 What's Next?

1. **Explore UICP** - Create your own custom components
2. **Add More Tools** - Enable Gmail, Slack, GitHub tools
3. **Experiment** - Try combining tools and components in creative ways
4. **Build** - Create your own AI-powered application with dynamic UI

---

**Built with ❤️ using [Vercel AI SDK](https://sdk.vercel.ai/), [Next.js](https://nextjs.org/), and [Arcade](https://arcade.dev)**
