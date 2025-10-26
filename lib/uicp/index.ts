/**
 * UICP (User Interface Context Protocol) - Main exports
 * 
 * This file provides convenient imports for both the tools and parser modules.
 */

// Export all tools
export { uicpTools, getUIComponentsTool, createUIComponentTool } from './tools';

// Export all parser functions
export {
  extractUICPBlocks,
  validateUICPBlock,
  renderUICPBlock,
  parseUICPContent,
  hasUICPBlocks,
  registerComponent,
  getRegisteredComponents,
} from './parser';

// Export types
export type { UICPBlock, ParsedContent } from './parser';

// Re-export definitions for convenience
import definitions from './definitions.json';
export { definitions };

