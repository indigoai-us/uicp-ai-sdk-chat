# UICP Library

This directory contains the core UICP (User Interface Context Protocol) implementation for enabling AI-powered dynamic UI component rendering.

## Contents

### Core Files

- **`definitions.json`** - Component definitions and schemas
- **`tools.ts`** - AI tools for component discovery and creation
- **`parser.tsx`** - Parser for extracting and rendering UICP blocks
- **`examples.md`** - Example UICP blocks for testing

## Module Structure

This library is designed to be modular and can be packaged into separate npm modules:

### Tools Module (`tools.ts`)

**Purpose**: AI-side tooling for component discovery and creation

**Dependencies**:
- `ai` - Vercel AI SDK
- `zod` - Schema validation
- `definitions.json` - Component definitions

**Exports**:
- `getUIComponentsTool` - Discover available components
- `createUIComponentTool` - Create UICP blocks
- `uicpTools` - Combined tool collection

**Usage**:
```typescript
import { uicpTools } from '@/lib/uicp/tools';

const tools = {
  ...uicpTools,
  // other tools
};
```

**Future Package**: `@uicp/tools`

### Parser Module (`parser.tsx`)

**Purpose**: Client-side parsing and rendering of UICP blocks

**Dependencies**:
- `react` - React library
- `definitions.json` - Component definitions
- Component imports - Actual React components

**Exports**:
- `extractUICPBlocks()` - Extract UICP blocks from text
- `validateUICPBlock()` - Validate blocks against schemas
- `renderUICPBlock()` - Render a block as React component
- `parseUICPContent()` - Main parser function
- `hasUICPBlocks()` - Check for UICP blocks
- `registerComponent()` - Register new components
- `getRegisteredComponents()` - Get registered components

**Usage**:
```typescript
import { parseUICPContent, hasUICPBlocks } from '@/lib/uicp/parser';

if (hasUICPBlocks(content)) {
  const parsed = parseUICPContent(content);
  // Render parsed content
}
```

**Future Package**: `@uicp/parser`

### Definitions (`definitions.json`)

**Purpose**: Single source of truth for component schemas

**Structure**:
```json
{
  "version": "1.0.0",
  "components": [
    {
      "uid": "ComponentUID",
      "type": "category",
      "description": "Component description",
      "componentPath": "relative/path/to/component",
      "inputs": { /* input schema */ },
      "example": { /* example usage */ }
    }
  ]
}
```

**Future Package**: `@uicp/definitions` (shared by tools and parser)

## Integration Guide

### 1. Add UICP Tools to AI Agent

```typescript
// app/api/chat/route.ts
import { uicpTools } from '@/lib/uicp/tools';

const tools = {
  ...uicpTools,
  // other tools
};

const stream = streamText({
  model: openai("gpt-4o"),
  tools,
  // ...
});
```

### 2. Use Parser in Message Component

```typescript
// components/message.tsx
import { parseUICPContent, hasUICPBlocks } from '@/lib/uicp/parser';

export function Message({ content }) {
  if (hasUICPBlocks(content)) {
    const parsed = parseUICPContent(content);
    return (
      <>
        {parsed.map((item) => 
          item.type === 'component' 
            ? item.content 
            : <Markdown>{item.content}</Markdown>
        )}
      </>
    );
  }
  
  return <Markdown>{content}</Markdown>;
}
```

### 3. Components Auto-Load (No Registration Needed!)

The parser automatically loads components based on the `componentPath` in definitions.json. Just add your component to the definitions file and it will be dynamically loaded when first used.

**Optional Pre-Registration**: If you want to avoid dynamic imports or pre-load components, you can manually register:

```typescript
import { registerComponent } from '@/lib/uicp/parser';
import { MyComponent } from '@/components/my-component';

registerComponent('MyComponent', MyComponent);
```

But this is completely optional! The system works automatically.

## Adding New Components

1. **Create React component** in `components/`
2. **Add definition** to `definitions.json` (including `componentPath`)

That's it! The parser uses the `componentPath` field to automatically load your component via dynamic imports. No manual imports or registration required in `parser.tsx`.

See `examples.md` for examples.

## API Reference

### Tools API

#### `getUIComponentsTool`

Discover available UI components.

**Parameters**:
- `component_type?: string` - Filter by type
- `uid?: string` - Get specific component

**Returns**:
```typescript
{
  success: boolean;
  version: string;
  components: Array<{
    uid: string;
    type: string;
    description: string;
    inputs: Record<string, any>;
    example: any;
  }>;
  usage: {
    instructions: string;
    format: string;
  };
}
```

#### `createUIComponentTool`

Create a UICP block.

**Parameters**:
- `uid: string` - Component UID
- `data: Record<string, any>` - Component data

**Returns**:
```typescript
{
  success: boolean;
  message?: string;
  uicp_block?: string;
  error?: string;
  missing_fields?: string[];
}
```

### Parser API

#### `extractUICPBlocks(content: string)`

Extract UICP blocks from markdown text.

**Returns**:
```typescript
{
  blocks: UICPBlock[];
  contentWithPlaceholders: string;
}
```

#### `validateUICPBlock(block: UICPBlock)`

Validate a block against definitions.

**Returns**:
```typescript
{
  valid: boolean;
  errors: string[];
}
```

#### `renderUICPBlock(block: UICPBlock, key: string)`

Render a block as a React element.

**Returns**: `React.ReactElement | null`

#### `parseUICPContent(content: string)`

Parse content and return mixed text/component array.

**Returns**:
```typescript
Array<{
  type: 'text' | 'component';
  content: string | React.ReactElement;
  key: string;
}>
```

#### `hasUICPBlocks(content: string)`

Check if content contains UICP blocks.

**Returns**: `boolean`

#### `registerComponent(uid: string, component: React.ComponentType)`

Register a component dynamically.

#### `getRegisteredComponents()`

Get list of registered component UIDs.

**Returns**: `string[]`

## File Structure

```
lib/uicp/
├── README.md              # This file
├── definitions.json       # Component schemas
├── tools.ts              # AI tools (tools package)
├── parser.tsx            # Parser & renderer (parser package)
└── examples.md           # Example UICP blocks
```

## Packaging Roadmap

### Phase 1: Current State
- All code in `lib/uicp/`
- Directly imported by application
- Single project integration

### Phase 2: Local Packages
- Extract to workspace packages
- Use workspace: protocol
- Easier to test modular architecture

### Phase 3: npm Packages
- Publish to npm registry
- Versioned releases
- Public or private packages
- Used across multiple projects

### Package Structure

```
@uicp/
├── definitions/          # Shared definitions
│   └── package.json
├── tools/               # AI tools
│   └── package.json
└── parser/              # Client parser
    └── package.json
```

## Best Practices

1. **Keep definitions.json as single source of truth**
2. **Validate all inputs in both tools and parser**
3. **Handle errors gracefully with user-friendly messages**
4. **Document all components thoroughly**
5. **Provide realistic examples**
6. **Test with actual AI interactions**

## Testing

### Unit Tests
```typescript
// Example tests
describe('UICP Parser', () => {
  it('extracts UICP blocks', () => {
    const content = 'Text ```uicp\n{"uid":"Test"}\n``` more text';
    const { blocks } = extractUICPBlocks(content);
    expect(blocks).toHaveLength(1);
  });
});
```

### Integration Tests
```typescript
describe('UICP Tools', () => {
  it('creates valid UICP block', async () => {
    const result = await createUIComponentTool.execute({
      uid: 'NBAGameScore',
      data: { homeTeam: 'Lakers', awayTeam: 'Celtics', ... }
    });
    expect(result.success).toBe(true);
  });
});
```

## Contributing

When adding new features to UICP:

1. Update definitions.json if needed
2. Add or modify tools as needed
3. Update parser if new formats needed
4. Add examples to examples.md
5. Update README files
6. Test end-to-end with AI

## Support

For questions or issues:
1. Check examples.md for usage examples
2. Review API reference above
3. See parent UICP_IMPLEMENTATION.md for details
4. Test with simple cases first

---

This library enables AI-powered dynamic UI generation through a standardized protocol.

