# tree-to-html

Parse ASCII tree structures and render as HTML tables with semantic class names.

## Installation

```bash
npm install tree-to-html
```

Or install from GitHub:

```json
{
  "dependencies": {
    "tree-to-html": "github:iafan/tree-to-html"
  }
}
```

## Usage

```typescript
import { renderTree } from 'tree-to-html'

const ascii = `
src/
├── index.ts        # Entry point
├── parser.ts       # Tree parsing logic
└── renderer.ts     # HTML rendering
`

const html = renderTree(ascii)
```

### API

#### `renderTree(source: string): string`

Parse ASCII tree structure and render as HTML table.

#### `parseTree(source: string): TreeNode[]`

Parse ASCII tree structure into an array of TreeNode objects.

#### `renderTreeHtml(nodes: TreeNode[]): string`

Render TreeNode array as HTML.

#### `TreeNode` interface

```typescript
interface TreeNode {
  name: string
  comment?: string
  isFolder: boolean
  depth: number
  children: TreeNode[]
}
```

## Output HTML Classes

The package is style-agnostic. You provide your own CSS. The following classes are used:

| Class | Description |
|-------|-------------|
| `.tree-container` | Wrapper div |
| `.tree-table` | Table element |
| `.tree-structure` | Cell with tree structure |
| `.tree-indent` | Indentation span |
| `.tree-vline` | Vertical line segment |
| `.tree-branch` | Branch connector (├) |
| `.tree-corner` | Corner connector (└) |
| `.tree-name` | Node name span |
| `.tree-comment-cell` | Comment cell |
| `.tree-comment` | Comment text span |

## Example CSS

```css
.tree-container {
  margin: 16px 0;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
  overflow-x: auto;
}

.tree-table {
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1;
}

.tree-table td {
  padding: 0;
  border: none;
  vertical-align: middle;
  height: 28px;
}

.tree-structure {
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.tree-indent {
  display: inline-block;
  width: 24px;
  height: 28px;
  position: relative;
  flex-shrink: 0;
}

.tree-vline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ccc;
}

.tree-branch::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ccc;
}

.tree-branch::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  width: 12px;
  height: 2px;
  background-color: #ccc;
}

.tree-corner::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  height: calc(50% + 1px);
  width: 2px;
  background-color: #ccc;
}

.tree-corner::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  width: 12px;
  height: 2px;
  background-color: #ccc;
}

.tree-name {
  padding-left: 6px;
}

.tree-name strong {
  font-weight: 600;
}

.tree-comment-cell {
  padding-left: 24px;
  white-space: nowrap;
}

.tree-comment {
  color: #666;
  font-style: italic;
}
```

## License

This is free and unencumbered software released into the public domain (Unlicense).
