import React from 'react';
import definitions from './definitions.json';

// Import all components statically
// This ensures they're bundled properly and available immediately
import { NBAGameScore } from '@/components/nba-game-score';
import { NewsArticlePreview } from '@/components/news-article-preview';

// Component registry - maps UIDs to React components
// Components are registered based on definitions.json
const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Auto-populate based on definitions
  NBAGameScore: NBAGameScore,
  NewsArticlePreview: NewsArticlePreview,
};

export interface UICPBlock {
  uid: string;
  data: Record<string, any>;
}

/**
 * Gets a component from the registry
 * Logs helpful debug info if component not found
 */
function getComponent(uid: string): React.ComponentType<any> | null {
  return COMPONENT_REGISTRY[uid] || null;
}

export interface ParsedContent {
  type: 'text' | 'component';
  content: string | React.ReactElement;
  key: string;
}

/**
 * Extracts UICP blocks from markdown text
 * Looks for ```uicp code blocks and parses the JSON inside
 * Truncates content at incomplete UICP blocks to prevent showing raw code
 */
export function extractUICPBlocks(content: string): {
  blocks: UICPBlock[];
  contentWithPlaceholders: string;
} {
  const blocks: UICPBlock[] = [];
  const uicpRegex = /```uicp\s*\n([\s\S]*?)```/g;
  let match;
  let contentWithPlaceholders = content;

  // First, handle complete blocks
  while ((match = uicpRegex.exec(content)) !== null) {
    try {
      const jsonContent = match[1].trim();
      const parsed = JSON.parse(jsonContent);

      if (parsed.uid && parsed.data) {
        const placeholderId = `__UICP_BLOCK_${blocks.length}__`;
        blocks.push(parsed);
        contentWithPlaceholders = contentWithPlaceholders.replace(
          match[0],
          placeholderId
        );
      }
    } catch (error) {
      console.error('[UICP] Failed to parse UICP block:', error);
      // Leave the original block in place if parsing fails
    }
  }

  // Check for incomplete UICP blocks (started but not finished)
  // If found, truncate content RIGHT BEFORE the incomplete block starts
  const incompleteBlockMatch = contentWithPlaceholders.match(/```uicp/);
  if (incompleteBlockMatch && incompleteBlockMatch.index !== undefined) {
    // Truncate everything from the start of the incomplete block
    // and trim trailing whitespace for clean display
    contentWithPlaceholders = contentWithPlaceholders.substring(0, incompleteBlockMatch.index).trimEnd();
  }

  return { blocks, contentWithPlaceholders };
}

/**
 * Validates a UICP block against component definitions
 */
export function validateUICPBlock(block: UICPBlock): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if component exists
  const component = definitions.components.find((c) => c.uid === block.uid);
  if (!component) {
    errors.push(`Unknown component UID: ${block.uid}`);
    return { valid: false, errors };
  }

  // Check required fields
  Object.entries(component.inputs).forEach(([key, schema]: [string, any]) => {
    if (schema.required && !(key in block.data)) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Renders a UICP block as a React component
 */
export function renderUICPBlock(
  block: UICPBlock,
  key: string
): React.ReactElement | null {
  const { valid, errors } = validateUICPBlock(block);

  if (!valid) {
    return (
      <div
        key={key}
        className="border border-red-500 bg-red-950 p-4 rounded-lg my-2"
      >
        <p className="text-red-400 font-semibold">Invalid UICP Component</p>
        <ul className="text-red-300 text-sm mt-2 list-disc list-inside">
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  const Component = getComponent(block.uid);

  if (!Component) {
    return (
      <div
        key={key}
        className="border border-yellow-500 bg-yellow-950 p-4 rounded-lg my-2"
      >
        <p className="text-yellow-400 font-semibold">
          Component Not Available: {block.uid}
        </p>
        <p className="text-yellow-300 text-sm mt-2">
          This component needs to be imported and registered in parser.tsx
        </p>
      </div>
    );
  }

  return <Component key={key} {...block.data} />;
}

/**
 * Main parser function that processes content with UICP blocks
 * Returns an array of text and component elements
 */
export function parseUICPContent(content: string): ParsedContent[] {
  const { blocks, contentWithPlaceholders } = extractUICPBlocks(content);

  if (blocks.length === 0) {
    return [{ type: 'text', content, key: 'text-0' }];
  }

  const result: ParsedContent[] = [];
  const parts = contentWithPlaceholders.split(/(__UICP_BLOCK_\d+__)/);

  parts.forEach((part, index) => {
    const placeholderMatch = part.match(/__UICP_BLOCK_(\d+)__/);

    if (placeholderMatch) {
      const blockIndex = parseInt(placeholderMatch[1], 10);
      const block = blocks[blockIndex];

      if (block) {
        const component = renderUICPBlock(block, `component-${blockIndex}`);
        if (component) {
          result.push({
            type: 'component',
            content: component,
            key: `component-${blockIndex}`,
          });
        }
      }
    } else if (part.trim()) {
      result.push({
        type: 'text',
        content: part,
        key: `text-${index}`,
      });
    }
  });

  return result;
}

/**
 * Helper function to check if content contains UICP blocks (complete or incomplete)
 */
export function hasUICPBlocks(content: string): boolean {
  // Check for complete blocks OR incomplete blocks (just the opening)
  return /```uicp/.test(content);
}

/**
 * Helper to pre-register a component in the registry
 * Useful for eager loading or avoiding dynamic imports
 * 
 * @example
 * import { NBAGameScore } from '@/components/nba-game-score';
 * registerComponent('NBAGameScore', NBAGameScore);
 */
export function registerComponent(uid: string, component: React.ComponentType<any>) {
  COMPONENT_REGISTRY[uid] = component;
}

/**
 * Get all registered components
 */
export function getRegisteredComponents(): string[] {
  return Object.keys(COMPONENT_REGISTRY);
}

