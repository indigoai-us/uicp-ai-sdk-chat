# UICP Debugging Guide

## Current Issue

The AI is successfully calling the UICP tools, but messages aren't appearing on the frontend.

## What We've Fixed

1. **Removed dynamic imports** - They were causing `Module not found: Can't resolve '@'` errors
2. **Added static imports** - Components are now imported directly in `parser.tsx`
3. **Added comprehensive logging** - Every step now logs to console with `[UICP]` or `[Message]` prefix

## What to Look For in Browser Console

The logs will tell you exactly where the issue is. Here's the expected flow:

### 1. Tool Calls (Backend - Terminal)
```
🔧 Tool call: get_ui_components with args: { component_type: 'sports' }
🔧 Tool call: create_ui_component with args: { uid: 'NBAGameScore', data: {...} }
```
✅ **You're seeing this**

### 2. Message Received (Frontend - Browser Console)
```
[Message] Has UICP blocks, parsing content: Here's the game:...
```
or
```
[Message] No UICP blocks detected, text: Here's the game...
```

**Check:** Is the message even reaching the Message component?

### 3. UICP Detection (Frontend - Browser Console)
```
[UICP] parseUICPContent called with content length: 234
[UICP] Extracting blocks from content (length: 234)
[UICP] Found UICP block, parsing JSON: {"uid":"NBAGameScore"...
```

**Check:** Is `hasUICPBlocks()` detecting the UICP code block?

### 4. Block Extraction (Frontend - Browser Console)
```
[UICP] Valid block found - UID: NBAGameScore, replacing with: __UICP_BLOCK_0__
[UICP] Extracted 1 block(s)
```

**Check:** Are blocks being extracted correctly?

### 5. Block Rendering (Frontend - Browser Console)
```
[UICP] Rendering block: { uid: 'NBAGameScore', key: 'component-0' }
[UICP] Successfully rendering NBAGameScore with data: {...}
```

**Check:** Is the component being found in the registry?

### 6. Component Display (Frontend - Browser Console)
```
[Message] Rendering component: component-0
```

**Check:** Is React rendering the component?

## Common Issues

### Issue 1: No Messages at All
**Symptom:** Tool calls work, but nothing appears in chat

**Debug:**
- Check browser console for ANY logs starting with `[Message]`
- If no logs, the message isn't reaching the component
- Check network tab - is the response streaming?
- Check for JavaScript errors in console

**Fix:**
- Verify the stream is being handled correctly
- Check for errors in the data stream response

### Issue 2: Messages But No UICP Detection
**Symptom:** You see `[Message] No UICP blocks detected`

**Debug:**
- Look at what text is being received
- Check if the UICP block format is correct
- The AI should return: ` ```uicp\n{...}\n``` ` (with backticks)

**Fix:**
- Check the `create_ui_component` tool response
- Make sure the AI is including the returned `uicp_block` in its response
- The regex looks for: `/```uicp\s*\n([\s\S]*?)```/g`

### Issue 3: UICP Detected But Not Parsed
**Symptom:** You see `[UICP] Extracting blocks` but `[UICP] Extracted 0 block(s)`

**Debug:**
- Look for `[UICP] Failed to parse UICP block` error
- Check the JSON structure
- Make sure it has both `uid` and `data` fields

**Fix:**
- Verify the AI is formatting the JSON correctly
- Check for missing quotes or commas

### Issue 4: Block Parsed But Component Not Found
**Symptom:** You see `[UICP] Component not found in registry: NBAGameScore`

**Debug:**
- Check `[UICP] Available components:` log
- Verify `NBAGameScore` is in the list

**Fix:**
- Make sure component is imported in `parser.tsx`
- Check the import path is correct
- Verify component is added to `COMPONENT_REGISTRY`

### Issue 5: Everything Works But Component Doesn't Display
**Symptom:** All logs successful but no visual component

**Debug:**
- Check for React errors in console
- Look for TypeScript errors in the component file
- Check component props match the data being passed

**Fix:**
- Read any React error messages
- Verify component is rendering valid JSX
- Check CSS classes are correct

## Quick Test

To verify UICP is working end-to-end, try this in your browser console:

```javascript
import { hasUICPBlocks, parseUICPContent } from '@/lib/uicp/parser';

const testContent = `Here's a test:

\`\`\`uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Lakers",
    "awayTeam": "Celtics",
    "homeScore": 100,
    "awayScore": 95,
    "gameStatus": "final"
  }
}
\`\`\`

Great game!`;

console.log('Has blocks?', hasUICPBlocks(testContent));
console.log('Parsed:', parseUICPContent(testContent));
```

## Expected AI Response Format

The AI should return something like:

```
Here's the game from last night:

```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Golden State Warriors",
    "awayTeam": "Los Angeles Lakers",
    "homeScore": 118,
    "awayScore": 112,
    "gameDate": "Oct 24, 2025",
    "gameStatus": "final"
  }
}
```

It was a close game with the Warriors pulling ahead in the 4th quarter!
```

## Next Steps

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Ask the AI** to show you a basketball game
3. **Watch the logs** appear in real-time
4. **Find where it stops** - the last successful log tells you where the issue is
5. **Check the issue section** above for that specific problem

## Getting More Info

If you need to see exactly what the AI is returning, add this to your chat route:

```typescript
onFinish({ finishReason, text }) {
  console.log('🤖 AI Response:', text);
  console.log('📝 Finish reason:', finishReason);
}
```

This will show you the complete text response from the AI, so you can verify the UICP block format.

## Still Stuck?

If logs show everything working but you still don't see the component:

1. Check if there are any CSS issues hiding it
2. Try inspecting the DOM to see if the component HTML exists
3. Look for z-index or visibility issues
4. Check if there's a React error boundary catching errors

---

**With this logging, you should be able to pinpoint exactly where the issue is!**

