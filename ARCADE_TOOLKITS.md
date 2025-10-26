# Arcade Toolkit Reference

Quick reference for adding Arcade toolkits to your AI agent.

## How to Add a Toolkit

Simply add the toolkit name to the `ARCADE_TOOLKITS` array in `app/(preview)/api/chat/route.ts`:

```typescript
const ARCADE_TOOLKITS = [
  "google_search",  // Already enabled
  "gmail",          // Add this line to enable Gmail tools
];
```

## Popular Toolkits

### Search & Information

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `google_search` | Search Google and return organic results | No (uses API key) |
| `google_news` | Search for news stories | No (uses API key) |
| `google_maps` | Get directions between locations | No (uses API key) |
| `youtube` | Search YouTube videos | No (uses API key) |
| `walmart` | Search Walmart products | No (uses API key) |

### Productivity & Communication

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `gmail` | Send, read, and manage emails | Yes (OAuth) |
| `google_calendar` | Manage calendar events | Yes (OAuth) |
| `google_docs` | Create and edit Google Docs | Yes (OAuth) |
| `google_sheets` | Manage spreadsheets | Yes (OAuth) |
| `google_drive` | Access Google Drive files | Yes (OAuth) |
| `slack` | Send messages and manage workspace | Yes (OAuth) |
| `notion` | Interact with Notion pages | Yes (OAuth) |
| `asana` | Manage Asana tasks and projects | Yes (OAuth) |
| `clickup` | Manage ClickUp tasks | Yes (OAuth) |

### Development

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `github` | Manage repositories, issues, PRs | Yes (OAuth) |
| `jira` | Manage Jira issues | Yes (OAuth) |
| `linear` | Manage Linear issues | Yes (OAuth) |
| `firecrawl` | Scrape and crawl websites | No (uses API key) |

### Social Media

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `x` | Post and manage X (Twitter) content | Yes (OAuth) |
| `linkedin` | Post content to LinkedIn | Yes (OAuth) |
| `reddit` | Post and comment on Reddit | Yes (OAuth) |
| `discord` | Interact with Discord servers | Yes (OAuth) |

### Business & CRM

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `hubspot` | Manage HubSpot CRM data | Yes (OAuth) |
| `salesforce` | Interact with Salesforce CRM | Yes (OAuth) |
| `zendesk` | Manage support tickets | Yes (OAuth) |

### Entertainment

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `spotify` | Control Spotify playback | Yes (OAuth) |
| `twitch` | Interact with Twitch | Yes (OAuth) |
| `imgflip` | Create and manage memes | No (uses API key) |

### Payments & Finance

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `stripe` | Manage Stripe payments | No (uses API key) |

### Databases

| Toolkit Name | Description | Auth Required |
|-------------|-------------|---------------|
| `postgres` | Query PostgreSQL databases | No (connection string) |
| `mongodb` | Query MongoDB databases | No (connection string) |
| `clickhouse` | Query ClickHouse databases | No (connection string) |

## Example Configurations

### Basic Setup (No Auth Required)
```typescript
const ARCADE_TOOLKITS = [
  "google_search",
  "google_news",
  "google_maps",
];
```

### Productivity Suite (OAuth Required)
```typescript
const ARCADE_TOOLKITS = [
  "gmail",
  "google_calendar",
  "google_docs",
  "google_sheets",
  "google_drive",
];
```

### Developer Tools (OAuth Required)
```typescript
const ARCADE_TOOLKITS = [
  "github",
  "jira",
  "linear",
  "slack",
];
```

### Complete Setup (Mix of Auth and No-Auth)
```typescript
const ARCADE_TOOLKITS = [
  // Search (no auth)
  "google_search",
  "google_news",
  
  // Productivity (OAuth)
  "gmail",
  "google_calendar",
  "slack",
  
  // Development (OAuth)
  "github",
  "linear",
];
```

## Authorization Notes

- **No Auth Required**: These tools work immediately with just the Arcade API key
- **OAuth Required**: Users must authorize these tools before first use
  - The tool will return an authorization URL
  - User visits the URL to grant permissions
  - After authorization, tools work automatically

## Finding More Tools

Browse the complete catalog at: https://docs.arcade.dev/en/mcp-servers.md

Each toolkit page includes:
- Available tools and their parameters
- Authentication requirements
- Code examples
- Setup instructions

## Environment Variables for Specific Tools

Some tools require additional configuration beyond the Arcade API key:

### Google Search Tools
Already configured in Arcade Cloud (no extra setup needed)

### Database Tools (Postgres, MongoDB, ClickHouse)
Require connection strings set in your Arcade Dashboard under Secrets:
- `POSTGRES_CONNECTION_STRING`
- `MONGODB_CONNECTION_STRING`
- `CLICKHOUSE_CONNECTION_STRING`

### Third-Party API Tools (Stripe, Firecrawl, etc.)
Require API keys set in your Arcade Dashboard under Secrets:
- `STRIPE_API_KEY`
- `FIRECRAWL_API_KEY`
- etc.

For self-hosted Arcade, these can be set as environment variables.

