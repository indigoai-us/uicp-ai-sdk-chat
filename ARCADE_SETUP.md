# Arcade Integration Setup

This project integrates [Arcade](https://arcade.dev) tools with the Vercel AI SDK to provide AI agents with real-world capabilities.

## Environment Variables

Make sure the following environment variables are set in your `.env.local` file:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Arcade Configuration
ARCADE_API_KEY=your_arcade_api_key_here
ARCADE_BASE_URL=https://api.arcade-ai.com
```

### Getting Your Arcade API Key

1. Sign up at [Arcade.dev](https://arcade.dev)
2. Navigate to your dashboard
3. Generate an API key from the API Keys section
4. Add it to your `.env.local` file

## Currently Enabled Toolkits

The following Arcade toolkits are currently enabled:

- **Google Search** (`google_search`) - Search Google and return organic results

## Adding More Toolkits

To add more Arcade toolkits, simply edit the `ARCADE_TOOLKITS` array in `app/(preview)/api/chat/route.ts`:

```typescript
const ARCADE_TOOLKITS = [
  "google_search",
  "gmail",      // Uncomment to enable Gmail tools
  "slack",      // Uncomment to enable Slack tools
  "github",     // Uncomment to enable GitHub tools
  // Add more toolkits here...
];
```

### Available Toolkits

Browse the complete list of available toolkits at [Arcade MCP Servers](https://docs.arcade.dev/en/mcp-servers.md).

Popular options include:
- `gmail` - Send, read, and manage emails
- `slack` - Send messages and manage Slack workspace
- `github` - Manage repositories, issues, and pull requests
- `google_calendar` - Manage calendar events
- `notion` - Interact with Notion pages
- `linkedin` - Post content to LinkedIn
- And many more...

## User Authorization

Some tools (like Gmail, Slack, GitHub) require user authorization via OAuth. When a user first attempts to use these tools:

1. The tool will return an authorization URL
2. The user needs to visit this URL to grant permissions
3. Once authorized, the tool will work automatically for that user

The `executeOrAuthorizeZodTool` factory handles this authorization flow automatically.

## User Identification

The system uses a `userId` to track which user is making requests. In the current implementation:

```typescript
const userId = request.headers.get("x-user-id") || "default-user";
```

For production, you should:
1. Implement proper user authentication
2. Pass the authenticated user's ID as the `userId`
3. This ensures tools are executed with the correct user's permissions

## Testing

To test the Google Search tool:

1. Start your development server: `npm run dev`
2. Open your chat interface
3. Ask a question like: "Search for the latest news about AI"
4. The agent will use the Google Search tool to find relevant information

## Error Handling

The implementation includes error handling for toolkit loading:
- If a toolkit fails to load, the error is logged but other toolkits continue loading
- This ensures partial functionality even if one toolkit has issues

## Documentation

- [Arcade Documentation](https://docs.arcade.dev)
- [Using Arcade with Vercel AI](https://docs.arcade.dev/en/home/vercelai/using-arcade-tools)
- [Available MCP Servers](https://docs.arcade.dev/en/mcp-servers.md)
- [Authorization Guide](https://docs.arcade.dev/en/home/auth/auth-tool-calling)

