"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  parseTree: () => parseTree,
  renderTree: () => renderTree,
  renderTreeHtml: () => renderTreeHtml
});
module.exports = __toCommonJS(index_exports);

// src/parser.ts
function parseLine(line) {
  if (!line.trim()) return null;
  const INDENT_WIDTH = 4;
  let branchPos = -1;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\u251C" || line[i] === "\u2514") {
      branchPos = i;
    }
  }
  let depth;
  let rest;
  if (branchPos >= 0) {
    depth = Math.floor(branchPos / INDENT_WIDTH) + 1;
    const afterBranch = line.slice(branchPos);
    const nameMatch = afterBranch.match(/^[├└]─+\s*/);
    if (nameMatch) {
      rest = afterBranch.slice(nameMatch[0].length);
    } else {
      rest = afterBranch.slice(1).trim();
    }
  } else {
    depth = 0;
    rest = line.trim();
  }
  let name;
  let comment;
  const commentMatch = rest.match(/^(.+?)\s+(#|\/\/)(.*)$/);
  if (commentMatch) {
    name = commentMatch[1].trim();
    comment = commentMatch[3].trim();
  } else {
    name = rest.trim();
  }
  if (!name) return null;
  name = name.replace(/->/g, "\u2192").replace(/<-/g, "\u2190");
  if (comment) {
    comment = comment.replace(/->/g, "\u2192").replace(/<-/g, "\u2190");
  }
  const isFolder = name.endsWith("/");
  return {
    depth,
    name,
    comment,
    isFolder
  };
}
function parseTree(source) {
  const lines = source.split("\n");
  const parsedLines = [];
  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed) {
      parsedLines.push(parsed);
    }
  }
  const roots = [];
  const stack = [];
  for (const line of parsedLines) {
    const node = {
      name: line.name,
      comment: line.comment,
      isFolder: line.isFolder,
      depth: line.depth,
      children: []
    };
    while (stack.length > 0 && stack[stack.length - 1].depth >= line.depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].node.children.push(node);
    }
    stack.push({ node, depth: line.depth });
  }
  return roots;
}

// src/renderer.ts
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function flattenTree(nodes, depth = 0, verticalLines = []) {
  const rows = [];
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    rows.push({
      depth,
      name: node.name,
      isFolder: node.isFolder,
      comment: node.comment,
      verticalLines: [...verticalLines],
      isLast
    });
    if (node.children.length > 0) {
      const childRows = flattenTree(
        node.children,
        depth + 1,
        [...verticalLines, !isLast]
      );
      rows.push(...childRows);
    }
  });
  return rows;
}
function renderTreeHtml(nodes) {
  const rows = flattenTree(nodes);
  const tableRows = rows.map((row) => {
    const nameHtml = row.isFolder ? `<strong>${escapeHtml(row.name)}</strong>` : escapeHtml(row.name);
    const commentHtml = row.comment ? `<span class="tree-comment">${escapeHtml(row.comment)}</span>` : "";
    let indentHtml = "";
    for (let i = 0; i < row.verticalLines.length; i++) {
      const hasLine = row.verticalLines[i];
      indentHtml += `<span class="tree-indent${hasLine ? " tree-vline" : ""}"></span>`;
    }
    if (row.depth > 0) {
      const branchClass = row.isLast ? "tree-corner" : "tree-branch";
      indentHtml += `<span class="tree-indent ${branchClass}"></span>`;
    }
    return `
      <tr>
        <td class="tree-structure">${indentHtml}<span class="tree-name">${nameHtml}</span></td>
        <td class="tree-comment-cell">${commentHtml}</td>
      </tr>
    `;
  }).join("");
  return `
    <div class="tree-container">
      <table class="tree-table">
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
}

// src/index.ts
function renderTree(source) {
  const tree = parseTree(source);
  return renderTreeHtml(tree);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseTree,
  renderTree,
  renderTreeHtml
});
//# sourceMappingURL=index.cjs.map