# Automatic Multiple Tool Steps Preview

This example demonstrates how to use the [Vercel AI SDK](https://sdk.vercel.ai/docs) with [Next.js](https://nextjs.org/) and the `streamText` function to automatically handle multiple tool steps.

## ✨ Features

### 🚀 Arcade Tools Integration
This project integrates [Arcade](https://arcade.dev) tools, giving your AI agent access to real-world capabilities like Google Search, Gmail, Slack, GitHub, and more. See [ARCADE_SETUP.md](./ARCADE_SETUP.md) for setup instructions.

### 🎨 UICP - User Interface Context Protocol
This project implements UICP, a protocol that enables AI models to dynamically discover and render custom UI components. The AI can create rich, interactive visual components like NBA game scores, charts, and more. See [UICP_QUICK_START.md](./UICP_QUICK_START.md) to get started and [UICP_IMPLEMENTATION.md](./UICP_IMPLEMENTATION.md) for detailed documentation.

**Try it**: Ask the AI "Show me a Lakers vs Celtics game" and watch it create a beautiful game score component!

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-roundtrips&env=OPENAI_API_KEY&envDescription=API%20keys%20needed%20for%20application&envLink=platform.openai.com)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

```bash
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

```bash
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-roundtrips ai-sdk-preview-roundtrips-example
```

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).
2. Sign up for an [Arcade](https://arcade.dev) account and obtain an API key.
3. Obtain API keys for each provider.
4. Set the required environment variables in a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ARCADE_API_KEY=your_arcade_api_key
   ARCADE_BASE_URL=https://api.arcade-ai.com
   ```
5. `npm install` to install the required dependencies.
6. `npm run dev` to launch the development server.

For detailed Arcade setup instructions, see [ARCADE_SETUP.md](./ARCADE_SETUP.md).


## Learn More

To learn more about Vercel AI SDK or Next.js take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [Next.js Documentation](https://nextjs.org/docs)
