# UICP Quick Start Guide

Get started with UICP in 5 minutes!

## What is UICP?

UICP (User Interface Context Protocol) lets your AI assistant dynamically create and render custom UI components in chat responses. Instead of just text, your AI can display rich, interactive components like NBA game scores, charts, cards, and more.

## Quick Test

Try these prompts with your chat application:

### 1. Discover Components
```
What UI components do you have available?
```

The AI will call the `get_ui_components` tool and tell you what it can create.

### 2. Create a Component
```
Show me the Lakers vs Celtics game with Lakers winning 108-105
```

The AI will:
1. Discover the NBAGameScore component
2. Create a UICP block with the game data
3. Return a response with a rendered game score component

### 3. See the Component
You should see a beautiful, styled NBA game score display instead of just text!

## How the AI Uses UICP

### Step 1: Discovery
When you ask for something visual, the AI calls:
```typescript
get_ui_components({ component_type: "sports" })
```

It receives:
```json
{
  "components": [{
    "uid": "NBAGameScore",
    "description": "Display NBA game scores",
    "inputs": {
      "homeTeam": { "type": "string", "required": true },
      "awayTeam": { "type": "string", "required": true },
      ...
    }
  }]
}
```

### Step 2: Creation
The AI then calls:
```typescript
create_ui_component({
  uid: "NBAGameScore",
  data: {
    homeTeam: "Los Angeles Lakers",
    awayTeam: "Boston Celtics",
    homeScore: 108,
    awayScore: 105
  }
})
```

### Step 3: Response
The AI includes the UICP block in its response:

```
Here's the game:

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

Great game!
```

### Step 4: Rendering
The message component automatically:
1. Detects the UICP block
2. Parses the JSON
3. Renders the NBAGameScore component
4. Displays it beautifully in the chat

## Example Prompts to Try

### NBA Game Scores
- "Show me a Lakers vs Warriors game, Lakers won 115-110"
- "Display the Celtics vs Heat game from last night, it went to overtime"
- "Create a game score for Bulls 98, Knicks 95"

### With Different Statuses
- "Show a live game between the Nets and 76ers, currently 45-42 in the 2nd quarter"
- "Display a scheduled game between the Mavericks and Rockets tomorrow"

## Adding Your Own Component

### 1. Create the Component (2 minutes)

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
      <h3 className="text-2xl">{city}</h3>
      <p className="text-4xl">{temperature}°F</p>
      <p className="text-lg">{condition}</p>
    </div>
  );
}
```

### 2. Add to Definitions (2 minutes)

```json
// lib/uicp/definitions.json
{
  "uid": "WeatherCard",
  "type": "weather",
  "description": "Display current weather for a city",
  "componentPath": "components/weather-card",
  "inputs": {
    "city": {
      "type": "string",
      "description": "City name",
      "required": true
    },
    "temperature": {
      "type": "number",
      "description": "Temperature in Fahrenheit",
      "required": true
    },
    "condition": {
      "type": "string",
      "description": "Weather condition (e.g., 'Sunny', 'Cloudy')",
      "required": true
    }
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

### 3. Done! Test It!

That's it! The parser automatically discovers and loads your component from the `componentPath` in definitions.json. No manual registration needed!

```
Show me the weather in San Francisco, it's 68 degrees and partly cloudy
```

Your AI can now create weather cards. The component will be dynamically loaded when first used.

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    AI Chat Application                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              AI Agent (GPT-4, etc.)             │  │
│  │                                                  │  │
│  │  1. User asks question                          │  │
│  │  2. Calls get_ui_components()                   │  │
│  │  3. Calls create_ui_component()                 │  │
│  │  4. Returns text with UICP block                │  │
│  └──────────────────────────────────────────────────┘  │
│         │                                    │           │
│         │ Uses                               │           │
│         ▼                                    ▼           │
│  ┌──────────────┐                   ┌──────────────┐   │
│  │  UICP Tools  │                   │ UICP Parser  │   │
│  │              │                   │              │   │
│  │ - Discover   │                   │ - Extract    │   │
│  │ - Create     │                   │ - Validate   │   │
│  │ - Validate   │                   │ - Render     │   │
│  └──────────────┘                   └──────────────┘   │
│         │                                    │           │
│         │                                    │           │
│         ▼                                    ▼           │
│  ┌────────────────────────────────────────────────┐    │
│  │           definitions.json                    │    │
│  │  - Component schemas                          │    │
│  │  - Input/output definitions                   │    │
│  │  - Examples                                   │    │
│  └────────────────────────────────────────────────┘    │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────┐    │
│  │         Custom React Components               │    │
│  │  - NBAGameScore                               │    │
│  │  - WeatherCard                                │    │
│  │  - Your Components                            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Files Overview

```
your-project/
├── components/
│   ├── nba-game-score.tsx       # Custom component
│   └── message.tsx               # Uses UICP parser
├── lib/
│   └── uicp/
│       ├── definitions.json      # Component definitions
│       ├── tools.ts              # AI tools (discovery & creation)
│       └── parser.tsx            # Parsing & rendering
└── app/
    └── (preview)/
        └── api/
            └── chat/
                └── route.ts       # Integrates UICP tools
```

## Key Concepts

### 1. Component UID
Unique identifier for each component (e.g., "NBAGameScore")

### 2. Component Type
Category for organization (e.g., "sports", "chart", "weather")

### 3. Input Schema
Defines required and optional fields with types

### 4. UICP Block
Markdown code block with ```uicp containing JSON

### 5. Component Registry
Maps UIDs to React components for rendering

## Common Questions

### Q: Can I use multiple components in one response?
**A:** Yes! The AI can include multiple UICP blocks in a single response.

### Q: Can I mix text and components?
**A:** Absolutely! UICP blocks can be anywhere in the response text.

### Q: What if the AI provides invalid data?
**A:** The parser validates and shows an error UI with details.

### Q: Can components be interactive?
**A:** Yes! They're regular React components, so you can add state, clicks, etc.

### Q: Do I need to rebuild for new components?
**A:** Yes, since components are React code. But the AI automatically discovers new components from definitions.json.

## Next Steps

1. **Explore the implementation**: Read `UICP_IMPLEMENTATION.md` for details
2. **Create your own component**: Follow the "Adding Your Own Component" guide
3. **Experiment with prompts**: Try different ways to trigger component creation
4. **Customize styling**: Update component CSS to match your design
5. **Add more types**: Create chart, card, table, or other component types

## Troubleshooting

### Components not rendering?
1. Check browser console for errors
2. Verify component is registered in parser.tsx
3. Check UID spelling in definitions.json

### AI not using components?
1. Try more specific prompts
2. Check tools are loaded in chat route
3. Verify OPENAI_API_KEY is set

### Validation errors?
1. Check required fields in definitions.json
2. Compare with example data
3. Look at console.log output

## Tips for Success

1. **Clear descriptions**: Write detailed descriptions in definitions.json
2. **Good examples**: Provide realistic example data
3. **Specific prompts**: Ask the AI to create specific things
4. **Iterate quickly**: Start simple, then add features
5. **Test often**: Try edge cases and invalid data

---

🎉 **You're ready to go!** Start chatting and watch your AI create beautiful components.

For detailed documentation, see `UICP_IMPLEMENTATION.md`.

