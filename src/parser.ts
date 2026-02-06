export interface TreeNode {
  name: string
  comment?: string
  isFolder: boolean
  depth: number
  children: TreeNode[]
}

interface ParsedLine {
  depth: number
  name: string
  comment?: string
  isFolder: boolean
}

function parseLine(line: string): ParsedLine | null {
  if (!line.trim()) return null

  // Find the position of the branch character (├ or └) to determine depth
  // Each indentation level is 4 characters wide
  const INDENT_WIDTH = 4

  // Check for gap lines (only vertical bars │/| and whitespace, with optional comment)
  if (!/[├└─]/.test(line) && /[│|]/.test(line)) {
    const stripped = line.replace(/[│|\s]/g, '')
    if (stripped === '' || /^(#|\/\/)/.test(stripped)) {
      let maxPos = 0
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '│' || line[i] === '|') {
          maxPos = i
        }
      }
      const depth = Math.floor(maxPos / INDENT_WIDTH) + 1

      let comment: string | undefined
      const commentMatch = line.match(/(#|\/\/)(.*)$/)
      if (commentMatch) {
        comment = commentMatch[2].trim() || undefined
        if (comment) {
          comment = comment.replace(/->/g, '→').replace(/<-/g, '←')
        }
      }

      return {
        depth,
        name: '',
        comment,
        isFolder: false,
      }
    }
  }

  // Find the last branch character (├ or └)
  let branchPos = -1
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '├' || line[i] === '└') {
      branchPos = i
    }
  }

  let depth: number
  let rest: string

  if (branchPos >= 0) {
    // Depth is based on the position of the branch character
    depth = Math.floor(branchPos / INDENT_WIDTH) + 1

    // Find where the name starts (after ├── or └── or ├─ or └─)
    const afterBranch = line.slice(branchPos)
    const nameMatch = afterBranch.match(/^[├└]─+\s*/)
    if (nameMatch) {
      rest = afterBranch.slice(nameMatch[0].length)
    } else {
      rest = afterBranch.slice(1).trim()
    }
  } else {
    // No branch character - this is a root node
    depth = 0
    rest = line.trim()
  }

  // Split name and comment
  // Comments start with # or //
  let name: string
  let comment: string | undefined

  const commentMatch = rest.match(/^(.+?)\s+(#|\/\/)(.*)$/)
  if (commentMatch) {
    name = commentMatch[1].trim()
    comment = commentMatch[3].trim()
  } else {
    name = rest.trim()
  }

  if (!name) return null

  // Convert ASCII arrows to Unicode
  name = name.replace(/->/g, '→').replace(/<-/g, '←')
  if (comment) {
    comment = comment.replace(/->/g, '→').replace(/<-/g, '←')
  }

  const isFolder = name.endsWith('/')

  return {
    depth,
    name,
    comment,
    isFolder,
  }
}

export function parseTree(source: string): TreeNode[] {
  const lines = source.split('\n')
  const parsedLines: ParsedLine[] = []

  for (const line of lines) {
    const parsed = parseLine(line)
    if (parsed) {
      parsedLines.push(parsed)
    }
  }

  // Build tree structure
  const roots: TreeNode[] = []
  const stack: { node: TreeNode; depth: number }[] = []

  for (const line of parsedLines) {
    const node: TreeNode = {
      name: line.name,
      comment: line.comment,
      isFolder: line.isFolder,
      depth: line.depth,
      children: [],
    }

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].depth >= line.depth) {
      stack.pop()
    }

    if (stack.length === 0) {
      roots.push(node)
    } else {
      stack[stack.length - 1].node.children.push(node)
    }

    stack.push({ node, depth: line.depth })
  }

  return roots
}
