export { parseTree, TreeNode } from './parser'
export { renderTreeHtml } from './renderer'

import { parseTree } from './parser'
import { renderTreeHtml } from './renderer'

/**
 * Parse ASCII tree structure and render as HTML table.
 * @param source - ASCII tree structure string
 * @returns HTML string with semantic class names for styling
 */
export function renderTree(source: string): string {
  const tree = parseTree(source)
  return renderTreeHtml(tree)
}
