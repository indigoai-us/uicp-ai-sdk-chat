import { getOrders, getTrackingInformation, ORDERS } from "@/components/data";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { Arcade } from "@arcadeai/arcadejs";
import {
  toZodToolSet,
  executeOrAuthorizeZodTool,
} from "@arcadeai/arcadejs/lib";
import { uicpTools } from "@/lib/uicp/tools";

// Configure which Arcade toolkits to load
// Toolkit names should match the MCP Server names (e.g., "GoogleSearch", "Gmail", "Slack")
const ARCADE_TOOLKITS = [
  "GoogleSearch", // For GoogleSearch.Search tool
  // Add more toolkits here:
  // "Gmail",
  // "Slack",
  // "GitHub",
];

// Helper function to load Arcade tools from specific toolkits
async function loadArcadeTools(userId: string) {
  const arcade = new Arcade({
    apiKey: process.env.ARCADE_API_KEY,
    baseURL: process.env.ARCADE_BASE_URL,
  });

  const allTools: any[] = [];

  // Load tools from each specified toolkit
  for (const toolkitName of ARCADE_TOOLKITS) {
    try {
      const toolkitData = await arcade.tools.list({ 
        toolkit: toolkitName,
        limit: 50 
      });
      
      if (toolkitData.items.length > 0) {
        console.log(`✅ Loaded ${toolkitData.items.length} tool(s) from "${toolkitName}" toolkit`);
        allTools.push(...toolkitData.items);
      } else {
        console.warn(`⚠️  No tools found for toolkit "${toolkitName}"`);
      }
    } catch (error) {
      console.error(`❌ Failed to load toolkit "${toolkitName}":`, error);
    }
  }

  console.log(`📦 Total Arcade tools loaded: ${allTools.length}`);

  // Convert Arcade tools to Zod format for Vercel AI SDK
  const arcadeTools = toZodToolSet({
    tools: allTools,
    client: arcade,
    userId,
    executeFactory: executeOrAuthorizeZodTool,
  });

  return arcadeTools;
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Generate a user ID (in production, use your app's user ID)
  const userId = request.headers.get("x-user-id") || "default-user";

  // Load Arcade tools
  const arcadeTools = await loadArcadeTools(userId);

  // Define your custom tools
  const customTools = {
    ...uicpTools,
  };

  // Merge custom tools with Arcade tools
  const allTools = {
    ...customTools,
    ...arcadeTools,
  };
  

  const stream = streamText({
    model: openai("gpt-4o"),
    system: `\
      You are a helpful AI assistant with access to various tools.

      Today's date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
      
      CRITICAL INSTRUCTION:
      After using ANY tools, you MUST provide a natural language response to the user.
      NEVER finish without writing a text response.
      
      Tool Usage Pattern:
      1. FIRST: Always call get_ui_components to check what visual components are available
      2. Use other tools to gather information if needed
      3. If a component fits, call create_ui_component
      4. Write your final text response to the user
      
      UICP (User Interface Context Protocol) - MANDATORY WORKFLOW:
      
      RULE: Before preparing ANY response, you MUST call get_ui_components to check for visual components.
      This is required for every user request - it only takes a moment and greatly improves UX.
      
      Full workflow:
      
      STEP 1 (MANDATORY): Call get_ui_components
              - You can filter by type (e.g. "sports", "news") or leave empty to see all
              - This shows you what visual components are available
      
      STEP 2 (IF NEEDED): Use other tools (like search) to gather information
      
      STEP 3 (IF COMPONENT AVAILABLE): If you found a matching component in step 1:
              - Call create_ui_component with:
                * uid: the component identifier (e.g. "NBAGameScore", "NewsArticlePreview")
                * data: object with all required fields from the schema
              - This returns a "uicp_block" string
      
      STEP 4 (MANDATORY): Write your final text response:
              - Include friendly text
              - If you created a component, paste the ENTIRE uicp_block in your response
              - You MUST respond with text - tool calls alone are not enough!
      
      Example: User asks "What's the latest tech news?"
      1. Call get_ui_components → find "NewsArticlePreview"
      2. Call search → get article info
      3. Call create_ui_component with article data → get uicp_block
      4. Write: "Here's the latest: [paste uicp_block] Interesting developments!"
      
      REMEMBER: Always check for components first, always respond with text!
    `,
    messages,
    maxSteps: 10,
    tools: allTools,
    experimental_continueSteps: true,
    onChunk({ chunk }) {
      // Log tool calls
      if (chunk.type === 'tool-call') {
        console.log('🔧 Tool call:', chunk.toolName);
      }
    },
  });

  return stream.toDataStreamResponse();
}
