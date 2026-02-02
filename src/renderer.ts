import type { TreeNode } from './parser'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface FlattenedRow {
  depth: number
  name: string
  isFolder: boolean
  comment?: string
  // For each depth level, whether to show a vertical line (true) or empty space (false)
  verticalLines: boolean[]
  isLast: boolean
}

function flattenTree(
  nodes: TreeNode[],
  depth: number = 0,
  verticalLines: boolean[] = []
): FlattenedRow[] {
  const rows: FlattenedRow[] = []

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1

    rows.push({
      depth,
      name: node.name,
      isFolder: node.isFolder,
      comment: node.comment,
      verticalLines: [...verticalLines],
      isLast,
    })

    // Recurse into children
    if (node.children.length > 0) {
      // For children, add vertical line if this node is not last
      const childRows = flattenTree(
        node.children,
        depth + 1,
        [...verticalLines, !isLast]
      )
      rows.push(...childRows)
    }
  })

  return rows
}

export function renderTreeHtml(nodes: TreeNode[]): string {
  const rows = flattenTree(nodes)

  const tableRows = rows.map(row => {
    const nameHtml = row.isFolder
      ? `<strong>${escapeHtml(row.name)}</strong>`
      : escapeHtml(row.name)

    const commentHtml = row.comment
      ? `<span class="tree-comment">${escapeHtml(row.comment)}</span>`
      : ''

    // Build the indentation with CSS lines
    let indentHtml = ''

    // Add vertical line segments for each depth level
    for (let i = 0; i < row.verticalLines.length; i++) {
      const hasLine = row.verticalLines[i]
      indentHtml += `<span class="tree-indent${hasLine ? ' tree-vline' : ''}"></span>`
    }

    // Add the branch connector for non-root nodes
    if (row.depth > 0) {
      const branchClass = row.isLast ? 'tree-corner' : 'tree-branch'
      indentHtml += `<span class="tree-indent ${branchClass}"></span>`
    }

    return `
      <tr>
        <td class="tree-structure">${indentHtml}<span class="tree-name">${nameHtml}</span></td>
        <td class="tree-comment-cell">${commentHtml}</td>
      </tr>
    `
  }).join('')

  return `
    <div class="tree-container">
      <table class="tree-table">
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `
}
