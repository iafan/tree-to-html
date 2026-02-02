interface TreeNode {
    name: string;
    comment?: string;
    isFolder: boolean;
    depth: number;
    children: TreeNode[];
}
declare function parseTree(source: string): TreeNode[];

declare function renderTreeHtml(nodes: TreeNode[]): string;

/**
 * Parse ASCII tree structure and render as HTML table.
 * @param source - ASCII tree structure string
 * @returns HTML string with semantic class names for styling
 */
declare function renderTree(source: string): string;

export { type TreeNode, parseTree, renderTree, renderTreeHtml };
