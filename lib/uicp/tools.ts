import { tool } from 'ai';
import { z } from 'zod';
import definitions from './definitions.json';

/**
 * Tool for discovering available UI components
 * Allows the AI to query what components are available and their schemas
 */
export const getUIComponentsTool = tool({
  description: `Discover available UI components that can be used in responses. 
    Use this tool to find out what custom UI components are available, their input schemas, and examples.
    This is useful when you want to display rich, interactive content like sports scores, charts, or other visual elements.`,
  parameters: z.object({
    component_type: z
      .string()
      .optional()
      .describe('Filter by component type (e.g., "sports", "chart", "card")'),
    uid: z
      .string()
      .optional()
      .describe('Get a specific component by its unique identifier'),
  }),
  execute: async ({ component_type, uid }) => {
    // Filter components based on parameters
    let components = definitions.components;

    if (uid) {
      components = components.filter((c) => c.uid === uid);
    } else if (component_type) {
      components = components.filter((c) => c.type === component_type);
    }

    if (components.length === 0) {
      return {
        success: false,
        message: uid
          ? `No component found with UID: ${uid}`
          : component_type
            ? `No components found with type: ${component_type}`
            : 'No components available',
        available_types: [...new Set(definitions.components.map((c) => c.type))],
      };
    }

    return {
      success: true,
      version: definitions.version,
      components: components.map((c) => ({
        uid: c.uid,
        type: c.type,
        description: c.description,
        inputs: c.inputs,
        example: c.example,
      })),
      usage: {
        instructions:
          'Use the create_ui_component tool to generate a UICP block with the component data',
        format:
          'UICP blocks are code blocks with ```uicp prefix containing JSON with uid and data',
      },
    };
  },
});

/**
 * Tool for creating UICP blocks
 * Takes component data and formats it as a parseable UICP block
 */
export const createUIComponentTool = tool({
  description: `Create a UICP (User Interface Context Protocol) block for rendering a custom UI component.
    This tool validates the component data against the schema and returns a formatted code block
    that will be parsed and rendered as a rich UI component in the chat interface.
    Always use this tool after discovering components with get_ui_components.`,
  parameters: z.object({
    uid: z
      .string()
      .describe(
        'The unique identifier of the component (e.g., "NBAGameScore")'
      ),
    data: z
      .record(z.any())
      .describe(
        'The data object containing all required and optional fields for the component'
      ),
  }),
  execute: async ({ uid, data }) => {
    // Find the component definition
    const component = definitions.components.find((c) => c.uid === uid);

    if (!component) {
      return {
        success: false,
        error: `Unknown component UID: ${uid}`,
        available_components: definitions.components.map((c) => c.uid),
      };
    }

    // Validate required fields
    const missingFields: string[] = [];
    Object.entries(component.inputs).forEach(([key, schema]: [string, any]) => {
      if (schema.required && !(key in data)) {
        missingFields.push(key);
      }
    });

    if (missingFields.length > 0) {
      return {
        success: false,
        error: 'Missing required fields',
        missing_fields: missingFields,
        component_schema: component.inputs,
      };
    }

    // Create the UICP block
    const uicpBlock = {
      uid,
      data,
    };

    // Return the formatted UICP code block as a string
    const formattedBlock = '```uicp\n' + JSON.stringify(uicpBlock, null, 2) + '\n```';

    return {
      success: true,
      message: `Successfully created ${component.type} component: ${uid}`,
      uicp_block: formattedBlock,
      instructions: {
        usage: 'Include the uicp_block string directly in your response text',
        note: 'The UICP block will be automatically parsed and rendered as a visual component',
      },
    };
  },
});

// Export both tools as a collection for easy integration
export const uicpTools = {
  get_ui_components: getUIComponentsTool,
  create_ui_component: createUIComponentTool,
};

