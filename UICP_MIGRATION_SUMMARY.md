# UICP Package Migration Summary

## Date
November 16, 2025

## Overview
Successfully migrated from local UICP implementation (`lib/uicp/`) to linked UICP packages (`@uicp/parser` and `@uicp/tools`).

## Changes Made

### 1. Package Installation
- Used `npm link @uicp/parser @uicp/tools` instead of npm install
- Packages are now symlinked in `node_modules/@uicp/`
- This allows testing local development packages before publishing to npm

### 2. Backend API Updates (`app/(preview)/api/chat/route.ts`)

**Before:**
```typescript
import { uicpTools } from "@/lib/uicp/tools";

const customTools = {
  ...uicpTools,
};
```

**After:**
```typescript
import { getUIComponents, createUIComponent } from "@uicp/tools";
import { resolve } from "path";

const definitionsPath = resolve(process.cwd(), 'lib/uicp/definitions.json');

const customTools = {
  get_ui_components: tool({
    description: 'Discover available UI components and their schemas',
    parameters: z.object({
      component_type: z.string().optional(),
      uid: z.string().optional(),
    }),
    execute: async ({ component_type, uid }) => {
      return await getUIComponents(definitionsPath, {
        component_type,
        uid,
      });
    },
  }),
  create_ui_component: tool({
    description: 'Create a UICP block for rendering a UI component',
    parameters: z.object({
      uid: z.string(),
      data: z.record(z.any()),
    }),
    execute: async ({ uid, data }) => {
      return await createUIComponent(definitionsPath, { uid, data });
    },
  }),
};
```

**Key Changes:**
- Import `getUIComponents` and `createUIComponent` functions from `@uicp/tools`
- Create tool definitions manually using Vercel AI SDK's `tool()` helper
- Pass `definitionsPath` to each function call
- Use the official UICP API instead of pre-configured tools

### 3. Frontend Parser Updates (`components/message.tsx`)

**Before:**
```typescript
import { parseUICPContent, hasUICPBlocks } from "@/lib/uicp/parser";

// Components were statically registered in parser.tsx
// Usage:
parseUICPContent(text).map(...)
```

**After:**
```typescript
import { parseUICPContentSync, hasUICPBlocks, registerComponent } from "@uicp/parser";
import definitions from "@/lib/uicp/definitions.json";

// Import and register UICP components
import { NBAGameScore } from "@/components/nba-game-score";
import { NewsArticlePreview } from "@/components/news-article-preview";
import { BarChart } from "@/components/bar-chart";
import { LineChart } from "@/components/line-chart";

// Register all UICP components
registerComponent('NBAGameScore', NBAGameScore);
registerComponent('NewsArticlePreview', NewsArticlePreview);
registerComponent('BarChart', BarChart);
registerComponent('LineChart', LineChart);

// Usage:
parseUICPContentSync(text, definitions as any).map(...)
```

**Key Changes:**
- Import from `@uicp/parser` instead of local lib
- Use `parseUICPContentSync` instead of `parseUICPContent`
- Pass `definitions` object as second parameter to `parseUICPContentSync`
- Explicitly register components using `registerComponent()` function
- Components must be registered at module load time

## Files Modified
1. `app/(preview)/api/chat/route.ts` - Backend API route with UICP tools
2. `components/message.tsx` - Frontend message component with parser

## Files Preserved
- `lib/uicp/definitions.json` - Component definitions (still used by linked packages)
- `lib/uicp/tools.ts` - Local implementation (can be archived/removed later)
- `lib/uicp/parser.tsx` - Local implementation (can be archived/removed later)
- `lib/uicp/index.ts` - Local exports (can be archived/removed later)

## API Differences

### Backend (@uicp/tools)
| Local Implementation | Linked Package |
|---------------------|----------------|
| Pre-configured tools exported | Functions exported that you wrap in tool definitions |
| `uicpTools.get_ui_components` | `getUIComponents(definitionsPath, params)` |
| `uicpTools.create_ui_component` | `createUIComponent(definitionsPath, params)` |

### Frontend (@uicp/parser)
| Local Implementation | Linked Package |
|---------------------|----------------|
| `parseUICPContent(content)` | `parseUICPContentSync(content, definitions)` |
| Components registered in parser file | Components registered via `registerComponent()` |
| Static registry | Dynamic registration |

## Benefits of Migration
1. **Official API**: Using the standard UICP API that will be published
2. **Better Separation**: Backend and frontend concerns are separated
3. **Type Safety**: Official packages include proper TypeScript definitions
4. **Testing**: Can test the actual packages before npm publication
5. **Consistency**: Code matches the INSTALL_UICP.md guide exactly

## Testing Checklist
- [ ] Backend tools load without errors
- [ ] Frontend parser renders components correctly
- [ ] Component registration works (NBAGameScore, NewsArticlePreview, etc.)
- [ ] UICP blocks are properly extracted and rendered
- [ ] Incomplete UICP blocks are handled gracefully
- [ ] Tool calls in chat API work correctly

## Next Steps
1. Test the integration with actual chat interactions
2. Verify all components render properly
3. Monitor for any console errors
4. Once confirmed working, the local `lib/uicp/` implementations can be archived or removed

## Notes
- The linked packages are symlinked, not copied, so changes to the source packages will be reflected immediately
- No changes to `package.json` are visible with `npm link` (this is expected)
- The `definitions.json` file remains in the same location and is used by both packages

