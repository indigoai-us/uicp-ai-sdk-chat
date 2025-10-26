# UICP (User Interface Context Protocol) Implementation

## Overview

This project implements UICP - a protocol that allows AI models to dynamically discover and render custom UI components in chat responses. The AI can discover what components are available, create them with appropriate data, and have them automatically rendered in the chat interface.

## Architecture

The UICP implementation consists of 5 main components:

### 1. Custom UI Components (`components/`)

Custom React components that can be rendered in chat responses.

**Example: NBA Game Score Component**
- **File**: `components/nba-game-score.tsx`
- **Purpose**: Displays NBA basketball game scores with team info, scores, and game status
- **Usage**: Automatically rendered when the AI creates an NBAGameScore UICP block

### 2. Component Definitions (`lib/uicp/definitions.json`)

JSON file that defines all available UICP components, similar to TypeScript type definitions.

**Structure**:
```json
{
  "version": "1.0.0",
  "components": [
    {
      "uid": "NBAGameScore",
      "type": "sports",
      "description": "Component description",
      "componentPath": "components/nba-game-score",
      "inputs": {
        "fieldName": {
          "type": "string",
          "description": "Field description",
          "required": true
        }
      },
      "example": { ... }
    }
  ]
}
```

**Key Fields**:
- `uid`: Unique identifier for the component
- `type`: Component category (sports, chart, card, etc.)
- `componentPath`: Path to the component file (for modular imports)
- `inputs`: Schema defining required and optional fields
- `example`: Example usage with sample data

### 3. UICP Tools (`lib/uicp/tools.ts`)

Two AI tools that enable component discovery and creation:

#### `get_ui_components`
Allows the AI to discover available components.

**Parameters**:
- `component_type` (optional): Filter by type (e.g., "sports", "chart")
- `uid` (optional): Get specific component by UID

**Returns**:
- List of available components
- Component schemas and examples
- Usage instructions

#### `create_ui_component`
Creates a formatted UICP block for rendering.

**Parameters**:
- `uid`: Component identifier (e.g., "NBAGameScore")
- `data`: Component data matching the input schema

**Returns**:
- Formatted UICP code block
- Validation results
- Usage instructions

### 4. UICP Parser (`lib/uicp/parser.tsx`)

Parses UICP blocks from text and renders React components.

**Key Functions**:

- `extractUICPBlocks(content)`: Extracts UICP blocks from markdown
- `validateUICPBlock(block)`: Validates block against definitions
- `renderUICPBlock(block, key)`: Renders a UICP block as React component
- `parseUICPContent(content)`: Main parser - returns array of text/components
- `hasUICPBlocks(content)`: Checks if content contains UICP blocks

**Component Registry**:
All components must be registered in `COMPONENT_REGISTRY`:
```typescript
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  NBAGameScore: NBAGameScore,
};
```

### 5. Integration Points

#### Chat Route (`app/(preview)/api/chat/route.ts`)
- Imports UICP tools
- Adds tools to the agent's tool set
- Updates system prompt with UICP instructions

#### Message Component (`components/message.tsx`)
- Imports UICP parser functions
- Checks for UICP blocks in messages
- Parses and renders UICP components
- Handles both streaming and static messages

## UICP Block Format

UICP blocks are markdown code blocks with the `uicp` language tag:

```markdown
```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Los Angeles Lakers",
    "awayTeam": "Boston Celtics",
    "homeScore": 108,
    "awayScore": 105,
    "gameDate": "Oct 26, 2025",
    "gameStatus": "final"
  }
}
```
```

The parser extracts these blocks, validates them, and renders the appropriate React component.

## How It Works

### AI Flow

1. **User asks about something that could use a custom component** (e.g., "What was the score of last night's Lakers game?")

2. **AI discovers components** by calling `get_ui_components` tool
   - Optionally filters by type or UID
   - Receives component schemas and examples

3. **AI creates a UICP block** by calling `create_ui_component` tool
   - Provides UID and data
   - Tool validates and returns formatted UICP block

4. **AI includes UICP block in response**
   - Returns the UICP block string as part of the text response
   - Can include regular text before/after the component

5. **Parser renders the component**
   - Message component detects UICP blocks
   - Parser extracts and validates blocks
   - Component is rendered with the provided data

### Example Interaction

**User**: "Show me the Lakers vs Celtics game from last night"

**AI Process**:
1. Calls `get_ui_components({ component_type: "sports" })`
2. Discovers NBAGameScore component
3. Calls `create_ui_component({ uid: "NBAGameScore", data: {...} })`
4. Includes returned UICP block in response

**AI Response**:
```
Here's the game from last night:

```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Los Angeles Lakers",
    "awayTeam": "Boston Celtics",
    "homeScore": 108,
    "awayScore": 105,
    "gameDate": "Oct 26, 2025",
    "gameStatus": "final"
  }
}
```

It was a close game with the Lakers winning by 3 points!
```

**Rendered Output**: The user sees the text plus a beautiful, styled NBA game score component.

## Adding New Components

### Step 1: Create the React Component

```tsx
// components/my-component.tsx
export interface MyComponentProps {
  title: string;
  value: number;
}

export function MyComponent({ title, value }: MyComponentProps) {
  return (
    <div className="...">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
```

### Step 2: Add to Definitions

```json
// lib/uicp/definitions.json
{
  "uid": "MyComponent",
  "type": "category",
  "description": "Description of what this component does",
  "componentPath": "components/my-component",
  "inputs": {
    "title": {
      "type": "string",
      "description": "The title to display",
      "required": true
    },
    "value": {
      "type": "number",
      "description": "The value to display",
      "required": true
    }
  },
  "example": {
    "uid": "MyComponent",
    "data": {
      "title": "Example Title",
      "value": 42
    }
  }
}
```

### Step 3: Done!

That's it! The parser automatically discovers and dynamically loads your component using the `componentPath` from definitions.json. No manual registration needed!

**Optional**: If you want to pre-load a component (to avoid dynamic imports), you can manually register it:

```tsx
// Optional pre-registration
import { registerComponent } from '@/lib/uicp/parser';
import { MyComponent } from '@/components/my-component';

registerComponent('MyComponent', MyComponent);
```

The AI can now discover and use your component.

## Modularity & Packaging

The implementation is designed for modularity with two main packages:

### Tools Package (`lib/uicp/tools.ts`)
- Contains tool definitions for AI agents
- Depends on: definitions.json, ai, zod
- Can be packaged independently
- Used by: AI/LLM applications

### Parser Package (`lib/uicp/parser.tsx`)
- Contains parsing and rendering logic
- Depends on: definitions.json, React
- Can be packaged independently
- Used by: Client applications

**Future**: These can be extracted into npm packages:
- `@uicp/tools` - AI tool definitions
- `@uicp/parser` - Client-side parser
- `@uicp/definitions` - Shared type definitions

## Best Practices

1. **Keep components focused**: Each component should do one thing well
2. **Validate inputs**: Use the definitions schema to validate all inputs
3. **Provide examples**: Include comprehensive examples in definitions
4. **Handle errors gracefully**: Parser shows error UI for invalid blocks
5. **Test with AI**: Try actual AI interactions to validate UX
6. **Document thoroughly**: Update definitions with clear descriptions

## Error Handling

The parser handles errors gracefully:

- **Unknown UID**: Shows "Component Not Registered" error UI
- **Missing required fields**: Shows "Invalid UICP Component" with field list
- **Invalid JSON**: Leaves original code block in place
- **Component render errors**: Caught by React error boundaries

## Testing

### Manual Testing

1. **Test component discovery**:
   ```
   User: "What UI components do you have available?"
   ```

2. **Test component creation**:
   ```
   User: "Show me a Lakers game score"
   ```

3. **Test validation**:
   - Try incomplete data
   - Try invalid UIDs
   - Try malformed JSON

### Automated Testing

Consider adding:
- Unit tests for parser functions
- Integration tests for tool execution
- Component snapshot tests
- Validation schema tests

## Troubleshooting

### Component Not Rendering

1. **Check UID spelling** in definitions and registry
2. **Verify component is imported** in parser.tsx
3. **Check component is registered** in COMPONENT_REGISTRY
4. **Look for console errors** in browser dev tools

### Validation Errors

1. **Check required fields** in definitions.json
2. **Verify data types** match schema
3. **Test with example data** from definitions

### AI Not Using Components

1. **Check tools are registered** in chat route
2. **Verify system prompt** mentions UICP
3. **Test tool calls** with simple requests
4. **Check API credentials** and rate limits

## Future Enhancements

- **Component versioning**: Support multiple versions of components
- **Dynamic imports**: Load components on-demand
- **Validation library**: Use JSON Schema or Zod for runtime validation
- **Component marketplace**: Share components across projects
- **Interactive components**: Support stateful, interactive UI elements
- **Theming**: Consistent styling across components
- **Analytics**: Track component usage and performance

## Resources

- **UICP Specification**: See publisher-app documentation
- **Component Examples**: Check `components/` directory
- **Tool Examples**: See `lib/uicp/tools.ts`
- **Parser Tests**: See `lib/uicp/parser.tsx`

---

**Questions or Issues?** Check the implementation files for inline documentation and examples.

